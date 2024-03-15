package org.kltn.postconnector.api.repository;

import org.kltn.postconnector.api.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Integer> {
    Optional<Category> findBySlug(String slug);
}
