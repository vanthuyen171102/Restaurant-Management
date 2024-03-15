package org.kltn.postconnector.api.controller;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import lombok.RequiredArgsConstructor;
import org.kltn.postconnector.api.dto.OrderDTO;
import org.kltn.postconnector.api.dto.OrderItemDTO;
import org.kltn.postconnector.api.model.Order;
import org.kltn.postconnector.api.payload.response.PagedOrderResponse;
import org.kltn.postconnector.api.payload.response.ResponseObject;
import org.kltn.postconnector.api.service.OrderService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/order")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping()
    public ResponseEntity<ResponseObject<PagedOrderResponse>> getPagedOrder(@RequestParam(name = "page", defaultValue = "1") @Min(1) int page,
                                                                            @RequestParam(name = "limit", defaultValue = "10") @Min(5) int limit) {
        return ResponseEntity.ok(ResponseObject.<PagedOrderResponse>builder()
                .code(HttpStatus.OK.value())
                .data(orderService.getPagedOrder(page, limit))
                .build());
    }

    @GetMapping("{id}")
    public ResponseEntity<ResponseObject<Order>> getOrder(@PathVariable(value = "id") long orderId) {
        return ResponseEntity.ok(ResponseObject.<Order>builder()
                .code(HttpStatus.OK.value())
                .data(orderService.getById(orderId))
                .build());
    }

    @GetMapping("/complete/{orderItemId}")
    public ResponseEntity<ResponseObject<Order>> completeOrderItem(@PathVariable(value = "orderItemId") long orderItemId) {
        return ResponseEntity.ok(ResponseObject.<Order>builder()
                .code(HttpStatus.OK.value())
                .message("Đã hoàn thành món ăn!")
                .data(orderService.getById(orderItemId))
                .build());
    }


    @PostMapping()
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<ResponseObject<Order>> createOrder(@Valid @RequestBody OrderDTO orderDTO) {
        return ResponseEntity.ok(ResponseObject.<Order>builder()
                .code(HttpStatus.CREATED.value())
                        .message("Tạo hóa đơn thành công!")
                .data(orderService.create(orderDTO))
                .build());
    }

    @PostMapping("/addItems/{orderId}")
    public ResponseEntity<ResponseObject<Order>> addItemsToOrder(@NotEmpty(message = "Danh sách món ăn thêm vào không được rỗng") @RequestBody
                                                                         List<OrderItemDTO> orderItems, @PathVariable("orderId") long orderId) {
        return ResponseEntity.ok(ResponseObject.<Order>builder()
                .code(HttpStatus.OK.value())
                .message("Thêm món ăn vào hóa đơn thành công!")
                .data(orderService.addItemsToOrder(orderItems, orderId))
                .build());
    }


    @PutMapping("{orderId}")
    public ResponseEntity<ResponseObject<Order>> updateOrder(@Valid @RequestBody OrderDTO orderDTO, @PathVariable("orderId") long orderId) {
        return ResponseEntity.ok(ResponseObject.<Order>builder()
                .code(HttpStatus.OK.value())
                .message("Sửa hóa đơn thành công!")
                .data(orderService.update(orderDTO, orderId))
                .build());
    }

    @DeleteMapping("{orderId}")
    public ResponseEntity<?> deleteEmployee(@PathVariable("orderId") long orderId) {
        orderService.delete(orderId);

        return ResponseEntity.ok(ResponseObject.<Order>builder()
                .code(HttpStatus.OK.value())
                .message("Xóa hóa đơn thành công!")
                .build());
    }
}
