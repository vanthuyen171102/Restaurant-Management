package org.kltn.postconnector.api.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.kltn.postconnector.api.dto.LoginDTO;
import org.kltn.postconnector.api.payload.response.ResponseObject;
import org.kltn.postconnector.api.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;


    @PostMapping("login")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<ResponseObject<?>> login(@Valid @RequestBody LoginDTO loginDTO) {
        return ResponseEntity.ok(ResponseObject.builder()
                .code(HttpStatus.OK.value())
                .message("Đăng nhập thành công!")
                .data(authService.authenticate(loginDTO))
                .build());
    }
}
