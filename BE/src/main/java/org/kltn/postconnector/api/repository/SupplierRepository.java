package org.kltn.postconnector.api.repository;

import org.kltn.postconnector.api.domain.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface SupplierRepository extends JpaRepository<Supplier, Integer> {
    @Query("SELECT s FROM Supplier s WHERE s.isDeleted = false")
    List<Supplier> findAllNotDeleted();

    @Query("SELECT s FROM Supplier s WHERE s.id = :id AND s.isDeleted = false")
    Optional<Supplier> findByIdNotDeleted(int id);
}
