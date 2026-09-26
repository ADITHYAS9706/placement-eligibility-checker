package placement_api.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import placement_api.model.User;
import placement_api.service.UserService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    // =========================
    // REGISTER
    // =========================

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestBody RegisterRequest request) {

        try {

            if (request.username == null ||
                request.username.trim().isEmpty()) {

                return ResponseEntity
                        .badRequest()
                        .body("Username is required.");
            }

            if (request.password == null ||
                request.password.length() < 6) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                "Password must contain at least 6 characters."
                        );
            }

            String role = request.role;

            if (role == null ||
                role.trim().isEmpty()) {

                role = "STUDENT";
            }

            User user = userService.registerUser(
                    request.username.trim(),
                    request.password,
                    role.toUpperCase()
            );

            return ResponseEntity.ok(
                    new AuthResponse(
                            "Registration successful.",
                            user.getUsername(),
                            user.getRole()
                    )
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    // =========================
    // LOGIN
    // =========================

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest request) {

        if (request.username == null ||
            request.username.trim().isEmpty()) {

            return ResponseEntity
                    .badRequest()
                    .body("Username is required.");
        }

        if (request.password == null ||
            request.password.isEmpty()) {

            return ResponseEntity
                    .badRequest()
                    .body("Password is required.");
        }

        User user = userService.authenticateUser(
                request.username.trim(),
                request.password
        );

        if (user == null) {

            return ResponseEntity
                    .status(401)
                    .body(
                            "Invalid username or password."
                    );
        }

        return ResponseEntity.ok(
                new AuthResponse(
                        "Login successful.",
                        user.getUsername(),
                        user.getRole()
                )
        );
    }

    // =========================
    // REGISTER REQUEST
    // =========================

    public static class RegisterRequest {

        public String username;
        public String password;
        public String role;
    }

    // =========================
    // LOGIN REQUEST
    // =========================

    public static class LoginRequest {

        public String username;
        public String password;
    }

    // =========================
    // RESPONSE
    // =========================

    public static class AuthResponse {

        public String message;
        public String username;
        public String role;

        public AuthResponse(
                String message,
                String username,
                String role) {

            this.message = message;
            this.username = username;
            this.role = role;
        }
    }
}