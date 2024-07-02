package org.kltn.postconnector.api.service.impl;

import lombok.RequiredArgsConstructor;
import org.kltn.postconnector.api.constants.Constants;
import org.kltn.postconnector.api.domain.*;
import org.kltn.postconnector.api.dto.YearRevenue;
import org.kltn.postconnector.api.repository.DailyItemRevenueRepository;
import org.kltn.postconnector.api.repository.DailyRevenueRepository;
import org.kltn.postconnector.api.repository.MonthlyItemRevenueRepository;
import org.kltn.postconnector.api.repository.MonthlyRevenueRepository;
import org.kltn.postconnector.api.service.RevenueService;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.Year;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class RevenueServiceImpl implements RevenueService {

    private final DailyItemRevenueRepository dailyItemRevenueRepository;
    private final DailyRevenueRepository dailyRevenueRepository;
    private final MonthlyItemRevenueRepository monthlyItemRevenueRepository;
    private final MonthlyRevenueRepository monthlyRevenueRepository;

    @Override
    public List<DailyItemRevenue> getTopItemRevenue(LocalDate date, int limit) {
        return dailyItemRevenueRepository.findTopItemRevenue(date, PageRequest.of(0, limit));
    }

    @Override
    public List<DailyItemRevenue> getTopItemProfit(LocalDate date, int limit) {
        return dailyItemRevenueRepository.findTopItemProfit(date, PageRequest.of(0, limit));
    }

    @Override
    public List<DailyItemRevenue> getTopItemSold(LocalDate date, int limit) {
        return dailyItemRevenueRepository.findTopItemSold(date, PageRequest.of(0, limit));
    }

    @Override
    public List<DailyItemRevenue> getTopItemRevenueByRange(LocalDate dateStart, LocalDate dateEnd, int limit) {
        return dailyItemRevenueRepository.findTopItemRevenue(dateStart, dateEnd, PageRequest.of(0, limit));
    }

    @Override
    public List<DailyItemRevenue> getTopItemProfitByRange(LocalDate dateStart, LocalDate dateEnd, int limit) {
        return dailyItemRevenueRepository.findTopItemProfit(dateStart, dateEnd, PageRequest.of(0, limit));
    }

    @Override
    public List<DailyItemRevenue> getTopItemSoldByRange(LocalDate dateStart, LocalDate dateEnd, int limit) {
        return dailyItemRevenueRepository.findTopItemSold(dateStart, dateEnd, PageRequest.of(0, limit));
    }

    @Override
    public List<MonthlyItemRevenue> getTopItemRevenue(YearMonth month, int limit) {
        return monthlyItemRevenueRepository.findTopItemRevenue(month.getMonthValue(), month.getYear(), PageRequest.of(0, limit));
    }

    @Override
    public List<MonthlyItemRevenue> getTopItemProfit(YearMonth month, int limit) {
        return monthlyItemRevenueRepository.findTopItemProfit(month.getMonthValue(), month.getYear(), PageRequest.of(0, limit));
    }

    @Override
    public List<MonthlyItemRevenue> getTopItemSold(YearMonth month, int limit) {
        return monthlyItemRevenueRepository.findTopItemSold(month.getMonthValue(), month.getYear(), PageRequest.of(0, limit));
    }

    @Override
    public List<MonthlyItemRevenue> getTopItemRevenueByRange(YearMonth monthStart, YearMonth monthEnd, int limit) {
        return monthlyItemRevenueRepository.findTopItemRevenueByRange(monthStart.getMonthValue(), monthStart.getYear(), monthEnd.getMonthValue(), monthEnd.getYear(), PageRequest.of(0, limit));
    }

    @Override
    public List<MonthlyItemRevenue> getTopItemProfitByRange(YearMonth monthStart, YearMonth monthEnd, int limit) {
        return monthlyItemRevenueRepository.findTopItemProfitByRange(monthStart.getMonthValue(), monthStart.getYear(), monthEnd.getMonthValue(), monthEnd.getYear(), PageRequest.of(0, limit));
    }

    @Override
    public List<MonthlyItemRevenue> getTopItemSoldByRange(YearMonth monthStart, YearMonth monthEnd, int limit) {
        return monthlyItemRevenueRepository.findTopItemSoldByRange(monthStart.getMonthValue(), monthStart.getYear(), monthEnd.getMonthValue(), monthEnd.getYear(), PageRequest.of(0, limit));
    }

    @Override
    public List<MonthlyItemRevenue> getTopItemRevenueAllTime() {
        return monthlyItemRevenueRepository.findTopItemRevenue();
    }

    @Override
    public List<MonthlyItemRevenue> getTopItemProfitAllTime() {
        return monthlyItemRevenueRepository.findTopItemProfit();
    }

    @Override
    public List<MonthlyItemRevenue> getTopItemSoldAllTime() {
        return monthlyItemRevenueRepository.findTopItemSold();
    }

    @Override
    public List<YearRevenue> getAllRevenue() {
        List<YearRevenue> revenues = new ArrayList<>();
        LocalDate now = LocalDate.now();
        int currentYear = now.getYear();

        // Lấy danh sách doanh thu hàng tháng từ cơ sở dữ liệu
        List<MonthlyRevenue> actualRevenues = monthlyRevenueRepository.findByMonthRange(1, Constants.YEAR_START,
                12, now.getYear());

        Map<Integer, Float> yearTotalRevenueMap = new HashMap<>();
        Map<Integer, Float> yearProfitRevenueMap = new HashMap<>();
        for (MonthlyRevenue actualRevenue : actualRevenues) {
            yearTotalRevenueMap.merge(actualRevenue.getYear(), actualRevenue.getRevenue(), Float::sum);
            yearProfitRevenueMap.merge(actualRevenue.getYear(), actualRevenue.getProfit(), Float::sum);
        }

        // Tạo danh sách YearRevenue từ map đã tính được
        for (int year = Constants.YEAR_START; year <= currentYear; year++) {
            revenues.add(YearRevenue.builder()
                    .year(year)
                    .revenue(yearTotalRevenueMap.getOrDefault(year, 0f))
                    .profit(yearProfitRevenueMap.getOrDefault(year, 0f))
                    .build());
        }

        return revenues;
    }

    @Override
    public List<YearRevenue> getRevenueByYearRange(int yearStart, int yearEnd) {
        List<YearRevenue> revenues = new ArrayList<>();
        LocalDate now = LocalDate.now();
        int currentYear = now.getYear();

        // Lấy danh sách doanh thu hàng tháng từ cơ sở dữ liệu
        List<MonthlyRevenue> actualRevenues = monthlyRevenueRepository.findByMonthRange(1, yearStart,
                12, now.getYear());

        Map<Integer, Float> yearTotalRevenueMap = new HashMap<>();
        Map<Integer, Float> yearProfitRevenueMap = new HashMap<>();
        for (MonthlyRevenue actualRevenue : actualRevenues) {
            yearTotalRevenueMap.merge(actualRevenue.getYear(), actualRevenue.getRevenue(), Float::sum);
            yearProfitRevenueMap.merge(actualRevenue.getYear(), actualRevenue.getProfit(), Float::sum);
        }

        // Tạo danh sách YearRevenue từ map đã tính được
        for (int year = Constants.YEAR_START; year <= currentYear; year++) {
            revenues.add(YearRevenue.builder()
                    .year(year)
                    .revenue(yearTotalRevenueMap.getOrDefault(year, 0f))
                    .profit(yearProfitRevenueMap.getOrDefault(year, 0f))
                    .build());
        }

        return revenues;
    }

    @Override
    public List<DailyItemRevenue> getItemRevenueDateRange(int itemId, LocalDate startDate, LocalDate endDate) {
        return dailyItemRevenueRepository.findByItemAndDateRange(itemId, startDate, endDate);
    }

    @Override
    public DailyItemRevenue getItemRevenueByDate(int itemId, LocalDate date) {
        return dailyItemRevenueRepository.findByItemAndDate(itemId, date);
    }

    @Override
    public List<MonthlyItemRevenue> getItemRevenueByMonthRange(int itemId, YearMonth yearMonthStart, YearMonth yearMonthEnd) {
        return monthlyItemRevenueRepository.findItemRevenueByRange(itemId, yearMonthStart.getMonthValue(), yearMonthStart.getYear(),
                yearMonthEnd.getMonthValue(), yearMonthEnd.getYear());
    }

    @Override
    public List<MonthlyRevenue> getRevenueByMonthRange(YearMonth monthStart, YearMonth monthEnd) {
        List<MonthlyRevenue> monthlyRevenues = new ArrayList<>();
        YearMonth currentMonth = monthStart;

        while (!currentMonth.isAfter(monthEnd)) {
            monthlyRevenues.add(MonthlyRevenue.builder()
                    .month(currentMonth.getMonthValue())
                    .year(currentMonth.getYear())
                    .revenue(0).build());
            currentMonth = currentMonth.plusMonths(1);
        }

        List<MonthlyRevenue> actualRevenues = monthlyRevenueRepository.findByMonthRange(monthStart.getMonthValue(), monthStart.getYear(),
                monthEnd.getMonthValue(), monthEnd.getYear());

        for (MonthlyRevenue actualRevenue : actualRevenues) {
            for (int i = 0; i < monthlyRevenues.size(); i++) {
                if (monthlyRevenues.get(i).getMonth() == actualRevenue.getMonth()
                        && monthlyRevenues.get(i).getYear() == actualRevenue.getYear()) {
                    monthlyRevenues.set(i, actualRevenue);
                    break;
                }
            }
        }


        return monthlyRevenues;
    }

    @Override
    public MonthlyItemRevenue getItemRevenueByMonth(int itemId, YearMonth yearMonth) {
        return monthlyItemRevenueRepository.findItemRevenue(itemId, yearMonth.getMonthValue(), yearMonth.getYear())
                .orElse(null);
    }

    @Override
    public DailyRevenue getRevenueByDate(LocalDate date) {
        return dailyRevenueRepository.findByDate(date).orElse(DailyRevenue.builder()
                .date(date)
                .revenue(0)
                .build());
    }

    @Override
    public List<DailyRevenue> getRevenueByDateRange(LocalDate dateStart, LocalDate dateEnd) {
        List<DailyRevenue> dailyRevenues = new ArrayList<>();
        LocalDate currentDate = dateStart;

        while (!currentDate.isAfter(dateEnd)) {
            dailyRevenues.add(DailyRevenue.builder().date(currentDate).revenue(0).build()); // Giả sử doanh thu mặc định là 0.0
            currentDate = currentDate.plusDays(1);
        }

        List<DailyRevenue> actualRevenues = dailyRevenueRepository.findByDateRange(dateStart, dateEnd);

        // Bước 3: Ghi đè các bản ghi giả bằng dữ liệu thực dựa trên ngày tháng
        for (DailyRevenue actualRevenue : actualRevenues) {
            for (int i = 0; i < dailyRevenues.size(); i++) {
                if (dailyRevenues.get(i).getDate().isEqual(actualRevenue.getDate())) {
                    dailyRevenues.set(i, actualRevenue);
                    break;
                }
            }
        }


        return dailyRevenues;
    }

    @Override
    @Transactional
    public void addDailyRevenueForItem(LocalDate date, Item item, float newRevenue, int newSoldQuantity, float newProfit) {
        DailyItemRevenue itemRevenueInDay = dailyItemRevenueRepository.findByDateAndItem(date, item)
                .orElse(DailyItemRevenue.builder()
                        .date(date)
                        .item(item)
                        .build());
        itemRevenueInDay.setRevenue(itemRevenueInDay.getRevenue() + newRevenue);
        itemRevenueInDay.setProfit(itemRevenueInDay.getProfit() + newProfit);

        itemRevenueInDay.setQuantitySold(itemRevenueInDay.getQuantitySold() + newSoldQuantity);
        dailyItemRevenueRepository.save(itemRevenueInDay);
        addDailyRevenue(date, newRevenue, newProfit);
        addMonthlyRevenueForItem(date.getMonthValue(), date.getYear(), item, newRevenue, newSoldQuantity, newProfit);
        addMonthlyRevenue(date.getMonthValue(), date.getYear(), newRevenue, newProfit);
    }

    @Override
    public void addDailyRevenue(LocalDate date, float newRevenue, float newProfit) {
        DailyRevenue revenueInDay = dailyRevenueRepository.findByDate(date)
                .orElse(DailyRevenue.builder()
                        .date(date)
                        .build());

        revenueInDay.setRevenue(revenueInDay.getRevenue() + newRevenue);
        revenueInDay.setProfit(revenueInDay.getProfit() + newProfit);

        dailyRevenueRepository.save(revenueInDay);
    }

    @Override
    public void addMonthlyRevenueForItem(int month, int year, Item item, float newRevenue, int newSoldQuantity, float newProfit) {
        MonthlyItemRevenue itemRevenueInMonth = monthlyItemRevenueRepository.findItemRevenue(item, month, year)
                .orElse(MonthlyItemRevenue.builder()
                        .month(month)
                        .year(year)
                        .item(item)
                        .build());

        itemRevenueInMonth.setRevenue(itemRevenueInMonth.getRevenue() + newRevenue);
        itemRevenueInMonth.setProfit(itemRevenueInMonth.getProfit() + newProfit);
        itemRevenueInMonth.setQuantitySold(itemRevenueInMonth.getQuantitySold() + newSoldQuantity);

        monthlyItemRevenueRepository.save(itemRevenueInMonth);
    }

    @Override
    public void addMonthlyRevenue(int month, int year, float newRevenue, float newProfit) {
        MonthlyRevenue revenueInMonth = monthlyRevenueRepository.findByMonthAndYear(month, year)
                .orElse(MonthlyRevenue.builder()
                        .month(month)
                        .year(year)
                        .build());
        revenueInMonth.setRevenue(revenueInMonth.getRevenue() + newRevenue);
        revenueInMonth.setProfit(revenueInMonth.getProfit() + newProfit);

        monthlyRevenueRepository.save(revenueInMonth);
    }
}
