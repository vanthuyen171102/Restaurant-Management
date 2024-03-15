package org.kltn.postconnector.api.repository;

import org.kltn.postconnector.api.model.Item;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ItemRepository extends JpaRepository<Item, Integer> {
    Optional<Item> findBySlug(String slug);
}
