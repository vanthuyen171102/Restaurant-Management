package org.kltn.postconnector.api.domain;

import com.fasterxml.jackson.annotation.JsonIdentityReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIncludeProperties;
import jakarta.persistence.*;
import lombok.*;
import org.kltn.postconnector.api.enums.OrderItemStatus;

import java.time.LocalDateTime;

@Entity
@Table(name = "`OrderItem`")
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private float price;

    private int quantity;

    @JsonIgnore
    private float profit;

    private String note;

    @Enumerated(EnumType.STRING)
    private OrderItemStatus status;

    @Column(name = "create_at")
    private LocalDateTime createAt;

    @Column(name = "complete_at")
    private LocalDateTime completeAt;

    @ManyToOne
    @JoinColumn(name = "order_id")
    @JsonIdentityReference(alwaysAsId = true)
    @JsonIgnore
    private Order order;

    @ManyToOne
    @JsonIdentityReference(alwaysAsId = true)
    @JoinColumn(name = "item_id")
    @JsonIncludeProperties({"id", "title", "thumb", "cat_id"})
    private Item item;

    @PrePersist
    public void prePersist() {
        createAt = LocalDateTime.now();
        status = OrderItemStatus.WAITING;
    }
}
