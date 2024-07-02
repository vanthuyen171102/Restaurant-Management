package org.kltn.postconnector.api.security;

import lombok.RequiredArgsConstructor;
import org.kltn.postconnector.api.domain.Employee;
import org.kltn.postconnector.api.exception.ResourceNotFoundException;
import org.kltn.postconnector.api.repository.EmployeeRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final EmployeeRepository employeeRepository;

    @Override
    public UserDetails loadUserByUsername(String username) {
        Employee employee = employeeRepository.findByEmail(username).orElseThrow(() -> new ResourceNotFoundException("Tên đăng nhập không tồn tại"));

        return new CustomUserDetails(employee);
    }
}