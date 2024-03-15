package org.kltn.postconnector.api.model;

import com.fasterxml.jackson.annotation.JsonIdentityReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIncludeProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.kltn.postconnector.api.enums.OrderItemStatus;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "`OrderItem`")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderItem {

    @Id
    @GeneratedValue( strategy = GenerationType.IDENTITY)
    private long id;

    private float price;

    private int quantity;

    private float discount;

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
    @JsonIncludeProperties({"id", "title", "slug", "thumb", "cat_id"})
    private Item item;

    @PrePersist
    public void prePersist() {
        createAt = LocalDateTime.now();
    }
}
