package org.kltn.postconnector.api.domain;

import com.fasterxml.jackson.annotation.JsonIncludeProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Table(name = "`DailyItemRevenue`")
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
@ToString
public class DailyItemRevenue {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private LocalDate date;

    @ManyToOne()
    @JoinColumn(name = "item_id")
    @JsonIncludeProperties({"id", "title", "thumb"})
    private Item item;

    @Column(name = "quantity_sold")
    private int quantitySold = 0;

    private float revenue = 0;

    private float profit = 0;

    public DailyItemRevenue(Item item, double revenue, double profit, long quantitySold) {
        this.item = item;
        this.quantitySold = (int) quantitySold;
        this.revenue = (float) revenue;
        this.profit = (float) profit;
    }
}