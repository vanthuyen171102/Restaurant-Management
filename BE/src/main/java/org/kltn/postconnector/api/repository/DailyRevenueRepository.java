package org.kltn.postconnector.api.repository;

import org.kltn.postconnector.api.domain.DailyRevenue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface DailyRevenueRepository extends JpaRepository<DailyRevenue, Integer> {
    Optional<DailyRevenue> findByDate(LocalDate date);

    @Query("SELECT r FROM DailyRevenue r "
            + "WHERE r.date BETWEEN :dateStart AND :dateEnd")
    List<DailyRevenue> findByDateRange(LocalDate dateStart, LocalDate dateEnd);
}
