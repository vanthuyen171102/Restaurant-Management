package org.kltn.postconnector.api.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MaterialReceiptDetailDTO {
    @NotNull(message = "Mã nguyên liệu không được để trống!")
    @Min(value = 0, message = "Mã nguyên liệu không hợp lệ!")
    private Integer materialId;
    @NotNull(message = "Số lượng nhập không được để trống!")
    @Min(value = 0, message = "Số lượng nhập > 0!")
    private Float quantity;
    @NotNull(message = "Giá nhập không được để trống!")
    @Min(value = 0, message = "Đơn giá nhập >= 0!")
    private Float price;
}
