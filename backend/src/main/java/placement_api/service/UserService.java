package placement_api.service;

import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import placement_api.model.User;
import placement_api.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // =========================
    // REGISTER USER
    // =========================

    public User registerUser(
            String username,
            String password,
            String role) {

        Optional<User> existingUser =
                userRepository.findByUsername(username);

        if (existingUser.isPresent()) {
            throw new RuntimeException(
                    "Username already exists."
            );
        }

        User user = new User();

        user.setUsername(username);

        user.setPassword(
                passwordEncoder.encode(password)
        );

        user.setRole(role);

        return userRepository.save(user);
    }

    // =========================
    // VALIDATE LOGIN
    // =========================

    public boolean validateLogin(
            String username,
            String password) {

        Optional<User> user =
                userRepository.findByUsername(username);

        if (user.isEmpty()) {
            return false;
        }

        return passwordEncoder.matches(
                password,
                user.get().getPassword()
        );
    }

    // =========================
    // AUTHENTICATE USER
    // =========================

    public User authenticateUser(
            String username,
            String password) {

        Optional<User> user =
                userRepository.findByUsername(username);

        if (user.isEmpty()) {
            return null;
        }

        boolean passwordMatches =
                passwordEncoder.matches(
                        password,
                        user.get().getPassword()
                );

        if (!passwordMatches) {
            return null;
        }

        return user.get();
    }
}