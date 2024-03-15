package org.kltn.postconnector.api.service;

import org.kltn.postconnector.api.dto.CategoryDTO;
import org.kltn.postconnector.api.model.Category;

import java.util.List;

public interface CategoryService {

    boolean isSlugExist(String slug);

    List<Category> getAll() ;

    Category getById(int categoryId);

    Category getBySlug(String slug);

    Category create(CategoryDTO categoryDTO);

    Category update(CategoryDTO categoryDTO, int categoryId);

    void delete(int categoryId);
}
