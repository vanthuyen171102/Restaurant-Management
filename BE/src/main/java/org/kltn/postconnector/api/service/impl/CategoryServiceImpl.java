package org.kltn.postconnector.api.service.impl;

import lombok.RequiredArgsConstructor;
import org.kltn.postconnector.api.constants.Constants;
import org.kltn.postconnector.api.domain.Category;
import org.kltn.postconnector.api.dto.CategoryDTO;
import org.kltn.postconnector.api.exception.BadRequestException;
import org.kltn.postconnector.api.exception.ResourceNotFoundException;
import org.kltn.postconnector.api.repository.CategoryRepository;
import org.kltn.postconnector.api.service.CategoryService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    @Override
    public List<Category> getAll() {
        return categoryRepository.findAll();
    }

    @Override
    public Category getById(int categoryId) {
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy danh mục muốn tìm"));
    }

    @Override
    public Category create(CategoryDTO categoryDTO) {
        if (!categoryRepository.findAllByTitle(categoryDTO.getTitle()).isEmpty()) {
            throw new BadRequestException("Tên danh mục %s đã tồn tại!".formatted(categoryDTO.getTitle()));
        }
        Category category = new Category(categoryDTO.getTitle());
        return categoryRepository.save(category);
    }

    @Override
    public Category update(CategoryDTO categoryDTO, int categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy danh mục muốn sửa!"));

        if (!category.getTitle().equals(categoryDTO.getTitle()) && !categoryRepository.findAllByTitle(categoryDTO.getTitle()).isEmpty()) {
            throw new BadRequestException("Tên danh mục %s đã được sử dụng!".formatted(categoryDTO.getTitle()));
        }
        category.setTitle(categoryDTO.getTitle());
        return categoryRepository.save(category);
    }

    @Override
    public void delete(int categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy danh mục muốn xóa!"));

        if (category.getTitle().equals(Constants.UNCATEGORY_TITLE)) {
            throw new BadRequestException("Không thể xóa danh mục 'Chưa phân loại'");
        }

        categoryRepository.deleteById(categoryId);
    }

    public void mapDTOToEntity(Category category, CategoryDTO categoryDTO) {

        // Gán thông tin danh mục
        category.setTitle(categoryDTO.getTitle());
    }
}
