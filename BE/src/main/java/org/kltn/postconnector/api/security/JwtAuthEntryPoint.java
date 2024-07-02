package org.kltn.postconnector.api.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.kltn.postconnector.api.exception.ErrorObject;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class JwtAuthEntryPoint implements AuthenticationEntryPoint {
    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException {
        response.setCharacterEncoding("UTF-8");
        response.setContentType("application/json; charset=UTF-8");


        if (authException instanceof BadCredentialsException) {
            response.setStatus(HttpStatus.UNAUTHORIZED.value());
            ErrorObject errorObject = new ErrorObject(HttpStatus.UNAUTHORIZED.value(), "Thông tin đăng nhập không chính xác");
            response.getWriter().write(new ObjectMapper().writeValueAsString(errorObject));
        } else {
            response.setStatus(HttpStatus.UNAUTHORIZED.value());
            ErrorObject errorObject = new ErrorObject(HttpStatus.UNAUTHORIZED.value(), authException.getMessage());
            response.getWriter().write(new ObjectMapper().writeValueAsString(errorObject));
        }
    }
}
