package org.kltn.postconnector.api.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.kltn.postconnector.api.enums.Role;

@Data
public class UserDTO {

    @Size(min = 5, max = 20, message = "Tên tài khoản chứa ít nhất 5 và nhiều nhất là 20 ký tự!")
    @Pattern(regexp = "\\S*", message = "Tên tài khoản không được chứa khoảng trắng!")
    private String username;

    @Size(min = 8, max = 40, message = "Mật khẩu chứa ít nhất 8 và nhiều nhất là 40 ký tự!")
    @Pattern(regexp = "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@#$%^&+=!])\\S*$",
    message = "Mật khẩu chứa ít nhất 1 chữ cái thường, 1 chữ hoa, 1 chữ số, 1 ký tự đặc biệt và không được chứa khoảng trắng!")
    private String password;

    @NotNull(message = "Bạn chưa chọn vai trò của tài khoản!")
    @JsonProperty("role")
    private Role role;

    @NotNull(message = "Bạn chưa chọn nhân sự!")
    private Integer employeeId;

}
