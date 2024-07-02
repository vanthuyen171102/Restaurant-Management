package org.kltn.postconnector.api.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginDTO {
    @NotBlank(message = "Tên đăng nhập không được để trống!")
    private String username;


    @NotBlank(message = "Mật khẩu không được để trống!")
    private String password;
}
