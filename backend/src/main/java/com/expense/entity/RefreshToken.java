package com.expense.entity;
import jakarta.persistence.*;
import java.time.Instant;
@Entity @Table(name="refresh_tokens")
public class RefreshToken {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @ManyToOne(optional=false) private AppUser user;
 @Column(nullable=false, unique=true) private String token;
 @Column(nullable=false) private Instant expiresAt;
 protected RefreshToken(){}
 public RefreshToken(AppUser u,String t,Instant e){user=u;token=t;expiresAt=e;}
 public Long getId(){return id;} public AppUser getUser(){return user;} public String getToken(){return token;} public Instant getExpiresAt(){return expiresAt;}
}
