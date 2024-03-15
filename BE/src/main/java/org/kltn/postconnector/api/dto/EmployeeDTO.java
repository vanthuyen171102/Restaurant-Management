package org.kltn.postconnector.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.multipart.MultipartFile;

import java.util.Date;

@Data
public class EmployeeDTO {

    private MultipartFile avatarFile;

    @NotBlank(message = "Email không được để trống!")
    @Pattern(regexp = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$", message = "Email không hợp lệ!")
    private String email;

    @NotBlank(message = "Họ tên nhân viên không được để trống!")
    private String fullName;

    @NotBlank(message = "Số điện thoại không được để trống!")
    @Pattern(regexp = "^\\d{10}$", message = "Số điện thoại không hợp lệ!")
    private String phone;

    @NotBlank(message = "Địa chỉ không được để trống!")
    private String address;

    @NotNull(message = "Ngày sinh không được để trống!")
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @Past(message = "Ngày sinh không hợp lệ!")
    private Date birth;

    @NotBlank(message = "Giới tính không được để trống!")
    @Pattern(regexp = "^(Nam|Nữ)$", message = "Giới tính không hợp lệ!")
    private String gender;

}
