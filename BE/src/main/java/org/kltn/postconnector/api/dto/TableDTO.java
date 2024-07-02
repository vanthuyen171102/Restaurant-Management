package org.kltn.postconnector.api.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Setter()
public class TableDTO {
    @NotBlank(message = "Tên bàn không được để trống!")
    @Size(max = 100, message = "Tên bàn quá dài!")
    private String name;

    @NotNull(message = "Không được để trống giới hạn khách của bàn!")
    @Min(value = 1, message = "Bàn phục vụ được ít nhất 1 người!")
    @Max(value = 64, message = "Bàn phục vụ tối đa 64 người!")
    private Byte capacity;

    private String description;

    @NotNull(message = "Khu vực của bàn không được để trống!")
    private Integer areaId;

    public TableDTO(String name, Byte capacity, String description) {
        this.name = name.trim();
        this.capacity = capacity;
        this.description = description;
    }
}
