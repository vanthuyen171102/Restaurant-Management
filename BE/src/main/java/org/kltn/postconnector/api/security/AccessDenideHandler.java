package org.kltn.postconnector.api.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.kltn.postconnector.api.exception.ErrorObject;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;

import java.io.IOException;

public class AccessDenideHandler implements AccessDeniedHandler {
    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException accessDeniedException) throws IOException, ServletException {
        response.setCharacterEncoding("UTF-8");
        response.setContentType("application/json; charset=UTF-8");
        response.setStatus(HttpStatus.FORBIDDEN.value());
        ErrorObject errorObject = new ErrorObject(HttpStatus.FORBIDDEN.value(), "Bạn không đủ quyền truy cập!");
        response.getWriter().write(new ObjectMapper().writeValueAsString(errorObject));
    }
}
