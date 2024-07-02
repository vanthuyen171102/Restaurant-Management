package org.kltn.postconnector.api.repository;

import org.kltn.postconnector.api.domain.Item;
import org.kltn.postconnector.api.domain.MonthlyItemRevenue;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface MonthlyItemRevenueRepository extends JpaRepository<MonthlyItemRevenue, Integer> {

    @Query("SELECT r FROM MonthlyItemRevenue r WHERE r.item = :item AND r.month = :month AND r.year = :year")
    Optional<MonthlyItemRevenue> findItemRevenue(Item item, int month, int year);

    @Query("SELECT r FROM MonthlyItemRevenue r WHERE r.item.id = :itemId AND r.month = :month AND r.year = :year")
    Optional<MonthlyItemRevenue> findItemRevenue(int itemId, int month, int year);

    @Query("SELECT r FROM MonthlyItemRevenue r " +
            "WHERE r.item.id = :itemId " +
            "AND (r.year > :yearStart OR (r.year = :yearStart AND r.month >= :monthStart)) " +
            "AND (r.year < :yearEnd OR (r.year = :yearEnd AND r.month <= :monthEnd))")
    List<MonthlyItemRevenue> findItemRevenueByRange(int itemId, int monthStart, int yearStart, int monthEnd, int yearEnd);


    @Query("SELECT ir FROM MonthlyItemRevenue ir " +
            "WHERE ir.year = :year AND ir.month = :month " +
            "ORDER BY ir.revenue DESC")
    List<MonthlyItemRevenue> findTopItemRevenue(int month, int year, Pageable pageable);

    @Query("SELECT ir FROM MonthlyItemRevenue ir " +
            "WHERE ir.year = :year AND ir.month = :month " +
            "ORDER BY ir.profit DESC")
    List<MonthlyItemRevenue> findTopItemProfit(int month, int year, Pageable pageable);

    @Query("SELECT ir FROM MonthlyItemRevenue ir " +
            "WHERE ir.year = :year AND ir.month = :month " +
            "ORDER BY ir.quantitySold DESC")
    List<MonthlyItemRevenue> findTopItemSold(int month, int year, Pageable pageable);


    @Query("SELECT new MonthlyItemRevenue(ir.item, SUM(ir.revenue), SUM(ir.profit), SUM(ir.quantitySold)) " +
            "FROM MonthlyItemRevenue ir " +
            "WHERE (ir.year > :yearStart OR (ir.year = :yearStart AND ir.month >= :monthStart)) " +
            "AND (ir.year < :yearEnd OR (ir.year = :yearEnd AND ir.month <= :monthEnd)) " +
            "GROUP BY ir.item " +
            "ORDER BY SUM(ir.revenue) DESC")
    List<MonthlyItemRevenue> findTopItemRevenueByRange(int monthStart, int yearStart, int monthEnd, int yearEnd, Pageable pageable);

    @Query("SELECT new MonthlyItemRevenue(ir.item, SUM(ir.revenue), SUM(ir.profit), SUM(ir.quantitySold)) " +
            "FROM MonthlyItemRevenue ir " +
            "WHERE (ir.year > :yearStart OR (ir.year = :yearStart AND ir.month >= :monthStart)) " +
            "AND (ir.year < :yearEnd OR (ir.year = :yearEnd AND ir.month <= :monthEnd)) " +
            "GROUP BY ir.item " +
            "ORDER BY SUM(ir.profit) DESC")
    List<MonthlyItemRevenue> findTopItemProfitByRange(int monthStart, int yearStart, int monthEnd, int yearEnd, Pageable pageable);

    @Query("SELECT new MonthlyItemRevenue(ir.item, SUM(ir.revenue), SUM(ir.profit), SUM(ir.quantitySold)) " +
            "FROM MonthlyItemRevenue ir " +
            "WHERE (ir.year > :yearStart OR (ir.year = :yearStart AND ir.month >= :monthStart)) " +
            "AND (ir.year < :yearEnd OR (ir.year = :yearEnd AND ir.month <= :monthEnd)) " +
            "GROUP BY ir.item " +
            "ORDER BY SUM(ir.quantitySold) DESC")
    List<MonthlyItemRevenue> findTopItemSoldByRange(int monthStart, int yearStart, int monthEnd, int yearEnd, Pageable pageable);

    @Query("SELECT new MonthlyItemRevenue(ir.item, SUM(ir.revenue), SUM(ir.profit), SUM(ir.quantitySold)) " +
            "FROM MonthlyItemRevenue ir " +
            "GROUP BY ir.item " +
            "ORDER BY SUM(ir.revenue) DESC")
    List<MonthlyItemRevenue> findTopItemRevenue();

    @Query("SELECT new MonthlyItemRevenue(ir.item, SUM(ir.revenue), SUM(ir.profit), SUM(ir.quantitySold)) " +
            "FROM MonthlyItemRevenue ir " +
            "GROUP BY ir.item " +
            "ORDER BY SUM(ir.profit) DESC")
    List<MonthlyItemRevenue> findTopItemProfit();

    @Query("SELECT new MonthlyItemRevenue(ir.item, SUM(ir.revenue), SUM(ir.profit), SUM(ir.quantitySold)) " +
            "FROM MonthlyItemRevenue ir " +
            "GROUP BY ir.item " +
            "ORDER BY SUM(ir.quantitySold) DESC")
    List<MonthlyItemRevenue> findTopItemSold();

}
