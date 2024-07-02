package org.kltn.postconnector.api.service;

import org.kltn.postconnector.api.domain.*;
import org.kltn.postconnector.api.dto.YearRevenue;

import java.time.LocalDate;
import java.time.Year;
import java.time.YearMonth;
import java.util.List;

public interface RevenueService {

    List<DailyItemRevenue> getTopItemRevenue(LocalDate date, int limit);

    List<DailyItemRevenue> getTopItemProfit(LocalDate date, int limit);

    List<DailyItemRevenue> getTopItemSold(LocalDate date, int limit);

    List<DailyItemRevenue> getTopItemRevenueByRange(LocalDate dateStart, LocalDate dateEnd, int limit);

    List<DailyItemRevenue> getTopItemProfitByRange(LocalDate dateStart, LocalDate dateEnd, int limit);

    List<DailyItemRevenue> getTopItemSoldByRange(LocalDate dateStart, LocalDate dateEnd, int limit);

    List<MonthlyItemRevenue> getTopItemRevenueAllTime();

    List<MonthlyItemRevenue> getTopItemProfitAllTime();

    List<MonthlyItemRevenue> getTopItemSoldAllTime();

    List<MonthlyItemRevenue> getTopItemRevenue(YearMonth month, int limit);

    List<MonthlyItemRevenue> getTopItemProfit(YearMonth month, int limit);

    List<MonthlyItemRevenue> getTopItemSold(YearMonth month, int limit);

    List<MonthlyItemRevenue> getTopItemRevenueByRange(YearMonth monthStart, YearMonth monthEnd, int limit);

    List<MonthlyItemRevenue> getTopItemProfitByRange(YearMonth monthStart, YearMonth monthEnd, int limit);

    List<MonthlyItemRevenue> getTopItemSoldByRange(YearMonth monthStart, YearMonth monthEnd, int limit);


    List<YearRevenue> getAllRevenue();

    List<YearRevenue> getRevenueByYearRange(int yearStart, int yearEnd);
    List<DailyItemRevenue> getItemRevenueDateRange(int itemId, LocalDate dateStart, LocalDate dateEnd);

    DailyRevenue getRevenueByDate(LocalDate date);

    List<DailyRevenue> getRevenueByDateRange(LocalDate dateStart, LocalDate dateEnd);

    List<MonthlyRevenue> getRevenueByMonthRange(YearMonth monthStart, YearMonth monthEnd);

    DailyItemRevenue getItemRevenueByDate(int itemId, LocalDate date);

    List<MonthlyItemRevenue> getItemRevenueByMonthRange(int itemId, YearMonth yearMonthStart, YearMonth yearMonthStartEnd);

    MonthlyItemRevenue getItemRevenueByMonth(int itemId, YearMonth yearMonth);

    void addDailyRevenueForItem(LocalDate date, Item item, float newRevenue, int newSoldQuantity, float newProfit);

    void addDailyRevenue(LocalDate date, float newRevenue, float newProfit);

    void addMonthlyRevenueForItem(int month, int year, Item item, float newRevenue, int newSoldQuantity, float newProfit);

    void addMonthlyRevenue(int month, int year, float newRevenue, float newProfit);

}
