package org.kltn.postconnector.api.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginDTO {
    @NotBlank( message = "Tên đăng nhập không được để trống!")
//    @Size( min = 5 , message = "Tên tài khoản cần ít nhất 5 ký tự!")
//    @Size( max = 20, message = "Tên tài khoản có tối đa 20 ký tự!")
//    @Pattern(regexp = "^[a-zA-Z0-9]*$", message = "Tên tài khoản không được chứa khoảng trắng hoặc ký tự đặc biệt!")
    private String username;


    @NotBlank( message = "Mật khẩu không được để trống!")
//    @Size( min = 8 ,message = "Mật khẩu cần ít nhất 8 ký tự!")
//    @Size( max = 50, message = "Mật khẩu có tối đa 50 ký tự!")
//    @Pattern(regexp = "^(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]+$",
//            message = "Mật khẩu cần chứa ít nhất 1 chữ hoa, 1 số và 1 ký tự đặc biệt!")
    private String password;
}
