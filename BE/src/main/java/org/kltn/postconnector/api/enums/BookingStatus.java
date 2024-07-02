package org.kltn.postconnector.api.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum BookingStatus {
    PENDING(1, "Chờ xử lý"),
    CONFIRMED(2, "Đã xác nhận"),

    COMPLETE(3, "Đã nhận bàn"),
    EXPIRED(4, "Quá giờ"),
    CANCELED(5, "Đã hủy");

    private final int order;
    private final String text;


}