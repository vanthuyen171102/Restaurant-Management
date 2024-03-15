package org.kltn.postconnector.api.utils;

import java.text.Normalizer;

public class StringUtil {
    public static String generateSlug(String input) {
        // Loại bỏ dấu tiếng Việt và chuyển thành chữ thường
        String cleanedInput = removeDiacritics(input.toLowerCase());

        // Thay thế khoảng trắng bằng dấu gạch ngang
        cleanedInput = cleanedInput.replaceAll("\\s+", "-");

        // Loại bỏ các ký tự không phải chữ cái, số, hoặc gạch ngang
        cleanedInput = cleanedInput.replaceAll("[^a-z0-9-]", "");

        // Loại bỏ các dấu gạch ngang liên tiếp
        cleanedInput = cleanedInput.replaceAll("-+", "-");

        // Kiểm tra xem có ký tự gạch ngang ở đầu hoặc cuối không
        cleanedInput = cleanedInput.replaceAll("^-|-$", "");

        return cleanedInput;
    }

    private static String removeDiacritics(String input) {
        String nfdNormalizedString = Normalizer.normalize(input, Normalizer.Form.NFD);
        return nfdNormalizedString.replaceAll("[^\\p{ASCII}]", "");
    }
}
