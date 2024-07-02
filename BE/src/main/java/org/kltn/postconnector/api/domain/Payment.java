package org.kltn.postconnector.api.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import org.kltn.postconnector.api.enums.PaymentMethod;
import org.kltn.postconnector.api.enums.PaymentStatus;

import java.time.LocalDateTime;

@Entity
@Table(name = "`Payment`")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class Payment {
    @Id
    private int id;

    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)
    @JsonIgnoreProperties({"payments"})
    private Order order;

    private float amount;

    @Column(name = "paid_amount")
    private float paidAmount = 0;

    @Column(name = "payment_status")
    @Enumerated(EnumType.STRING)
    private PaymentStatus paymentStatus;

    @Column(name = "payment_url")
    private String paymentUrl;

    @Column(name = "payment_method")
    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod;

    @Column(name = "payment_at")
    private LocalDateTime paymentAt;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist()
    public void prePersist() {
        createdAt = LocalDateTime.now();

        if (paidAmount == 0)
            this.paymentStatus = PaymentStatus.PENDING;
        else {
            this.paymentAt = LocalDateTime.now();
            if (paidAmount < amount)
                this.paymentStatus = PaymentStatus.MISSING;
            else if (paidAmount == amount)
                this.paymentStatus = PaymentStatus.PAID;
            else
                this.paymentStatus = PaymentStatus.REFUND_NEEDED;
        }
    }

    @PreUpdate()
    public void preUpdate() {
        if (paidAmount == 0)
            this.paymentStatus = PaymentStatus.PENDING;
        else {
            this.paymentAt = LocalDateTime.now();
            if (paidAmount < amount)
                this.paymentStatus = PaymentStatus.MISSING;
            else if (paidAmount == amount)
                this.paymentStatus = PaymentStatus.PAID;
            else
                this.paymentStatus = PaymentStatus.REFUND_NEEDED;
        }
    }
}
