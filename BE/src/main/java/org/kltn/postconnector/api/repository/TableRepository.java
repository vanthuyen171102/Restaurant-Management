package org.kltn.postconnector.api.repository;

import org.kltn.postconnector.api.domain.TableEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface TableRepository extends JpaRepository<TableEntity, Integer> {


    @Query("SELECT DISTINCT t FROM TableEntity t " +
            "LEFT JOIN FETCH t.reservations tr " +
            "LEFT JOIN FETCH tr.booking b " +
            "WHERE t.isDeleted = false")
    List<TableEntity> findAllNotDeleted(@Param("date") LocalDate date, Sort sort);


    @Query("SELECT DISTINCT t FROM TableEntity t " +
            "LEFT JOIN FETCH t.reservations tr " +
            "LEFT JOIN FETCH tr.booking b " +
            "WHERE t.isDeleted = false")
    Page<TableEntity> findAllNotDeleted(@Param("date") LocalDate date, Pageable pageable);

    @Query("SELECT t FROM TableEntity t WHERE t.isDeleted = false")
    Page<TableEntity> findAllNotDeleted(PageRequest pageRequest);

    @Query("SELECT t FROM TableEntity t WHERE t.isDeleted = false AND t.currentOrder IS NOT NULL")
    List<TableEntity> findTablesHavingOrders();

    @Query("SELECT t FROM TableEntity t WHERE t.name = trim(:name) AND t.isDeleted = false")
    List<TableEntity> findAllTableByName(String name);

    @Query("SELECT t FROM TableEntity t LEFT JOIN FETCH t.currentOrder o WHERE t.id = :id AND t.isDeleted = false")
    Optional<TableEntity> findByIdNotDeleted(int id);
}
