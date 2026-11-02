package com.expense.controller;
import com.expense.entity.*; import com.expense.repository.UserRepository; import org.springframework.web.bind.annotation.*; import java.util.*;
import io.swagger.v3.oas.annotations.security.SecurityRequirement; import io.swagger.v3.oas.annotations.tags.Tag;
@RestController @RequestMapping("/api/manager/users") @Tag(name="User administration",description="Manager-only employee account administration") @SecurityRequirement(name="bearerAuth")
public class UserController {
 private final UserRepository users; public UserController(UserRepository u){users=u;}
 @GetMapping public List<Map<String,Object>> list(){return users.findAll().stream().map(u->Map.<String,Object>of("id",u.getId(),"fullName",u.getFullName(),"email",u.getEmail(),"role",u.getRole(),"active",u.isActive())).toList();}
 @PatchMapping("/{id}/active") public Map<String,Object> active(@PathVariable Long id,@RequestParam boolean value){AppUser u=users.findById(id).orElseThrow();u.setActive(value);users.save(u);return Map.of("id",u.getId(),"active",u.isActive());}
}
