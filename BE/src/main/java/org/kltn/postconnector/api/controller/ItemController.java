package org.kltn.postconnector.api.controller;

import jakarta.validation.Valid;
import org.kltn.postconnector.api.dto.ItemDTO;
import org.kltn.postconnector.api.model.Item;
import org.kltn.postconnector.api.model.Order;
import org.kltn.postconnector.api.payload.response.ResponseObject;
import org.kltn.postconnector.api.service.ItemService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/item")
public class ItemController {
    private final ItemService itemService;

    public ItemController(ItemService itemService) {
        this.itemService = itemService;
    }

    @GetMapping()
    public ResponseEntity<ResponseObject<List<Item>>> getAllItem() {
        return ResponseEntity.ok(ResponseObject.<List<Item>>builder()
                .code(HttpStatus.OK.value())
                .data(itemService.getAll())
                .build());
    }

    @GetMapping("{slug}")
    public ResponseEntity<ResponseObject<Item>> getItem(@PathVariable(value = "slug") String slug) {
        return ResponseEntity.ok(ResponseObject.<Item>builder()
                .code(HttpStatus.OK.value())
                .data(itemService.getBySlug(slug))
                .build());
    }

    @PostMapping()
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<ResponseObject<?>> createItem(@Valid @ModelAttribute ItemDTO itemDTO) {
        return ResponseEntity.ok(ResponseObject.<Item>builder()
                .code(HttpStatus.CREATED.value())
                .message("Thêm mặt hàng thành công!")
                .data(itemService.create(itemDTO))
                .build());
    }

    @PutMapping("{id}")
    public ResponseEntity<ResponseObject<Item>> updateItem(@Valid @ModelAttribute ItemDTO itemDTO, @PathVariable("id") int id) {
        return ResponseEntity.ok(ResponseObject.<Item>builder()
                .code(HttpStatus.OK.value())
                .message("Sửa mặt hàng thành công!")
                .data(itemService.update(itemDTO, id))
                .build());
    }

    @DeleteMapping("{id}")
    public ResponseEntity<?> deleteItem(@PathVariable("id") int id) {
        itemService.delete(id);
        return ResponseEntity.ok(ResponseObject.<Order>builder()
                .code(HttpStatus.OK.value())
                .message("Xóa mặt hàng thành công!")
                .build());
    }
}
