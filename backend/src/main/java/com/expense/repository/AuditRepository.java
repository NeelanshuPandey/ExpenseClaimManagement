package com.expense.repository;
import com.expense.entity.*; import org.springframework.data.jpa.repository.JpaRepository; import java.util.List;
public interface AuditRepository extends JpaRepository<ClaimAudit,Long>{List<ClaimAudit> findByClaimIdOrderByHappenedAtAsc(Long claimId);}
