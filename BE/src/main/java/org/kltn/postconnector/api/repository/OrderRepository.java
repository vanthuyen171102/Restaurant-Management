package org.kltn.postconnector.api.repository;

import org.kltn.postconnector.api.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {
}
