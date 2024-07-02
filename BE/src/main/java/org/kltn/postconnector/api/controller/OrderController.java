package org.kltn.postconnector.api.controller;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import org.kltn.postconnector.api.domain.Order;
import org.kltn.postconnector.api.dto.OrderDTO;
import org.kltn.postconnector.api.dto.OrderItemDTO;
import org.kltn.postconnector.api.payload.response.PagedResponse;
import org.kltn.postconnector.api.service.OrderService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping("/orders")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'CASHIER')")
    public PagedResponse<Order> getPagedOrder(@RequestParam(name = "page", defaultValue = "1") @Min(1) int page,
                                              @RequestParam(name = "limit", defaultValue = "10") @Min(5) @Max(20) int limit) {
        Page<Order> pagedOrder = orderService.getPagedOrder(page, limit);
        return PagedResponse.<Order>builder()
                .total(pagedOrder.getTotalElements())
                .currentPage(pagedOrder.getNumber() + 1)
                .totalPage(pagedOrder.getTotalPages())
                .items(pagedOrder.getContent())
                .build();
    }

    @GetMapping("/order/get-all-in-progress-order")
    @PreAuthorize("isAuthenticated()")
    public List<Order> getInProgressOrder() {
        return orderService.getAllInProgressOrder();
    }

    @GetMapping("/order/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'CASHIER')")
    public Order getOrder(@PathVariable(value = "id") int orderId) {
        return orderService.getById(orderId);
    }

    @PostMapping("/order/complete/{orderItemId}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'KITCHEN')")
    public void completeOrderItem(@PathVariable(value = "orderItemId") int orderItemId) {
        orderService.completeOrderItem(orderItemId);
    }

    @PostMapping("/order/cancel/{orderItemId}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'KITCHEN')")
    public void cancelOrderItem(@PathVariable(value = "orderItemId") int orderItemId) {
        orderService.cancelOrderItem(orderItemId);
    }


    @PostMapping("/order/create")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyAuthority('ADMIN', 'CASHIER','WAITER')")
    public Order createOrder(@Valid @RequestBody OrderDTO orderDTO) {
        return orderService.create(orderDTO);
    }

    @PostMapping("/order/addItems/{orderId}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'CASHIER','WAITER')")
    public Order addItemsToOrder(@NotEmpty(message = "Danh sách món ăn thêm vào không được rỗng!") @RequestBody
                                 List<OrderItemDTO> orderItems, @PathVariable("orderId") int orderId) {
        return orderService.addItemsToOrder(orderItems, orderId);
    }


    @DeleteMapping("/order/{orderId}")
    public void deleteOrder(@PathVariable("orderId") int orderId) {
        orderService.delete(orderId);
    }
}
