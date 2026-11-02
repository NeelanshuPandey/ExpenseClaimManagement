package com.expense;

import com.expense.entity.AppUser;
import com.expense.entity.Role;
import com.expense.repository.UserRepository;
import com.expense.repository.ClaimRepository;
import com.expense.entity.ExpenseClaim;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class ExpenseApplication {
    public static void main(String[] args) { SpringApplication.run(ExpenseApplication.class, args); }

    @Bean CommandLineRunner seedManager(UserRepository users, ClaimRepository claims, PasswordEncoder encoder,
                                         org.springframework.core.env.Environment env) {
        return args -> {
            String email = env.getProperty("app.manager.email", "manager@expense.local");
            AppUser manager = users.findByEmail(email).orElse(null);
            if (manager == null) {
                manager = new AppUser();
                manager.setFullName("System Manager");
                manager.setEmail(email);
                manager.setPassword(encoder.encode(env.getProperty("app.manager.password", "Manager@123")));
                manager.setRole(Role.MANAGER);
                manager.setActive(true);
                manager = users.save(manager);
            }
            var unassigned = claims.findByAssignedManagerIsNull();
            for (ExpenseClaim claim : unassigned) claim.setAssignedManager(manager);
            if (!unassigned.isEmpty()) claims.saveAll(unassigned);
        };
    }
}
