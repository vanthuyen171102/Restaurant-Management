package org.kltn.postconnector.api.utils;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import org.kltn.postconnector.api.exception.JwtValidationException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {
    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expirationMs}")
    private int jwtExpirationMs;

    public String generateToken(Authentication authentication) {
        String username = authentication.getName();
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
                .signWith(key(), SignatureAlgorithm.HS256)
                .compact();
    }

    private Key key() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));
    }

    public String getUsernameFromJwt(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key())
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claims.getSubject();
    }

    public Authentication getAuthentication(String token) {
        Claims claims = Jwts.parserBuilder().setSigningKey(key()).build().parseClaimsJws(token)
                .getBody();
        UserDetails userDetails = null;
        return new UsernamePasswordAuthenticationToken(userDetails, "", userDetails.getAuthorities());
    }

    public boolean validateToken(String token) throws JwtValidationException  {
        try {
            Jwts.parserBuilder().setSigningKey(key()).build().parseClaimsJws(token);
            return true;
        } catch (ExpiredJwtException ex) {
            throw new JwtValidationException("Phiên đăng nhập đã kết thúc!");
        } catch (UnsupportedJwtException | MalformedJwtException | SignatureException | IllegalArgumentException ex) {
            throw new JwtValidationException("Chuỗi xác thực không hợp lệ!");
        } catch (Exception ex) {
            throw new JwtValidationException("Unexpected error during JWT validation");
        }
    }
}
