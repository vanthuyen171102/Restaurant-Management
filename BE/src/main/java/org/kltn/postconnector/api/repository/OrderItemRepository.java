package org.kltn.postconnector.api.repository;

import org.kltn.postconnector.api.model.Order;
import org.kltn.postconnector.api.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    void deleteAllByOrderId(long orderId);

    List<OrderItem> findAllByOrderId(long orderId);
}
