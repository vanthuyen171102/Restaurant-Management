package org.kltn.postconnector.api.utils;

import java.sql.Date;
import java.text.ParseException;
import java.text.SimpleDateFormat;

public class DateUtil {

    public static boolean validate(String dateString) {
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        dateFormat.setLenient(false);

        try {
            // Parse chuỗi thành đối tượng Date
            dateFormat.parse(dateString);
            return true; // Nếu không có lỗi, coi đó là ngày hợp lệ
        } catch (ParseException e) {
            return false; // Nếu có lỗi parse, coi đó là ngày không hợp lệ
        }
    }


    public static boolean validate(Date date) {
        try {
            String dateString = date.toString();

            // Parse lại chuỗi thành java.sql.Date để kiểm tra tính hợp lệ
            Date parsedDate = Date.valueOf(dateString);

            // Kiểm tra xem ngày gốc và ngày parse lại có giống nhau không
            return date.equals(parsedDate);
        } catch (Exception e) {
            return false;
        }
    }
}
