package com.expense.service;
import com.expense.dto.AuthDtos.*; import com.expense.entity.*; import com.expense.repository.*; import com.expense.security.JwtService;
import org.springframework.beans.factory.annotation.Value; import org.springframework.security.crypto.password.PasswordEncoder; import org.springframework.stereotype.Service; import java.time.Instant; import java.util.UUID;
@Service
public class AuthService {
 private final UserRepository users; private final RefreshTokenRepository refresh; private final PasswordEncoder encoder; private final JwtService jwt; private final long refreshMs;
 public AuthService(UserRepository u,RefreshTokenRepository r,PasswordEncoder e,JwtService j,@Value("${app.jwt.refresh-ms}")long ms){users=u;refresh=r;encoder=e;jwt=j;refreshMs=ms;}
 public AuthResponse register(RegisterRequest r){if(users.existsByEmail(r.email()))throw new IllegalArgumentException("Email already registered");AppUser u=new AppUser();u.setFullName(r.fullName());u.setEmail(r.email().toLowerCase());u.setPassword(encoder.encode(r.password()));u.setRole(Role.EMPLOYEE);u=users.save(u);return issue(u);}
 public AuthResponse login(LoginRequest r){AppUser u=users.findByEmail(r.email().toLowerCase()).orElseThrow(()->new IllegalArgumentException("Invalid credentials"));if(!u.isActive()||!encoder.matches(r.password(),u.getPassword()))throw new IllegalArgumentException("Invalid credentials or inactive account");return issue(u);}
 public AuthResponse refresh(String token){RefreshToken old=refresh.findByToken(token).orElseThrow(()->new IllegalArgumentException("Invalid refresh token"));if(old.getExpiresAt().isBefore(Instant.now())){refresh.delete(old);throw new IllegalArgumentException("Refresh token expired");}AppUser u=old.getUser();refresh.delete(old);if(!u.isActive())throw new IllegalArgumentException("Account is inactive");return issue(u);}
 private AuthResponse issue(AppUser u){String access=jwt.createAccess(u.getEmail(),u.getRole().name());String rt=UUID.randomUUID()+"."+UUID.randomUUID();refresh.save(new RefreshToken(u,rt,Instant.now().plusMillis(refreshMs)));return new AuthResponse(access,rt,"Bearer",u.getId(),u.getFullName(),u.getEmail(),u.getRole().name());}
}
