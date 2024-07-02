package org.kltn.postconnector.api.repository;

import org.kltn.postconnector.api.domain.MonthlyRevenue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface MonthlyRevenueRepository extends JpaRepository<MonthlyRevenue, Integer> {
    Optional<MonthlyRevenue> findByMonthAndYear(int month, int year);

    @Query("SELECT r FROM MonthlyRevenue r " +
            "WHERE (r.year = :yearStart AND r.month >= :monthStart) " +
            "OR (r.year = :yearEnd AND r.month <= :monthEnd) " +
            "OR (r.year > :yearStart AND r.year < :yearEnd)")
    List<MonthlyRevenue> findByMonthRange(int monthStart, int yearStart, int monthEnd, int yearEnd);
}
