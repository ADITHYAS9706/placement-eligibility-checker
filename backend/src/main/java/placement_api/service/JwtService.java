package placement_api.service;

import java.time.Duration;
import java.time.Instant;

import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

import placement_api.model.User;

@Service
public class JwtService {

    private final JwtEncoder jwtEncoder;
    private final JwtDecoder jwtDecoder;

    private static final Duration TOKEN_VALIDITY =
            Duration.ofHours(24);

    private static final String ISSUER =
            "placement-api";

    public JwtService(
            JwtEncoder jwtEncoder,
            JwtDecoder jwtDecoder) {

        this.jwtEncoder = jwtEncoder;
        this.jwtDecoder = jwtDecoder;
    }

    // =========================
    // GENERATE JWT
    // =========================

    public String generateToken(User user) {

        Instant now = Instant.now();

        JwtClaimsSet claims =
                JwtClaimsSet.builder()

                        .issuer(ISSUER)

                        .issuedAt(now)

                        .expiresAt(
                                now.plus(TOKEN_VALIDITY)
                        )

                        .subject(
                                user.getUsername()
                        )

                        .claim(
                                "userId",
                                user.getId()
                        )

                        .claim(
                                "role",
                                user.getRole()
                        )

                        .build();

        return jwtEncoder
                .encode(
                        JwtEncoderParameters.from(
                                claims
                        )
                )
                .getTokenValue();
    }

    // =========================
    // EXTRACT USERNAME
    // =========================

    public String extractUsername(
            String token) {

        Jwt jwt =
                jwtDecoder.decode(token);

        return jwt.getSubject();
    }

    // =========================
    // VALIDATE TOKEN
    // =========================

    public boolean isTokenValid(
            String token,
            User user) {

        try {

            Jwt jwt =
                    jwtDecoder.decode(token);

            String username =
                    jwt.getSubject();

            return username != null
                    && username.equals(
                            user.getUsername()
                    );

        } catch (Exception e) {

            return false;
        }
    }
}