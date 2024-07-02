package org.kltn.postconnector.api.repository;

import org.kltn.postconnector.api.domain.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Integer> {
    @Query("SELECT o FROM Order o WHERE o.status = 'InProgress'")
    List<Order> findAllInProgressOrder();

    @Query("SELECT COUNT(o) FROM Order o WHERE CAST(o.createAt as date ) = :date")
    int countAllByCreateAt(@Param("date") LocalDate date);

}
