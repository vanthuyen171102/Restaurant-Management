package org.kltn.postconnector.api.controller;

import jakarta.validation.Valid;
import org.kltn.postconnector.api.dto.CategoryDTO;
import org.kltn.postconnector.api.model.Category;
import org.kltn.postconnector.api.payload.response.ResponseObject;
import org.kltn.postconnector.api.service.CategoryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/category")
public class CategoryController {
    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping()
    public ResponseEntity<ResponseObject<List<Category>>> getAllCategory() {
        return ResponseEntity.ok(ResponseObject.<List<Category>>builder()
                .code(HttpStatus.OK.value())
                .data(categoryService.getAll())
                .build());
    }


    @GetMapping("{slug}")
    public ResponseEntity<ResponseObject<Category>> getCategoryBySlug(@PathVariable(value = "slug") String slug) {
        return ResponseEntity.ok(ResponseObject.<Category>builder()
                .code(HttpStatus.OK.value())
                .data(categoryService.getBySlug(slug))
                .build());
    }

    @PostMapping()
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<ResponseObject<?>> createCategory(@Valid @ModelAttribute CategoryDTO categoryDTO) {
        return ResponseEntity.ok(ResponseObject.<Category>builder()
                .code(HttpStatus.CREATED.value())
                .message("Thêm danh mục thành công!")
                .data(categoryService.create(categoryDTO))
                .build());
    }

    @PutMapping("{id}")
    public ResponseEntity<ResponseObject<?>> updateCategory(@Valid @ModelAttribute CategoryDTO categoryDTO, @PathVariable("id") int id) {
        return ResponseEntity.ok(ResponseObject.<Category>builder()
                .code(HttpStatus.OK.value())
                .message("Sửa danh mục thành công!")
                .data(categoryService.update(categoryDTO, id))
                .build());
    }

    @DeleteMapping("{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable("id") int id) {
        categoryService.delete(id);

        return ResponseEntity.ok(ResponseObject.builder()
                .code(HttpStatus.OK.value())
                .message("Xóa danh mục thành công!")
                .build());
    }
}
