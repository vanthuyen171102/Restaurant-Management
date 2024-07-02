package org.kltn.postconnector.api.domain;

import com.fasterxml.jackson.annotation.JsonIncludeProperties;
import jakarta.persistence.*;
import lombok.*;

@Table(name = "`MonthlyItemRevenue`")
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class MonthlyItemRevenue {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private int month;
    private int year;

    @ManyToOne()
    @JoinColumn(name = "item_id")
    @JsonIncludeProperties({"id", "title", "thumb"})

    private Item item;

    @Column(name = "quantity_sold")
    private int quantitySold = 0;

    private float revenue = 0;

    private float profit = 0;

    public MonthlyItemRevenue(Item item, double revenue, double profit, long quantitySold) {
        this.item = item;
        this.quantitySold = (int) quantitySold;
        this.revenue = (float) revenue;
        this.profit = (float) profit;
    }
}
