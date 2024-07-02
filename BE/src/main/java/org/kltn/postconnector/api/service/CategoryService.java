package org.kltn.postconnector.api.service;

import org.kltn.postconnector.api.domain.Category;
import org.kltn.postconnector.api.dto.CategoryDTO;

import java.util.List;

public interface CategoryService {


    List<Category> getAll();

    Category getById(int categoryId);

    Category create(CategoryDTO categoryDTO);

    Category update(CategoryDTO categoryDTO, int categoryId);

    void delete(int categoryId);
}
