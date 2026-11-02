package com.expense;
import com.expense.entity.*; import com.expense.repository.UserRepository; import org.junit.jupiter.api.Test; import org.springframework.beans.factory.annotation.Autowired; import org.springframework.beans.factory.annotation.Value; import org.springframework.boot.test.context.SpringBootTest; import static org.assertj.core.api.Assertions.assertThat;
@SpringBootTest class ExpenseApplicationTests {
 @Autowired UserRepository users;
 @Value("${app.manager.email}") String managerEmail;
 @Test void managerIsSeeded(){assertThat(users.findByEmail(managerEmail)).isPresent();}
 @Test void seededManagerHasManagerRole(){assertThat(users.findByEmail(managerEmail).orElseThrow().getRole()).isEqualTo(Role.MANAGER);}
 @Test void seededManagerIsActive(){assertThat(users.findByEmail(managerEmail).orElseThrow().isActive()).isTrue();}
}
