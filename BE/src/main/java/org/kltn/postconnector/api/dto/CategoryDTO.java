package org.kltn.postconnector.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class CategoryDTO {
    private MultipartFile thumbFile;

    @NotBlank(message = "Tên danh mục không được để trống!")
    private String title;

    private String summary;

    @NotNull(message = "Hãy chọn giá trị trường Disable!")
    private Boolean disable;
}
