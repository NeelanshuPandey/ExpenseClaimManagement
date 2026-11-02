package com.expense.repository;
import com.expense.entity.AppUser; import com.expense.entity.Role; import org.springframework.data.jpa.repository.JpaRepository; import java.util.Optional; import java.util.List;
public interface UserRepository extends JpaRepository<AppUser,Long>{Optional<AppUser> findByEmail(String email); boolean existsByEmail(String email); List<AppUser> findByRoleAndActiveTrue(Role role);}
