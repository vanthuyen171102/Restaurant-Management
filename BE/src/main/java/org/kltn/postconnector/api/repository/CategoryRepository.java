package org.kltn.postconnector.api.repository;

import org.kltn.postconnector.api.domain.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Integer> {

    List<Category> findAllByTitle(String title);
}
