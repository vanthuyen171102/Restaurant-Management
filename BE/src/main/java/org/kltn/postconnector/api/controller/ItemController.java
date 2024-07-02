package org.kltn.postconnector.api.controller;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.kltn.postconnector.api.domain.Item;
import org.kltn.postconnector.api.dto.ItemDTO;
import org.kltn.postconnector.api.payload.response.PagedResponse;
import org.kltn.postconnector.api.service.ItemService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1")
public class ItemController {
    private final ItemService itemService;

    @GetMapping("/items")
    @PreAuthorize("permitAll()")
    public PagedResponse<Item> getPagedItems(
            @RequestParam(name = "page", defaultValue = "1", required = false) @Min(1) int page,
            @RequestParam(name = "keyword", defaultValue = "", required = false) String keyword,
            @RequestParam(name = "catId", required = false) Integer catId) {
        Page<Item> pagedItem = itemService.getPagedItem(page - 1, catId, keyword);

        return PagedResponse.<Item>builder()
                .total(pagedItem.getTotalElements())
                .currentPage(pagedItem.getNumber() + 1)
                .totalPage(pagedItem.getTotalPages())
                .items(pagedItem.getContent()).build();
    }


    @GetMapping("/items/all")
    @PreAuthorize("permitAll()")
    public List<Item> getAllItem() {
        return itemService.getAll();
    }

    @GetMapping("/items/enable")
    @PreAuthorize("isAuthenticated()")
    public List<Item> getEnableItems() {
        return itemService.getEnableItem();
    }

    @GetMapping("/item/{id}")
    @PreAuthorize("permitAll()")
    public Item getItemById(@PathVariable(value = "id") int id) {
        return itemService.getById(id);
    }

    @PostMapping("/item/create")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    @ResponseStatus(HttpStatus.CREATED)
    public Item createItem(@Valid @ModelAttribute ItemDTO itemDTO) {
        return itemService.create(itemDTO);
    }

    @PutMapping("item/update/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public Item updateItem(@Valid @ModelAttribute ItemDTO itemDTO, @PathVariable("id") int id) {
        return itemService.update(itemDTO, id);
    }

    @PatchMapping("item/updateStock/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'KITCHEN')")
    public Item updateStock(@PathVariable("id") int id,
                            @RequestParam @Min(value = 0, message = "Giá trị tồn >= 0") int stock) {
        return itemService.updateStock(stock, id);
    }

    @DeleteMapping("item/delete/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public void deleteItem(@PathVariable("id") int id) {
        itemService.delete(id);
    }
}
