package com.expense.controller;
import com.expense.dto.AuthDtos.*; import com.expense.service.AuthService; import jakarta.validation.Valid; import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation; import io.swagger.v3.oas.annotations.tags.Tag;
@RestController @RequestMapping("/api/auth") @Tag(name="Authentication",description="Employee registration and token-based sign-in")
public class AuthController {
 private final AuthService service; public AuthController(AuthService s){service=s;}
 @PostMapping("/register") @Operation(summary="Register an employee account") public AuthResponse register(@Valid @RequestBody RegisterRequest r){return service.register(r);}
 @PostMapping("/login") @Operation(summary="Sign in and receive access and refresh tokens") public AuthResponse login(@Valid @RequestBody LoginRequest r){return service.login(r);}
 @PostMapping("/refresh") @Operation(summary="Exchange a refresh token for a new token pair") public AuthResponse refresh(@Valid @RequestBody RefreshRequest r){return service.refresh(r.refreshToken());}
}
