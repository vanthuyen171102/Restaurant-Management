package org.kltn.postconnector.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class BookingCancelDTO {
    @NotBlank(message = "Nguyên nhân hủy đơn đặt bàn không được để trống!")
    @Size(max = 100, message = "Nguyên nhân hủy bàn chỉ nên được tóm tắt trong 100 ký tự!")
    private String cancelReason;
}
