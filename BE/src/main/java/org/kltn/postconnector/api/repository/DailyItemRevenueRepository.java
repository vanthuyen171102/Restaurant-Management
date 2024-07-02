package org.kltn.postconnector.api.repository;

import org.kltn.postconnector.api.domain.DailyItemRevenue;
import org.kltn.postconnector.api.domain.Item;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface DailyItemRevenueRepository extends JpaRepository<DailyItemRevenue, Integer> {
    Optional<DailyItemRevenue> findByDateAndItem(LocalDate date, Item item);

    @Query("SELECT ir " + "FROM DailyItemRevenue ir " +
            "WHERE ir.item.id = :itemId " +
            "AND ir.date = :date")
    DailyItemRevenue findByItemAndDate(int itemId, LocalDate date);

    @Query("SELECT ir " + "FROM DailyItemRevenue ir " +
            "WHERE ir.item.id = :itemId " +
            "AND ir.date BETWEEN :startDate AND :endDate")
    List<DailyItemRevenue> findByItemAndDateRange(int itemId, LocalDate startDate, LocalDate endDate);

    @Query("SELECT ir FROM DailyItemRevenue ir " +
            "WHERE ir.date = :date " +
            "ORDER BY ir.revenue DESC")
    List<DailyItemRevenue> findTopItemRevenue(LocalDate date, Pageable pageable);

    @Query("SELECT ir FROM DailyItemRevenue ir " +
            "WHERE ir.date = :date " +
            "ORDER BY ir.profit DESC")
    List<DailyItemRevenue> findTopItemProfit(LocalDate date, Pageable pageable);

    @Query("SELECT new DailyItemRevenue(ir.item, SUM(ir.revenue), SUM(ir.profit), SUM(ir.quantitySold)) " +
            "FROM DailyItemRevenue ir " +
            "WHERE ir.date BETWEEN :dateStart AND :dateEnd " +
            "GROUP BY ir.item " +
            "ORDER BY SUM(ir.revenue) DESC")
    List<DailyItemRevenue> findTopItemRevenue(@Param("dateStart") LocalDate dateStart, @Param("dateEnd") LocalDate dateEnd, Pageable pageable);

    @Query("SELECT new DailyItemRevenue(ir.item, SUM(ir.revenue), SUM(ir.profit), SUM(ir.quantitySold)) " +
            "FROM DailyItemRevenue ir " +
            "WHERE ir.date BETWEEN :dateStart AND :dateEnd " +
            "GROUP BY ir.item " +
            "ORDER BY SUM(ir.profit) DESC")
    List<DailyItemRevenue> findTopItemProfit(@Param("dateStart") LocalDate dateStart, @Param("dateEnd") LocalDate dateEnd, Pageable pageable);

    @Query("SELECT ir FROM DailyItemRevenue ir " +
            "WHERE ir.date = :date " +
            "ORDER BY ir.quantitySold DESC")
    List<DailyItemRevenue> findTopItemSold(LocalDate date, Pageable pageable);

    @Query("SELECT new DailyItemRevenue(ir.item, SUM(ir.revenue), SUM(ir.profit), SUM(ir.quantitySold)) " +
            "FROM DailyItemRevenue ir " +
            "WHERE ir.date BETWEEN :dateStart AND :dateEnd " +
            "GROUP BY ir.item " +
            "ORDER BY SUM(ir.quantitySold) DESC")
    List<DailyItemRevenue> findTopItemSold(@Param("dateStart") LocalDate dateStart, @Param("dateEnd") LocalDate dateEnd, Pageable pageable);

}
