package org.kltn.postconnector.api.domain;

import jakarta.persistence.*;
import lombok.*;

@Table(name = "`MonthlyRevenue`")
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
@ToString
public class MonthlyRevenue {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private int month;

    private int year;

    private float revenue;

    private float profit = 0;
}
