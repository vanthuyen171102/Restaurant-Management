package org.kltn.postconnector.api.model;

import com.fasterxml.jackson.annotation.JsonIdentityReference;
import com.fasterxml.jackson.annotation.JsonIncludeProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;
import org.kltn.postconnector.api.enums.OrderType;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Table(name = "`Orders`")
public class Order {

    @Id
    @GeneratedValue( strategy = GenerationType.IDENTITY)
    private long id;

    private float total = 0;

    private String address;

    @Column(name = "shipping_fee")
    private float shippingFee;

    @Column(name = "grand_total")
    @JsonProperty(value = "")
    private float grandTotal = 0;

    @Column(name = "payment_at")
    private LocalDateTime paymentAt;

    @Column(name = "create_at")
    private LocalDateTime createAt;

    @Enumerated(EnumType.STRING)
    private OrderType type;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JsonProperty(value = "items")
    private List<OrderItem> orderItems;

    @ManyToOne
    @JsonIdentityReference(alwaysAsId = true)
    @JoinColumn(name = "table_id")
    @JsonIncludeProperties({"id", "name", "status"})
    private TableEntity table;

    @PrePersist
    public void prePersist() {
        this.createAt = LocalDateTime.now();
    }
}
