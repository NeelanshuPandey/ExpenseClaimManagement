package com.expense.controller;

import com.expense.dto.ClaimDtos.AuditResponse;
import com.expense.dto.ClaimDtos.ClaimRequest;
import com.expense.dto.ClaimDtos.ClaimResponse;
import com.expense.dto.ClaimDtos.ManagerOption;
import com.expense.service.ClaimService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.core.io.FileSystemResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Path;
import java.util.List;

@RestController
@RequestMapping("/api/claims")
@Tag(name = "Claims", description = "Create, manage, route and track expense claims")
@SecurityRequirement(name = "bearerAuth")
public class ClaimController {

    private final ClaimService claimService;

    public ClaimController(ClaimService claimService) {
        this.claimService = claimService;
    }

    @PostMapping
    @Operation(summary = "Create and route a claim to a manager")
    public ClaimResponse create(
            Authentication authentication,
            @Valid @RequestBody ClaimRequest request) {
        return claimService.create(authentication.getName(), request);
    }

    @GetMapping("/mine")
    public Page<ClaimResponse> mine(
            Authentication authentication,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search,
            Pageable pageable) {
        return claimService.employeeList(authentication.getName(), status, search, pageable);
    }

    @GetMapping("/managers")
    @Operation(summary = "List active managers for claim routing")
    public List<ManagerOption> managers() {
        return claimService.managers();
    }

    @PutMapping("/{id}")
    public ClaimResponse update(
            Authentication authentication,
            @PathVariable Long id,
            @Valid @RequestBody ClaimRequest request) {
        return claimService.update(authentication.getName(), id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(Authentication authentication, @PathVariable Long id) {
        claimService.delete(authentication.getName(), id);
    }

    @GetMapping("/{id}/timeline")
    public List<AuditResponse> timeline(Authentication authentication, @PathVariable Long id) {
        return claimService.timeline(authentication.getName(), id);
    }

    @PostMapping(value = "/{id}/receipt", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ClaimResponse uploadReceipt(
            Authentication authentication,
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) throws IOException {
        return claimService.uploadReceipt(authentication.getName(), id, file);
    }

    @GetMapping("/{id}/receipt")
    public ResponseEntity<FileSystemResource> getReceipt(
            Authentication authentication,
            @PathVariable Long id) throws IOException {
        Path receiptPath = claimService.receipt(authentication.getName(), id);
        String fileName = receiptPath.getFileName().toString();
        MediaType mediaType = mediaTypeFor(fileName);

        return ResponseEntity.ok()
                .contentType(mediaType)
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "inline; filename=\"" + fileName + "\"")
                .body(new FileSystemResource(receiptPath));
    }

    private MediaType mediaTypeFor(String fileName) {
        if (fileName.endsWith(".pdf")) {
            return MediaType.APPLICATION_PDF;
        }
        if (fileName.endsWith(".png")) {
            return MediaType.IMAGE_PNG;
        }
        if (fileName.endsWith(".webp")) {
            return MediaType.parseMediaType("image/webp");
        }
        return MediaType.IMAGE_JPEG;
    }
}
