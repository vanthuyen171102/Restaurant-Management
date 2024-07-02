package org.kltn.postconnector.api.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class ItemDTO {
    private MultipartFile thumbFile;

    @NotBlank(message = "Tên món ăn không được để trống!")
    private String title;

    @NotNull(message = "Giá món ăn không được để trống!")
    @Min(value = 0, message = "Giá món ăn >= 0")
    private Float price;

    @NotNull(message = "Giá gốc món ăn không được để trống!")
    @Min(value = 0, message = "Giá gốc món ăn >= 0")
    private Float capitalPrice;

    @NotNull(message = "Danh mục món ăn không được để trống!")
    private Integer catId;

    public ItemDTO() {
    }

    public ItemDTO(MultipartFile thumbFile, String title, Float price, Integer catId, Float capitalPrice) {
        this.thumbFile = thumbFile;
        this.title = title.trim();
        this.price = price;
        this.catId = catId;
        this.capitalPrice = capitalPrice;
    }

    public boolean isProfitValid() {
        return capitalPrice == null || price == null || capitalPrice <= price;
    }
}
