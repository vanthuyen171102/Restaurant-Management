package org.kltn.postconnector.api.security;

import lombok.RequiredArgsConstructor;
import org.kltn.postconnector.api.utils.JwtUtil;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class AuthenticationProvider {
    private final CustomUserDetailsService userDetailsService;
    private final JwtUtil jwtUtil;

    public Authentication getAuthentication(String token) {

        String username = jwtUtil.getUsernameFromJwt(token);
        return Optional.ofNullable(username)
                .map(userDetailsService::loadUserByUsername)
                .map(userDetails ->
                        new UsernamePasswordAuthenticationToken(userDetails, userDetails.getPassword(), userDetails.getAuthorities()))
                .orElse(null);
    }
}
