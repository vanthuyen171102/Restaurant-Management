package org.kltn.postconnector.api.repository;

import org.kltn.postconnector.api.domain.Material;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface MaterialRepository extends JpaRepository<Material, Integer> {

    @Query("SELECT m FROM Material m WHERE m.isDeleted = false")
    List<Material> findAllNotDeleted();

    @Query("SELECT m FROM Material m WHERE m.id = :id AND m.isDeleted = false")
    Optional<Material> findByIdNotDeleted(int id);

}
