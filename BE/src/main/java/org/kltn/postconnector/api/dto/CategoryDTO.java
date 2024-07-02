package org.kltn.postconnector.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CategoryDTO {
    @NotBlank(message = "Tên danh mục không được để trống!")
    @Size(max = 40, message = "Tên danh mục quá dài ( <= 40 ký tự)!")
    private String title;

    public CategoryDTO() {
    }

    ;

    public CategoryDTO(String title) {
        this.title = title.trim();
    }
}
