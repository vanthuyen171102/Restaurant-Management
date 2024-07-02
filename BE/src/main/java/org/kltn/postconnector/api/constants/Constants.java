package org.kltn.postconnector.api.constants;

import org.springframework.cglib.core.Local;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

public class Constants {

    public static final String UNCATEGORY_TITLE = "Chưa phân loại";

    public static final int YEAR_START = 2023;

    public static final Float VAT_VALUE = 0.1f; // Giá trị VAT mặc định là 10%

    public static final LocalTime BOOKING_START = LocalTime.of(11, 0);
    public static final LocalTime BOOKING_END = LocalTime.of(21, 0);
    public static final Integer BOOKING_STEP = 30;

    public static final Integer MINUTES_BEFORE_ARRIVAL = 30;

    public static final List<LocalTime> BOOKING_HOURS;

    static {
        BOOKING_HOURS = generateBookingHours();
    }

    private static List<LocalTime> generateBookingHours() {
        List<LocalTime> bookingHours = new ArrayList<>();
        LocalTime currentTime = BOOKING_START;

        while (currentTime.isBefore(BOOKING_END) || currentTime.equals(BOOKING_END)) {
            bookingHours.add(currentTime);
            currentTime = currentTime.plusMinutes(BOOKING_STEP);
        }

        return bookingHours;
    }

}