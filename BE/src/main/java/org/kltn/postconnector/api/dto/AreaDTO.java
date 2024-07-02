package org.kltn.postconnector.api.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AreaDTO {
    @NotBlank(message = "Tên khu vực không được để trống!")
    private String name;
}
