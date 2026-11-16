package com.expense.service;

import com.expense.dto.AuthDtos.AuthResponse;
import com.expense.dto.AuthDtos.LoginRequest;
import com.expense.dto.AuthDtos.RefreshRequest;
import com.expense.dto.AuthDtos.RegisterRequest;

/** Authentication operations used by the REST API. */
public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

    AuthResponse refresh(String refreshToken);
}
