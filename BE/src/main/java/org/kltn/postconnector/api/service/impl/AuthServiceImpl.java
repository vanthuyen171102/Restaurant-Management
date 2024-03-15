package org.kltn.postconnector.api.service.impl;

import lombok.RequiredArgsConstructor;
import org.kltn.postconnector.api.dto.LoginDTO;
import org.kltn.postconnector.api.payload.response.LoginResponse;
import org.kltn.postconnector.api.security.CustomUserDetails;
import org.kltn.postconnector.api.service.AuthService;
import org.kltn.postconnector.api.service.UserService;
import org.kltn.postconnector.api.utils.JwtUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserService userService;

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;


    @Override
    public LoginResponse authenticate(LoginDTO loginDTO) {
        // Tạo ra 1 người dùng để thực hiện đăng nhập ( Nếu đang nhập thành công trả về authentication )
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginDTO.getUsername(),
                        loginDTO.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Tạo token và lấy thông tin employee gắn với user trả về cho client
        String token = jwtUtil.generateToken(authentication);

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        return new LoginResponse(userDetails.getAvatar(), userDetails.getFullName(), token);
    }
}
