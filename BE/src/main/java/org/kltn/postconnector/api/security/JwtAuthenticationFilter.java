package org.kltn.postconnector.api.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.kltn.postconnector.api.exception.ErrorObject;
import org.kltn.postconnector.api.exception.JwtValidationException;
import org.kltn.postconnector.api.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;


public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain) throws ServletException, IOException {
        try {
            String token = getJWTFromRequest(request);
            if (StringUtils.hasText(token) && jwtUtil.validateToken(token)) {
                String username = jwtUtil.getUsernameFromJwt(token);
                // Lấy thông tin người dùng từ CSDL( username, password, role)
                UserDetails userDetails = customUserDetailsService.loadUserByUsername(username);
                UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(userDetails, null,
                        userDetails.getAuthorities());
                // Lưu thông tin vào để thực hiện xử lý tiếp theo
                SecurityContextHolder.getContext().setAuthentication(authenticationToken);
            }
            filterChain.doFilter(request, response);
        } catch (JwtValidationException ex) {
            // Bắt ngoại lệ khi xử lý JWT
            response.setCharacterEncoding("UTF-8");
            response.setContentType("application/json; charset=UTF-8");
            response.setStatus(HttpStatus.UNAUTHORIZED.value());
            ErrorObject errorObject = new ErrorObject(HttpStatus.UNAUTHORIZED.value(), ex.getMessage());
            response.getWriter().write(new ObjectMapper().writeValueAsString(errorObject));
        }
    }


    public String getJWTFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
