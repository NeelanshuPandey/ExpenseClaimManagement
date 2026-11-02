package com.expense.controller;
import com.expense.dto.ClaimDtos.*; import com.expense.service.ClaimService; import jakarta.validation.Valid; import org.springframework.data.domain.*; import org.springframework.security.core.Authentication; import org.springframework.web.bind.annotation.*; import java.util.List;
import org.springframework.web.multipart.MultipartFile; import org.springframework.http.*; import org.springframework.core.io.FileSystemResource; import java.nio.file.Path; import java.io.IOException;
import io.swagger.v3.oas.annotations.Operation; import io.swagger.v3.oas.annotations.security.SecurityRequirement; import io.swagger.v3.oas.annotations.tags.Tag;
@RestController @RequestMapping("/api/claims") @Tag(name="Claims",description="Create, manage, route and track expense claims") @SecurityRequirement(name="bearerAuth")
public class ClaimController {
 private final ClaimService service; public ClaimController(ClaimService s){service=s;}
 @PostMapping @Operation(summary="Create and route a claim to a manager") public ClaimResponse create(Authentication a,@Valid @RequestBody ClaimRequest r){return service.create(a.getName(),r);}
 @GetMapping("/mine") public Page<ClaimResponse> mine(Authentication a,@RequestParam(required=false)String status,@RequestParam(required=false)String search,Pageable p){return service.employeeList(a.getName(),status,search,p);}
 @GetMapping("/managers") @Operation(summary="List active managers for claim routing") public List<ManagerOption> managers(){return service.managers();}
 @PutMapping("/{id}") public ClaimResponse update(Authentication a,@PathVariable Long id,@Valid @RequestBody ClaimRequest r){return service.update(a.getName(),id,r);}
 @DeleteMapping("/{id}") public void delete(Authentication a,@PathVariable Long id){service.delete(a.getName(),id);}
 @GetMapping("/{id}/timeline") public List<AuditResponse> timeline(Authentication a,@PathVariable Long id){return service.timeline(a.getName(),id);}
 @PostMapping(value="/{id}/receipt",consumes=MediaType.MULTIPART_FORM_DATA_VALUE) public ClaimResponse receipt(Authentication a,@PathVariable Long id,@RequestParam("file") MultipartFile file)throws IOException{return service.uploadReceipt(a.getName(),id,file);}
 @GetMapping("/{id}/receipt") public ResponseEntity<FileSystemResource> getReceipt(Authentication a,@PathVariable Long id)throws IOException {Path p=service.receipt(a.getName(),id);String n=p.getFileName().toString();MediaType type=n.endsWith(".pdf")?MediaType.APPLICATION_PDF:n.endsWith(".png")?MediaType.IMAGE_PNG:n.endsWith(".webp")?MediaType.parseMediaType("image/webp"):MediaType.IMAGE_JPEG;return ResponseEntity.ok().contentType(type).header(HttpHeaders.CONTENT_DISPOSITION,"inline; filename=\""+n+"\"").body(new FileSystemResource(p));}
}
