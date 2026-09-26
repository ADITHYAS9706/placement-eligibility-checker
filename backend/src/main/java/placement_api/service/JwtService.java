package placement_api.service;

import java.time.Duration;
import java.time.Instant;

import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

import placement_api.model.User;

@Service
public class JwtService {

    private final JwtEncoder jwtEncoder;

    private static final Duration TOKEN_VALIDITY =
            Duration.ofHours(24);

    private static final String ISSUER =
            "placement-api";

    public JwtService(JwtEncoder jwtEncoder) {
        this.jwtEncoder = jwtEncoder;
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
}