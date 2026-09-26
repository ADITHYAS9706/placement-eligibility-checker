package placement_api.config;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;

@Configuration
public class JwtConfig {

    @Bean
    public JwtEncoder jwtEncoder() {

        String secret = System.getenv("JWT_SECRET");

        if (secret == null || secret.isBlank()) {
            throw new IllegalStateException(
                "JWT_SECRET environment variable is not set."
            );
        }

        byte[] secretBytes;

        try {
            secretBytes =
                java.util.Base64.getDecoder().decode(secret);
        } catch (IllegalArgumentException e) {
            throw new IllegalStateException(
                "JWT_SECRET must be a valid Base64 value.",
                e
            );
        }

        if (secretBytes.length < 32) {
            throw new IllegalStateException(
                "JWT_SECRET must contain at least 32 bytes."
            );
        }

        SecretKey key =
            new SecretKeySpec(
                secretBytes,
                "HmacSHA256"
            );

        return NimbusJwtEncoder.withSecretKey(key)
                .algorithm(MacAlgorithm.HS256)
                .build();
    }
}