package com.expense.controller;

import com.expense.dto.ClaimDtos.ClaimResponse;
import com.expense.dto.ClaimDtos.ReviewRequest;
import com.expense.service.ClaimCsvService;
import com.expense.service.ClaimService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/manager")
@Tag(name = "Manager", description = "Review and export claims assigned to the authenticated manager")
@SecurityRequirement(name = "bearerAuth")
public class ManagerController {

    private final ClaimService claimService;
    private final ClaimCsvService claimCsvService;

    public ManagerController(ClaimService claimService, ClaimCsvService claimCsvService) {
        this.claimService = claimService;
        this.claimCsvService = claimCsvService;
    }

    @GetMapping("/claims")
    @Operation(
            summary = "List assigned claims",
            description = "Filters claims by status, employee, and inclusive expense date range.")
    public Page<ClaimResponse> all(
            Authentication authentication,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String employee,
            @RequestParam(required = false) String from,
            @RequestParam(required = false) String to,
            Pageable pageable) {
        return claimService.managerList(
                authentication.getName(), status, employee, from, to, pageable);
    }

    @GetMapping(value = "/claims/export.csv", produces = "text/csv")
    @Operation(
            summary = "Export assigned claims as CSV",
            description = "Exports all assigned claims matching the supplied filters.")
    public ResponseEntity<byte[]> export(
            Authentication authentication,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String employee,
            @RequestParam(required = false) String from,
            @RequestParam(required = false) String to) {
        byte[] csv = claimCsvService.export(
                authentication.getName(), status, employee, from, to);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("text/csv;charset=UTF-8"))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=expense-claims.csv")
                .body(csv);
    }

    @PatchMapping("/claims/{id}/review")
    @Operation(
            summary = "Approve or reject a claim",
            description = "A comment is required for rejection.")
    public ClaimResponse review(
            Authentication authentication,
            @PathVariable Long id,
            @Valid @RequestBody ReviewRequest request) {
        return claimService.review(authentication.getName(), id, request);
    }
}
