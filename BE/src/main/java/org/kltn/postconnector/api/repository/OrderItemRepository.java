package org.kltn.postconnector.api.repository;

import org.kltn.postconnector.api.domain.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Integer> {
    void deleteAllByOrderId(int orderId);

    List<OrderItem> findAllByOrderId(int orderId);
}
