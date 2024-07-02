package org.kltn.postconnector.api.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class YearRevenue {
    int year;
    float revenue;
    float profit;
}
