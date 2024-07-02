package org.kltn.postconnector.api.service.impl;

import lombok.RequiredArgsConstructor;
import org.kltn.postconnector.api.domain.Order;
import org.kltn.postconnector.api.domain.OrderItem;
import org.kltn.postconnector.api.enums.OrderItemStatus;
import org.kltn.postconnector.api.exception.ResourceNotFoundException;
import org.kltn.postconnector.api.repository.OrderItemRepository;
import org.kltn.postconnector.api.repository.OrderRepository;
import org.kltn.postconnector.api.service.OrderItemService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderItemServiceImpl implements OrderItemService {

    private final OrderItemRepository orderItemRepository;

    private final OrderRepository orderRepository;


    @Override
    public List<OrderItem> getAllByOrderId(int orderId) {
        return orderItemRepository.findAllByOrderId(orderId);
    }

    @Override
    public OrderItem updateStatus(int orderItemId, OrderItemStatus status) {
        OrderItem orderItem = orderItemRepository.findById(orderItemId).orElseThrow(() -> new ResourceNotFoundException(String.format("Không tìm thấy OrderItem {ID = %s}", orderItemId)));
        orderItem.setStatus(status);
        return orderItemRepository.save(orderItem);
    }

    @Override
    public void delete(int orderItemId) {
        OrderItem orderItem = orderItemRepository.findById(orderItemId).orElseThrow(() -> new ResourceNotFoundException(String.format("Không tìm thấy OrderItem {ID = %s}", orderItemId)));
        orderItemRepository.deleteById(orderItemId);
    }

    @Override
    public void deleteAllByOrderId(int orderId) {
        Order order = orderRepository.findById(orderId).orElseThrow(() ->
                new ResourceNotFoundException(String.format("Không tìm thấy hóa đơn {ID = %s}", orderId)
                ));
        orderItemRepository.deleteAllByOrderId(orderId);
    }
}
