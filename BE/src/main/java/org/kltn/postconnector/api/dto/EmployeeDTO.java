package org.kltn.postconnector.api.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.multipart.MultipartFile;

import java.util.Date;

@Getter
@Setter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeDTO {
    private MultipartFile avatarFile;

    @NotBlank(message = "Email không được để trống!")
    @Email(message = "Email không hợp lệ!")
    private String email;

    @NotBlank(message = "Họ tên nhân viên không được để trống!")
    private String fullName;

    @NotBlank(message = "Số điện thoại không được để trống!")
    @Pattern(regexp = "^0\\d{9}$", message = "Số điện thoại không hợp lệ!")
    private String phone;

    @NotBlank(message = "Địa chỉ không được để trống!")
    private String address;

    @NotNull(message = "Ngày sinh không được để trống!")
    @DateTimeFormat(pattern = "dd-MM-yyyy")
    @Past(message = "Ngày sinh không hợp lệ!")
    private Date birth;

    @NotBlank(message = "Giới tính không được để trống!")
    @Pattern(regexp = "^(Nam|Nữ)$", message = "Giới tính không hợp lệ!")
    private String gender;

    @NotNull(message = "Không được để trống Quyền!")
    private Integer roleId;

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Create extends EmployeeDTO {
        private String password;

        public Create(MultipartFile avatarFile, String email, String fullName, String phone, String address, Date birth, String gender, int roleId, String password) {
            super(avatarFile, email, fullName, phone, address, birth, gender, roleId);
            this.password = password;
        }
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Update extends EmployeeDTO {
        private String password;

        public Update(MultipartFile avatarFile, String email, String fullName, String phone, String address, Date birth, String gender, int roleId, String password) {
            super(avatarFile, email, fullName, phone, address, birth, gender, roleId);
            this.password = password;
        }
    }

}
