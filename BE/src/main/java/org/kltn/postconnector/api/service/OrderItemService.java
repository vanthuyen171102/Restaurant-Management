package org.kltn.postconnector.api.service;

import org.kltn.postconnector.api.domain.OrderItem;
import org.kltn.postconnector.api.enums.OrderItemStatus;

import java.util.List;

public interface OrderItemService {
    List<OrderItem> getAllByOrderId(int orderId);

    void delete(int orderItemId);

    OrderItem updateStatus(int orderItemId, OrderItemStatus status);

    void deleteAllByOrderId(int orderId);
}
