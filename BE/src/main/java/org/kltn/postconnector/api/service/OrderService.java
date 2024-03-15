package org.kltn.postconnector.api.service;

import org.kltn.postconnector.api.dto.OrderDTO;
import org.kltn.postconnector.api.dto.OrderItemDTO;
import org.kltn.postconnector.api.model.Order;
import org.kltn.postconnector.api.payload.response.PagedOrderResponse;

import java.util.List;

public interface OrderService {

    Order getById(Long orderId);

    List<Order> getOrderByStatus(byte statusId);
    PagedOrderResponse getPagedOrder(int page, int limit);

    Order create(OrderDTO orderDTO);


    Order update(OrderDTO orderDTO, long orderId);

    void delete(long orderId);

    Order addItemsToOrder(List<OrderItemDTO> items, long orderId);
}
