package placement_api.config;

import java.util.Base64;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;

@Configuration
public class JwtConfig {

    // =========================================================
    // GET JWT SECRET KEY
    // =========================================================

    private SecretKey getSecretKey() {

        String secret = System.getenv("JWT_SECRET");

        if (secret == null || secret.isBlank()) {

            throw new IllegalStateException(
                "JWT_SECRET environment variable is not set."
            );
        }

        byte[] secretBytes;

        try {

            secretBytes =
                Base64.getDecoder().decode(secret);

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

        return new SecretKeySpec(
            secretBytes,
            "HmacSHA256"
        );
    }


    // =========================================================
    // JWT ENCODER
    // =========================================================

    @Bean
    public JwtEncoder jwtEncoder() {

        SecretKey key = getSecretKey();

        return NimbusJwtEncoder
                .withSecretKey(key)
                .algorithm(MacAlgorithm.HS256)
                .build();
    }


    // =========================================================
    // JWT DECODER
    // =========================================================

    @Bean
    public JwtDecoder jwtDecoder() {

        SecretKey key = getSecretKey();

        return NimbusJwtDecoder
                .withSecretKey(key)
                .macAlgorithm(
                    MacAlgorithm.HS256
                )
                .build();
    }
}