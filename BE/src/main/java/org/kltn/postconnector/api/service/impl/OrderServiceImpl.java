package org.kltn.postconnector.api.service.impl;

import jakarta.persistence.Table;
import lombok.RequiredArgsConstructor;
import org.kltn.postconnector.api.domain.*;
import org.kltn.postconnector.api.dto.OrderDTO;
import org.kltn.postconnector.api.dto.OrderItemDTO;
import org.kltn.postconnector.api.enums.OrderItemStatus;
import org.kltn.postconnector.api.enums.OrderStatus;
import org.kltn.postconnector.api.enums.OrderType;
import org.kltn.postconnector.api.enums.TableStatus;
import org.kltn.postconnector.api.exception.BadRequestException;
import org.kltn.postconnector.api.exception.ResourceNotFoundException;
import org.kltn.postconnector.api.repository.OrderItemRepository;
import org.kltn.postconnector.api.repository.OrderRepository;
import org.kltn.postconnector.api.repository.TableOrderRepository;
import org.kltn.postconnector.api.repository.TableRepository;
import org.kltn.postconnector.api.service.ItemService;
import org.kltn.postconnector.api.service.OrderService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;

    private final OrderItemRepository orderItemRepository;

    private final TableRepository tableRepository;

    private final ItemService itemService;

    private final SimpMessagingTemplate messagingTemplate;
    private final TableOrderRepository tableOrderRepository;

    @Override
    public Order getById(int orderId) {
        return orderRepository.findById(orderId).orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy hóa đơn!"));
    }

    @Override
    public List<Order> getOrderByStatus(byte statusId) {
        return null;
    }

    @Override
    public Page<Order> getPagedOrder(int page, int limit) {
        return orderRepository.findAll(PageRequest.of(page - 1, limit, Sort.by(Sort.Direction.DESC, "createAt")));
    }

    @Override
    public List<Order> getAllInProgressOrder() {
        return orderRepository.findAllInProgressOrder();
    }

    @Override
    @Transactional
    public Order create(OrderDTO orderDTO) {
        Order order = new Order();
        order.setType(orderDTO.getType());

        List<OrderItem> orderItems = new ArrayList<>();
        orderItems = orderDTO.getItems().stream()
                .map(orderItemDTO -> {
                    try {
                        Item item = itemService.getById(orderItemDTO.getItemId());
                        if (orderItemDTO.getQuantity() > item.getStock()) {
                            throw new BadRequestException("Món %s không đủ số lượng để phục vụ".formatted(item.getTitle()));
                        }
                        return OrderItem.builder()
                                .order(order)
                                .item(item)
                                .profit(item.getPrice()- item.getCapitalPrice())
                                .price(item.getPrice())
                                .quantity(orderItemDTO.getQuantity())
                                .note(orderItemDTO.getNote())
                                .build();
                    } catch (ResourceNotFoundException ex) {
                        throw new ResourceNotFoundException(String.format("Không tìm thấy món ăn với ID = %d!", orderItemDTO.getItemId()));
                    }
                })
                .collect(Collectors.toList());

        // Set order items to order and save order
        order.setOrderItems(orderItems);
        Order createdOrder = orderRepository.save(order);

        // Update stock for items
        for (OrderItem orderItem : orderItems) {
            Item item = orderItem.getItem();
            itemService.updateStock(item.getStock() - orderItem.getQuantity(), item.getId());
        }

        if (orderDTO.getType() == OrderType.DINE_IN) {
            List<TableOrder> tableOrders = new ArrayList<>();
            for (Integer tableId : orderDTO.getTableIds()) {
                TableEntity table = tableRepository.findById(tableId)
                        .orElseThrow(() -> new ResourceNotFoundException(String.format("Không tìm thấy bàn với ID = %d", tableId)));
                if (table.getStatus().equals(TableStatus.USING)) {
                    throw new BadRequestException(String.format("Bàn %s - Khu %s đang được sử dụng!", table.getName(), table.getArea().getName()));
                }
                // Update table status and current order
                table.setCurrentOrder(createdOrder);
                table.setStatus(TableStatus.USING);
                tableRepository.save(table);

                TableOrder tableOrder = new TableOrder();
                tableOrder.setTable(table);
                tableOrder.setOrder(createdOrder);
                tableOrderRepository.save(tableOrder);
                tableOrders.add(tableOrder);
                createdOrder.getTables().add(tableOrder);
            }
            for (TableOrder tableOrder : tableOrders) {
                messagingTemplate.convertAndSend(String.format("/topic/table/update/%s", tableOrder.getTable().getId()), tableOrder.getTable());
            }
        } else if (orderDTO.getType() == OrderType.DELIVERY) {
            order.setAddress(orderDTO.getAddress());
            order.setShippingFee(orderDTO.getShippingFee());
        }

        messagingTemplate.convertAndSend("/topic/order/new-order", createdOrder);

        return createdOrder;
    }



    @Override
    @Transactional
    public void delete(int orderId) {
        Order order = orderRepository.findById(orderId).orElseThrow(() ->
                new ResourceNotFoundException(String.format("Không tìm thấy hóa đơn muốn xóa {ID = %d}!", orderId)));
        orderRepository.deleteById(orderId);
    }

    @Override
    public void completeOrderItem(int orderItemId) {
        OrderItem orderItem = orderItemRepository.findById(orderItemId).orElseThrow(() ->
                new ResourceNotFoundException(String.format("Không tìm thấy chi tiết hóa đơn muốn hoàn thành {ID = %d}!", orderItemId)));

        if (orderItem.getStatus().equals(OrderItemStatus.WAITING)) {
            orderItem.setStatus(OrderItemStatus.COMPLETED);

            orderItemRepository.save(orderItem);
            Order order = orderItem.getOrder();
            for (TableOrder tableOrder : order.getTables()) {
                messagingTemplate.convertAndSend(String.format("/topic/table/update/%s", tableOrder.getTable().getId()), tableOrder.getTable());
            }
            messagingTemplate.convertAndSend("/topic/order/update/" + orderItem.getOrder().getId(), order);
        }
    }


    @Override
    public void cancelOrderItem(int orderItemId) {
        OrderItem orderItem = orderItemRepository.findById(orderItemId).orElseThrow(() ->
                new ResourceNotFoundException(String.format("Không tìm thấy chi tiết hóa đơn muốn hủy {ID = %d}!", orderItemId)));

        if (orderItem.getStatus().equals(OrderItemStatus.COMPLETED))
            throw new BadRequestException("Món ăn này đã được hoàn thành nên không thể hủy!");

        orderItem.setStatus(OrderItemStatus.CANCELLED);

        Order order = orderItem.getOrder();
        order.preUpdate();

        orderItemRepository.save(orderItem);
        Order updatedOrder = orderRepository.save(order);

        messagingTemplate.convertAndSend("/topic/order/update/" + updatedOrder.getId(), updatedOrder);
        for (TableOrder tableOrder : order.getTables()) {
            messagingTemplate.convertAndSend(String.format("/topic/table/update/%s", tableOrder.getTable().getId()), tableOrder.getTable());
        }
    }

    @Override
    @Transactional
    public Order addItemsToOrder(List<OrderItemDTO> orderItemsDTO, int orderId) {
        Order order = orderRepository.findById(orderId).orElseThrow(() ->
                new ResourceNotFoundException(String.format("Không tìm thấy hóa đơn muốn sửa {ID = %d}!", orderId)));

        if (order.getStatus().equals(OrderStatus.Completed)) {
            throw new BadRequestException("Hóa đơn này đã hoàn thành!");
        }

        List<OrderItem> orderItemsExisting = order.getOrderItems();

        List<OrderItem> orderItems = orderItemsDTO.stream().map(orderItem -> {
            try {
                Item item = itemService.getById(orderItem.getItemId());
                if (item.getStock() < orderItem.getQuantity()) {
                    throw new BadRequestException(String.format("Món ăn %s không đủ!", item.getTitle()));
                }
                return OrderItem.builder()
                        .order(order)
                        .item(item)
                        .profit(item.getPrice() - item.getCapitalPrice())
                        .price(item.getPrice())
                        .quantity(orderItem.getQuantity())
                        .note(orderItem.getNote())
                        .build();
            } catch (ResourceNotFoundException ex) {
                throw new ResourceNotFoundException(String.format("Không tìm thấy món ăn #%s!", orderItem.getItemId()));
            }
        }).toList();

        for (OrderItem orderItem : orderItems) {
            Item item = orderItem.getItem();
            itemService.updateStock(item.getStock() - orderItem.getQuantity(), item.getId());
        }

        orderItemsExisting.addAll(orderItems);

        order.preUpdate();

        Order updatedOrder = orderRepository.save(order);

        messagingTemplate.convertAndSend("/topic/order/add-order-item", updatedOrder);
        for (TableOrder tableOrder : order.getTables()) {
            messagingTemplate.convertAndSend(String.format("/topic/table/update/%s", tableOrder.getTable().getId()), tableOrder.getTable());
        }

        messagingTemplate.convertAndSend(String.format("/topic/order/update/%s", order.getId()), updatedOrder);

        return updatedOrder;
    }


}
