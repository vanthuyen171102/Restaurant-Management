package org.kltn.postconnector.api.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.apache.tomcat.util.bcel.Const;
import org.kltn.postconnector.api.constants.Constants;
import org.springframework.cglib.core.Local;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Date;

@Data
@AllArgsConstructor
public class BookingDTO {

    @DateTimeFormat(pattern = "dd-MM-yyyy")
    @JsonFormat(pattern = "dd-MM-yyyy")
    @FutureOrPresent(message = "Ngày đặt bàn không hợp lệ!")
    private LocalDate bookingDate;

    private LocalTime bookingTime;

    @NotBlank(message = "Vui lòng nhập tên người đặt bàn!")
    @Size(min = 3, max = 100, message = "Tên người đặt bàn phải có độ dài từ 3 đến 100 ký tự!")
    private String customerName;

    @JsonProperty(value = "customer_phone")
    @NotBlank(message = "Vui lòng nhập SĐT liên hệ!")
    @Pattern(regexp = "^0\\d{9}$", message = "Số điện thoại không hợp lệ!")
    private String customerPhone;

    @NotNull(message = "Vui lòng nhập lượng người trong đoàn!")
    @Min(value = 1, message = "Số người đặt phải > 0")
    private Byte numberOfPeople;

    private String note;

    @AssertTrue(message = "Giờ đặt bàn không nằm trong thời gian nhà hàng phục vụ!")
    public boolean bookingHourContain() {
        return Constants.BOOKING_HOURS.contains(this.bookingTime);
    }

    @AssertTrue(message = "Giờ đặt bàn không hợp lệ!")
    public boolean bookingTimeIsValid() {
        LocalDate today = LocalDate.now();
        if (this.bookingDate.isEqual(today)) {
            return this.bookingTime.isAfter(LocalTime.now());
        } else {
            return false;
        }
    }
}
