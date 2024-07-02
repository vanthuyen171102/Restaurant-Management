package org.kltn.postconnector.api.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;
import org.kltn.postconnector.api.constants.Constants;
import org.kltn.postconnector.api.enums.OrderItemStatus;
import org.kltn.postconnector.api.enums.OrderStatus;
import org.kltn.postconnector.api.enums.OrderType;
import org.kltn.postconnector.api.enums.PaymentStatus;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "`Orders`")
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private float total = 0;

    private String address;

    @Column(name = "shipping_fee")
    private float shippingFee;

    @Column(name = "vat_fee")
    private float vatFee = 0;

    @Column(name = "grand_total")
    private float grandTotal = 0;

    private float paid = 0;

    @Column(name = "payment_status")
    @Enumerated(EnumType.STRING)
    private PaymentStatus paymentStatus;

    @Column(name = "create_at")
    private LocalDateTime createAt;

    @Enumerated(EnumType.STRING)
    private OrderType type;

    @Enumerated(EnumType.STRING)
    private OrderStatus status;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JsonProperty(value = "items")
    private List<OrderItem> orderItems = new ArrayList<>();

    @OneToMany(mappedBy = "order", fetch = FetchType.EAGER)
    @JsonIgnoreProperties({"order"})
    private List<Payment> payments = new ArrayList<>();

    @OneToMany(mappedBy = "order" , fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TableOrder> tables = new ArrayList<>();

    @PrePersist
    public void prePersist() {
        if (this.type.equals(OrderType.DINE_IN))
            this.shippingFee = 0;
        this.createAt = LocalDateTime.now();
        this.status = OrderStatus.InProgress;

        updateOrderCost();
        updatePaymentStatus();
    }

    @PreUpdate
    public void preUpdate() {
        updateOrderCost();
        updatePaymentStatus();
    }


    private float calculateTotal(List<OrderItem> orderItems) {
        return (float) orderItems.stream()
                .filter(orderItem -> !OrderItemStatus.CANCELLED.equals(orderItem.getStatus()))
                .mapToDouble(item ->
                {
                    return item.getPrice() * item.getQuantity();
                })
                .sum();
    }

    private void updateOrderCost() {
        this.total = calculateTotal(this.orderItems);
        this.vatFee = Constants.VAT_VALUE * total;
        this.grandTotal = total + vatFee;
    }

    private void updatePaymentStatus() {
        if (paid == 0 && grandTotal > 0)
            this.paymentStatus = PaymentStatus.PENDING;
        else if (paid < grandTotal)
            this.paymentStatus = PaymentStatus.MISSING;
        else if (paid == grandTotal)
            this.paymentStatus = PaymentStatus.PAID;
        else
            this.paymentStatus = PaymentStatus.REFUND_NEEDED;
    }
}
