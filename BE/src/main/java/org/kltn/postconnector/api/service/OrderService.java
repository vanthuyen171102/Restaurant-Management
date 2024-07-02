package org.kltn.postconnector.api.service;

import org.kltn.postconnector.api.domain.Order;
import org.kltn.postconnector.api.dto.OrderDTO;
import org.kltn.postconnector.api.dto.OrderItemDTO;
import org.springframework.data.domain.Page;

import java.util.List;

public interface OrderService {

    Order getById(int orderId);

    List<Order> getOrderByStatus(byte statusId);

    Page<Order> getPagedOrder(int page, int limit);

    List<Order> getAllInProgressOrder();

    Order create(OrderDTO orderDTO);

    void completeOrderItem(int orderItemId);

    void cancelOrderItem(int orderItemId);


    void delete(int orderId);

    Order addItemsToOrder(List<OrderItemDTO> items, int orderId);
}
