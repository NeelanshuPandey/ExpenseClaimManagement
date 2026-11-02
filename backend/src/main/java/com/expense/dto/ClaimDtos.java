package com.expense.dto;
import jakarta.validation.constraints.*; import java.math.BigDecimal; import java.time.LocalDate; import java.time.Instant;
public class ClaimDtos {
 public record ClaimRequest(@NotBlank @Size(max=180) String title,@NotNull @DecimalMin("0.01") BigDecimal amount,@NotBlank String category,@NotNull LocalDate expenseDate,@Size(max=2000) String description,@NotNull Long managerId){}
 public record ReviewRequest(@NotBlank String decision,String comment){}
 public record ClaimResponse(Long id,String title,BigDecimal amount,String category,LocalDate expenseDate,String description,String status,Long employeeId,String employeeName,String employeeEmail,Long managerId,String managerName,String managerEmail,String managerComment,String receiptFileName,Instant createdAt,Instant updatedAt){}
 public record ManagerOption(Long id,String fullName,String email){}
 public record AuditResponse(String actor,String action,String details,Instant happenedAt){}
}
