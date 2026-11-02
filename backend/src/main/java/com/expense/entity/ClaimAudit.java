package com.expense.entity;
import jakarta.persistence.*;
import java.time.Instant;
@Entity @Table(name="claim_audits")
public class ClaimAudit {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(nullable=false) private Long claimId;
 @ManyToOne(optional=false) private AppUser actor;
 @Column(nullable=false) private String action;
 @Column(length=2000) private String details;
 @Column(nullable=false) private Instant happenedAt=Instant.now();
 protected ClaimAudit(){}
 public ClaimAudit(ExpenseClaim c, AppUser a, String action, String details){claimId=c.getId();actor=a;this.action=action;this.details=details;}
 public Long getId(){return id;} public AppUser getActor(){return actor;} public String getAction(){return action;}
 public String getDetails(){return details;} public Instant getHappenedAt(){return happenedAt;}
}
