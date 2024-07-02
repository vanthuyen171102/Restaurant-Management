package org.kltn.postconnector.api.repository;

import org.kltn.postconnector.api.domain.Payment;
import org.kltn.postconnector.api.enums.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Integer> {
    @Query("SELECT p FROM Payment p WHERE p.order.id = :orderId")
    List<Payment> findAllByOrderId(int orderId);

    Optional<Payment> findFirstByOrderIdAndPaymentStatus(int orderId, PaymentStatus paymentStatus);
}
