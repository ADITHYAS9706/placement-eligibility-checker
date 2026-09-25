package placement_api.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http
            .csrf(csrf -> csrf.disable())

            .authorizeHttpRequests(auth -> auth

                // Authentication endpoints
                .requestMatchers(
                    "/api/auth/**"
                ).permitAll()

                // Existing APIs temporarily accessible
                .requestMatchers(
                    "/api/students/**",
                    "/api/companies/**",
                    "/api/eligibility/**",
                    "/api/eligibility-results/**",
                    "/api/reports/**"
                ).permitAll()

                // Everything else
                .anyRequest().authenticated()
            );

        return http.build();
    }
}