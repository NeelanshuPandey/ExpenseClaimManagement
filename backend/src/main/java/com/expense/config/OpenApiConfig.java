package com.expense.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(info=@Info(
        title="Expense Claim Management API",
        version="1.0.0",
        description="Employee expense claims, manager reviews, receipts, account administration and audit history. Use the access token returned by /api/auth/login as a Bearer token for protected operations."
))
@SecurityScheme(name="bearerAuth", type=SecuritySchemeType.HTTP, scheme="bearer", bearerFormat="JWT")
public class OpenApiConfig {}
