package com.expense.service.impl;

import com.expense.dto.AuthDtos.AuthResponse;
import com.expense.dto.AuthDtos.LoginRequest;
import com.expense.dto.AuthDtos.RegisterRequest;
import com.expense.entity.AppUser;
import com.expense.entity.RefreshToken;
import com.expense.entity.Role;
import com.expense.exception.AuthenticationException;
import com.expense.exception.ConflictException;
import com.expense.repository.RefreshTokenRepository;
import com.expense.repository.UserRepository;
import com.expense.security.JwtService;
import com.expense.service.AuthService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository users;
    private final RefreshTokenRepository refreshTokens;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final long refreshTokenLifetimeMs;

    public AuthServiceImpl(
            UserRepository users,
            RefreshTokenRepository refreshTokens,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            @Value("${app.jwt.refresh-ms}") long refreshTokenLifetimeMs) {
        this.users = users;
        this.refreshTokens = refreshTokens;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.refreshTokenLifetimeMs = refreshTokenLifetimeMs;
    }

    @Override
    public AuthResponse register(RegisterRequest request) {
        if (users.existsByEmail(request.email())) {
            throw new ConflictException("Email already registered");
        }

        AppUser user = new AppUser();
        user.setFullName(request.fullName());
        user.setEmail(request.email().toLowerCase());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setRole(Role.EMPLOYEE);

        return issueTokens(users.save(user));
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        AppUser user = users.findByEmail(request.email().toLowerCase())
                .orElseThrow(() -> new AuthenticationException("Invalid credentials"));

        if (!user.isActive() || !passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new AuthenticationException("Invalid credentials or inactive account");
        }

        return issueTokens(user);
    }

    @Override
    public AuthResponse refresh(String token) {
        RefreshToken existingToken = refreshTokens.findByToken(token)
                .orElseThrow(() -> new AuthenticationException("Invalid refresh token"));

        if (existingToken.getExpiresAt().isBefore(Instant.now())) {
            refreshTokens.delete(existingToken);
            throw new AuthenticationException("Refresh token expired");
        }

        AppUser user = existingToken.getUser();
        refreshTokens.delete(existingToken);

        if (!user.isActive()) {
            throw new AuthenticationException("Account is inactive");
        }

        return issueTokens(user);
    }

    private AuthResponse issueTokens(AppUser user) {
        String accessToken = jwtService.createAccess(user.getEmail(), user.getRole().name());
        String refreshToken = UUID.randomUUID() + "." + UUID.randomUUID();
        Instant expiresAt = Instant.now().plusMillis(refreshTokenLifetimeMs);

        refreshTokens.save(new RefreshToken(user, refreshToken, expiresAt));

        return new AuthResponse(
                accessToken,
                refreshToken,
                "Bearer",
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole().name());
    }
}


