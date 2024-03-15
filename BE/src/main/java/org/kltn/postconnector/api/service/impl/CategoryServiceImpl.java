package org.kltn.postconnector.api.service.impl;

import org.kltn.postconnector.api.dto.CategoryDTO;
import org.kltn.postconnector.api.exception.ResourceNotFoundException;
import org.kltn.postconnector.api.model.Category;
import org.kltn.postconnector.api.repository.CategoryRepository;
import org.kltn.postconnector.api.service.CategoryService;
import org.kltn.postconnector.api.utils.ImageUtil;
import org.kltn.postconnector.api.utils.StringUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.Instant;
import java.util.List;

@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final ImageUtil imageUtil;

    @Autowired
    public CategoryServiceImpl(CategoryRepository categoryRepository, ImageUtil imageUtil) {
        this.categoryRepository = categoryRepository;
        this.imageUtil = imageUtil;
    }

    @Override
    public boolean isSlugExist(String slug) {
        return categoryRepository.findBySlug(slug).isPresent();
    }

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
    public Category getBySlug(String slug) {
        return categoryRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy danh mục muốn tìm"));
    }

    @Override
    public Category create(CategoryDTO categoryDTO) {
        Category category = new Category();
        mapDTOToEntity(category, categoryDTO);
        return categoryRepository.save(category);
    }

    @Override
    public Category update(CategoryDTO categoryDTO, int categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy danh mục muốn sửa!"));

        mapDTOToEntity(category, categoryDTO);
        return categoryRepository.save(category);
    }

    @Override
    public void delete(int categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy danh mục muốn xóa!"));

        categoryRepository.deleteById(categoryId);
    }

    public void mapDTOToEntity(Category category, CategoryDTO categoryDTO) {

        // Gán thông tin danh mục
        category.setTitle(categoryDTO.getTitle());
        category.setSummary(categoryDTO.getSummary());
        category.setDisable(categoryDTO.getDisable());

        // Xử lý Slug
        String slug = StringUtil.generateSlug(category.getTitle());
        // Nếu slug mới # slug cũ
        if (!slug.equals(category.getSlug())) {
            if (isSlugExist(slug)) {
                slug += "-" + Instant.now().getEpochSecond();
            }
            category.setSlug(slug);
        }

        //Xử lý ảnh
        if (categoryDTO.getThumbFile() != null) {
            try {
                category.setThumb(imageUtil.storeImage(categoryDTO.getThumbFile()));
                System.out.println(category.getThumb());
            } catch (IOException ex) {
                category.setThumb(null);
            }
        }
    }
}
