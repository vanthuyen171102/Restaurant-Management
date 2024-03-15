package org.kltn.postconnector.api.service.impl;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import org.kltn.postconnector.api.dto.OrderDTO;
import org.kltn.postconnector.api.dto.OrderItemDTO;
import org.kltn.postconnector.api.enums.OrderType;
import org.kltn.postconnector.api.exception.ResourceNotFoundException;
import org.kltn.postconnector.api.model.Item;
import org.kltn.postconnector.api.model.Order;
import org.kltn.postconnector.api.model.OrderItem;
import org.kltn.postconnector.api.payload.response.PagedOrderResponse;
import org.kltn.postconnector.api.repository.OrderRepository;
import org.kltn.postconnector.api.service.ItemService;
import org.kltn.postconnector.api.service.OrderItemService;
import org.kltn.postconnector.api.service.OrderService;
import org.kltn.postconnector.api.service.TableService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;

    private final OrderItemService orderItemService;

    private final TableService tableService;

    private final ItemService itemService;

    @Override
    public Order getById(Long orderId) {
        return orderRepository.findById(orderId).orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy hóa đơn!"));
    }

    @Override
    public List<Order> getOrderByStatus(byte statusId) {
        return null;
    }

    @Override
    public PagedOrderResponse getPagedOrder(int page, int limit) {
        Page<Order> orders = orderRepository.findAll(PageRequest.of(0, limit));

        return new PagedOrderResponse(orders.stream().toList(),
                orders.getTotalElements(),
                page, orders.getTotalPages());
    }

    @Override
    public Order create(OrderDTO orderDTO) {
        Order order = new Order();

        mapToEntity(order, orderDTO);

        // Tính toán tiền hóa đơn
        calculateTotal(order);

        return orderRepository.save(order);
    }




    @Override
    @Transactional
    public Order update(OrderDTO orderDTO, long orderId) {
        Order order = orderRepository.findById(orderId).orElseThrow(() ->
                new ResourceNotFoundException(String.format("Không tìm thấy hóa đơn muốn sửa {ID = %d}!", orderId)));

        // Xóa các món ăn cữ có trong hóa đơn
        orderItemService.deleteAllByOrderId(orderId);

        mapToEntity(order, orderDTO);

        // Tính toán tiền hóa đơn
        calculateTotal(order);

        return orderRepository.save(order);

    }

    @Override
    @Transactional
    public void delete(long orderId) {
        Order order = orderRepository.findById(orderId).orElseThrow(() ->
                new ResourceNotFoundException(String.format("Không tìm thấy hóa đơn muốn xóa {ID = %d}!", orderId)));
        // Xóa các món ăn cữ có trong hóa đơn
        orderItemService.deleteAllByOrderId(orderId);
        orderRepository.deleteById(orderId);
    }

    @Override
    @Transactional
    public Order addItemsToOrder(List<OrderItemDTO> orderItems, long orderId) {
        Order order = orderRepository.findById(orderId).orElseThrow(() ->
                new ResourceNotFoundException(String.format("Không tìm thấy hóa đơn muốn sửa {ID = %d}!", orderId)));

        List<OrderItem> itemsExisting = order.getOrderItems();


        orderItems.forEach(orderItemDTO -> {
            try {
                Item item = itemService.getById(orderItemDTO.getItemId());
                itemsExisting.add(OrderItem.builder()
                        .order(order)
                        .item(item)
                        .price(item.getPrice())
                        .discount(item.getDiscount())
                        .quantity(orderItemDTO.getQuantity())
                        .note(orderItemDTO.getNote())
                        .build());
            } catch (ResourceNotFoundException ex) {
                throw new ResourceNotFoundException(String.format("Không tìm thấy món ăn {ID = %d}!", orderItemDTO.getItemId()));
            }
        });

        // Tính toán tiền hóa đơn
        calculateTotal(order);

        return orderRepository.save(order);
    }

    public void mapToEntity(Order order, OrderDTO orderDTO) {

        order.setTotal(0);
        order.setGrandTotal(0);

        OrderType orderType = OrderType.valueOf(orderDTO.getType());

        // Xử lý kiểu hóa đơn
        if (orderType == OrderType.DINE_IN) {
            try {
                order.setTable(tableService.getById(orderDTO.getTableId()));
            } catch (ResourceNotFoundException ex) {
                throw new ResourceNotFoundException(String.format("Không tìm thấy bàn muốn tạo hóa đơn {ID = %d}!", orderDTO.getTableId()));
            }
        } else if (orderType == OrderType.DELIVERY) {
            order.setAddress(orderDTO.getAddress());
            order.setShippingFee(orderDTO.getShippingFee());
        }


        order.setType(orderType);

        // Xử lý danh sách SP
        order.setOrderItems(orderDTO.getItems().stream()
                .map(orderItemDTO -> {
                    try {
                        Item item = itemService.getById(orderItemDTO.getItemId());
                        return OrderItem.builder()
                                .order(order)
                                .item(item)
                                .price(item.getPrice())
                                .discount(item.getDiscount())
                                .quantity(orderItemDTO.getQuantity())
                                .note(orderItemDTO.getNote())
                                .build();
                    } catch (ResourceNotFoundException ex) {
                        throw new ResourceNotFoundException(String.format("Không tìm thấy món ăn {ID = %d}!", orderItemDTO.getItemId()));
                    }
                })
                .collect(Collectors.toList()));
    }

    public void calculateTotal(Order order) {
        if (order != null) {
            if (!order.getOrderItems().isEmpty()) {

                float total = (float) order.getOrderItems().stream()
                        .mapToDouble(item ->
                        {
                            float discountFactor = (item.getDiscount() > 0) ? (100 - item.getDiscount()) / 100.0f : 1.0f;
                            return item.getPrice() * item.getQuantity() * discountFactor;
                        })
                        .sum();
                order.setTotal(total);

                order.setGrandTotal(total + (order.getShippingFee() > 0 ? order.getShippingFee() : 0));
            } else {
                order.setTotal(0);
                order.setGrandTotal(0);
            }
        }
    }
}
