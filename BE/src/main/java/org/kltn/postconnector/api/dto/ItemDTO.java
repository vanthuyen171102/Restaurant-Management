package org.kltn.postconnector.api.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data

public class ItemDTO {
    private MultipartFile thumbFile;

    @NotBlank(message = "Tên món ăn không được để trống!")
    private String title;

    @NotBlank(message = "Mô tả ngắn về món ăn không được để trống!")
    private String summary;

    private String recipe;

    private String instructions;

    @NotNull(message = "Giá sản phẩm không được để trống!")
    private Float price;

    @NotNull(message = "Danh mục món ăn không được để trống!")
    @JsonProperty("cat_id")
    private Integer catId;

    @NotNull(message = "Hãy chọn giá trị cho trường Disable!")
    private Boolean disable;

    private Float discount;

}
