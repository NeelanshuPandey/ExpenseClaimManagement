package com.expense.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.Instant;

@Entity @Table(name="expense_claims")
public class ExpenseClaim {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @ManyToOne(optional=false) private AppUser employee;
 @ManyToOne private AppUser assignedManager;
 @Column(nullable=false) private String title;
 @Column(nullable=false, precision=12, scale=2) private BigDecimal amount;
 @Column(nullable=false) private String category;
 @Column(nullable=false) private LocalDate expenseDate;
 @Column(length=2000) private String description;
 @Enumerated(EnumType.STRING) @Column(nullable=false) private ClaimStatus status=ClaimStatus.PENDING;
 private String receiptFileName; private String receiptStoredName;
 @ManyToOne private AppUser reviewedBy; private String managerComment;
 private Instant createdAt=Instant.now(); private Instant updatedAt=Instant.now();
 @PreUpdate void touch(){updatedAt=Instant.now();}
 public Long getId(){return id;} public AppUser getEmployee(){return employee;} public void setEmployee(AppUser v){employee=v;}
 public AppUser getAssignedManager(){return assignedManager;} public void setAssignedManager(AppUser v){assignedManager=v;}
 public String getTitle(){return title;} public void setTitle(String v){title=v;}
 public BigDecimal getAmount(){return amount;} public void setAmount(BigDecimal v){amount=v;}
 public String getCategory(){return category;} public void setCategory(String v){category=v;}
 public LocalDate getExpenseDate(){return expenseDate;} public void setExpenseDate(LocalDate v){expenseDate=v;}
 public String getDescription(){return description;} public void setDescription(String v){description=v;}
 public ClaimStatus getStatus(){return status;} public void setStatus(ClaimStatus v){status=v;}
 public String getReceiptFileName(){return receiptFileName;} public void setReceiptFileName(String v){receiptFileName=v;}
 public String getReceiptStoredName(){return receiptStoredName;} public void setReceiptStoredName(String v){receiptStoredName=v;}
 public AppUser getReviewedBy(){return reviewedBy;} public void setReviewedBy(AppUser v){reviewedBy=v;}
 public String getManagerComment(){return managerComment;} public void setManagerComment(String v){managerComment=v;}
 public Instant getCreatedAt(){return createdAt;} public Instant getUpdatedAt(){return updatedAt;}
}
