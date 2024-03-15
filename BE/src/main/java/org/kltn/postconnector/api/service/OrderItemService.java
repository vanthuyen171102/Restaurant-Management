package org.kltn.postconnector.api.service;

import org.kltn.postconnector.api.enums.OrderItemStatus;
import org.kltn.postconnector.api.model.OrderItem;

import java.util.List;

public interface OrderItemService {
    List<OrderItem> getAllByOrderId(long orderId);

    void delete(long orderItemId);

    OrderItem updateStatus(long orderItemId, OrderItemStatus status);

    void deleteAllByOrderId(long orderId);
}
