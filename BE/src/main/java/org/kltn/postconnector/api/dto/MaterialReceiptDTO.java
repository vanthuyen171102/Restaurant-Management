package org.kltn.postconnector.api.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class MaterialReceiptDTO {
    @NotNull(message = "Nhà cung cấp không được để trống!")
    @Min(value = 0, message = "Mã nhà cung cấp không hợp lệ!")
    private int supplierId;

    private Boolean isPaid;

    @NotEmpty(message = "Nguyên vật liệu nhập không được để trống!")
    private List<@Valid MaterialReceiptDetailDTO> receiptItems;

    private String note;

    public boolean getPaid() {
        return this.isPaid;
    }
}
