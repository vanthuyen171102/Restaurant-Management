package org.kltn.postconnector.api.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TableBookingDTO {
    @JsonProperty(value = "booking_date")
    @NotNull(message = "Vui lòng chọn ngày đặt bàn!")
    @Pattern(regexp = "^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$", message = "Định dạng ngày không hợp lệ!")
    private String bookingDate;

    @JsonProperty(value = "booking_time")
    @NotNull(message = "Vui lòng chọn thời gian đặt bàn!")
    @Pattern(regexp = "^([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$", message = "Định dạng giờ không hợp lệ!")
    private String bookingTime;

    @JsonProperty(value = "customer_name")
    @NotNull(message = "Vui lòng nhập tên người đặt bàn!")
    @Size(min = 3, max = 50, message = "Tên người đặt bàn phải có độ dài từ 3 đến 50 ký tự!")
    private String customerName;

    @JsonProperty(value = "customer_phone")
    @NotNull(message = "Vui lòng nhập SĐT liên hệ!")
    private String customerPhone;

    @JsonProperty(value = "number_of_people")
    @NotNull(message = "Vui lòng nhập lượng người trong đoàn!")
    private byte numberOfPeople;

    @JsonProperty(value = "table_id")
    @NotNull(message = "Vui lòng chọn bàn muốn đặt trước!")
    private Byte tableId;

    private String note;

}
