package org.kltn.postconnector.api.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.kltn.postconnector.api.domain.Employee;
import org.kltn.postconnector.api.dto.LoginDTO;
import org.kltn.postconnector.api.payload.response.LoginResponse;
import org.kltn.postconnector.api.security.CustomUserDetails;
import org.kltn.postconnector.api.service.AuthService;
import org.kltn.postconnector.api.service.EmployeeService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final EmployeeService employeeService;

    @PostMapping("login")
    @PreAuthorize("permitAll()")
    public LoginResponse login(@Valid @RequestBody LoginDTO loginDTO) {
        return authService.authenticate(loginDTO);
    }

    @GetMapping()
    @PreAuthorize("isAuthenticated()")
    public Employee getCurrentUser(@AuthenticationPrincipal CustomUserDetails userDetails) {
        String username = userDetails.getUsername();
        return employeeService.getByEmail(username);
    }
}
