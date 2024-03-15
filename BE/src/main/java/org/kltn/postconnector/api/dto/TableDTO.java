package org.kltn.postconnector.api.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class TableDTO {
    @NotBlank(message = "Tên bàn không được để trống!")
    @Size(max = 100, message = "Tên bàn quá dài!")
    private String name;

    @NotNull(message = "Không được để trống giới hạn khách của bàn!")
    @Min(value = 1, message = "Bàn phục vụ được ít nhất 1 người!")
    @Max(value = 64, message = "Bàn phục vụ tối đa 64 người!")
    private Byte capacity;

    @NotBlank(message = "Ít nhất hãy đưa ra vị trí của bàn trong phần mô tả!")
    private String description;
}
