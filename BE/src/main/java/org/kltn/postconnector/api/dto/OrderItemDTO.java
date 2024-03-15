package org.kltn.postconnector.api.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class OrderItemDTO {
    @NotNull(message = "Không được để trống ID món ăn!")
    @JsonProperty(value = "id")
    private Integer itemId;

    @NotNull(message = "Không được để trống số lượng!")
    private Integer quantity;

    private String note;
}

