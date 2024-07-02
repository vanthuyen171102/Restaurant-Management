package org.kltn.postconnector.api.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class MaterialDTO {
    @NotBlank(message = "Tên nguyên liệu không được để trống!")
    private String name;

    @NotBlank(message = "Tên đơn vị tính không được để trống!")
    private String unit;

    @NotNull(message = "Giá nguyên liệu không được để trống!")
    @Min(value = 0, message = "Giá nguyên liệu >= 0")
    private Float price;

    @NotNull(message = "Tồn kho không được để trống!")
    @Min(value = 0, message = "Tồn kho nguyên liệu >= 0")
    private Float stock;
}
