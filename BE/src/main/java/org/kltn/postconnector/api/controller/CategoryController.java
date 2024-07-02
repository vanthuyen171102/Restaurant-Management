package org.kltn.postconnector.api.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.kltn.postconnector.api.domain.Category;
import org.kltn.postconnector.api.dto.CategoryDTO;
import org.kltn.postconnector.api.service.CategoryService;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1")
public class CategoryController {
    private final CategoryService categoryService;


    @GetMapping("categories/all")
    @PreAuthorize("permitAll()")
    public List<Category> getAllCategory() {
        return categoryService.getAll();
    }

    @GetMapping("category/{id}")
    @PreAuthorize("permitAll()")
    public Category getCategoryById(@PathVariable(value = "id") Integer id) {
        return categoryService.getById(id);
    }

    @PostMapping("category/create")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public Category createCategory(@Valid @RequestBody CategoryDTO categoryDTO) {
        return categoryService.create(categoryDTO);
    }

    @PutMapping("category/update/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public Category updateCategory(@Valid @RequestBody CategoryDTO categoryDTO, @PathVariable("id") int id) {
        return categoryService.update(categoryDTO, id);
    }

    @DeleteMapping("category/delete/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public void deleteCategory(@PathVariable("id") int id) {
        categoryService.delete(id);
    }
}
