package com.expense.repository;
import com.expense.entity.*; import org.springframework.data.jpa.repository.JpaRepository; import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
public interface ClaimRepository extends JpaRepository<ExpenseClaim,Long>, JpaSpecificationExecutor<ExpenseClaim> {java.util.List<ExpenseClaim> findByAssignedManagerIsNull();}
