package org.kltn.postconnector.api.controller;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.PastOrPresent;
import lombok.RequiredArgsConstructor;
import org.kltn.postconnector.api.constants.Constants;
import org.kltn.postconnector.api.domain.DailyItemRevenue;
import org.kltn.postconnector.api.domain.DailyRevenue;
import org.kltn.postconnector.api.domain.MonthlyItemRevenue;
import org.kltn.postconnector.api.domain.MonthlyRevenue;
import org.kltn.postconnector.api.dto.YearRevenue;
import org.kltn.postconnector.api.enums.SearchType;
import org.kltn.postconnector.api.service.RevenueService;
import org.springframework.cglib.core.Local;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Year;
import java.time.YearMonth;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/v1/revenue")
@RequiredArgsConstructor
public class RevenueController {

    private final RevenueService revenueService;

    @GetMapping("/item/revenue-by-date/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'CASHIER')")
    public DailyItemRevenue getItemRevenueByDate(
            @PathVariable(name = "id") int itemId,
            @RequestParam("date") @PastOrPresent @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {

        return revenueService.getItemRevenueByDate(itemId, date);
    }

    @GetMapping("/item/revenue-by-date-range/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'CASHIER')")
    public List<DailyItemRevenue> getItemRevenueByDateRange(
            @PathVariable(name = "id") int itemId,
            @RequestParam("dateStart") @PastOrPresent @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateStart,
            @RequestParam("dateEnd") @PastOrPresent @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateEnd
    ) {

        return revenueService.getItemRevenueDateRange(itemId, dateStart, dateEnd);
    }

    @GetMapping("/item/revenue-by-month-year/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'CASHIER')")
    public MonthlyItemRevenue getItemRevenueByMonth(
            @PathVariable(name = "id") int itemId,
            @RequestParam("yearMonth") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) YearMonth yearMonth
    ) {

        return revenueService.getItemRevenueByMonth(itemId, yearMonth);
    }

    @GetMapping("/item/revenue-by-month-year-range/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'CASHIER')")
    public List<MonthlyItemRevenue> getItemRevenueByMonthRange(
            @PathVariable(name = "id") int itemId,
            @RequestParam("yearMonthStart") @PastOrPresent @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) YearMonth yearMonthStart,
            @RequestParam("yearMonthEnd") @PastOrPresent @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) YearMonth yearMonthEnd
    ) {
        return revenueService.getItemRevenueByMonthRange(itemId, yearMonthStart, yearMonthEnd);
    }

//    @GetMapping("/revenue-by-year/{id}")
//    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
//    public DailyItemRevenue getItemRevenueByYear(
//            @PathVariable(name = "id") int itemId,
//            @RequestParam("year") @PastOrPresent @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Year year
//    ) {
//
//        return revenueService.getRevenueByItemAndDate(itemId,year);
//    }
//
//    @GetMapping("/revenue-by-year-range/{id}")
//    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
//    public DailyItemRevenue getItemRevenueByYearRange(
//            @PathVariable(name = "id") int itemId,
//            @RequestParam("yearStart") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) int yearStart,
//            @RequestParam("yearEnd") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) int yearEnd
//    ) {
//
//        return revenueService.getRevenueByItemAndDate(itemId,yearStart, yearEnd);
//    }

    @GetMapping("/revenue-by-date")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'CASHIER')")
    public DailyRevenue getRevenueByDate(
            @RequestParam("date") @PastOrPresent @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {

        return revenueService.getRevenueByDate(date);
    }

    @GetMapping("/revenue-by-date-range")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'CASHIER')")
    public List<DailyRevenue> getRevenueByDateRange(
            @RequestParam("dateStart") @PastOrPresent @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateStart,
            @RequestParam("dateEnd") @PastOrPresent @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateEnd

    ) {
        return revenueService.getRevenueByDateRange(dateStart, dateEnd);
    }

    @GetMapping("/revenue-by-month-range")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'CASHIER')")
    public List<MonthlyRevenue> getRevenueByMonthRange(
            @RequestParam("monthStart") @PastOrPresent @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) YearMonth monthStart,
            @RequestParam("monthEnd") @PastOrPresent @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) YearMonth monthEnd

    ) {

        return revenueService.getRevenueByMonthRange(monthStart, monthEnd);
    }

    @GetMapping("/revenue-by-year-range")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'CASHIER')")
    public List<YearRevenue> getRevenueByYearRange(
            @RequestParam("yearStart")  int yearStart,
            @RequestParam("yearEnd") int yearEnd

    ) {
        int currentYear = LocalDate.now().getYear();

        if (yearEnd> currentYear || yearStart > currentYear || yearStart < Constants.YEAR_START || yearEnd < yearStart) {
            throw new IllegalArgumentException("year cannot be greater than the current year");
        }
        return revenueService.getRevenueByYearRange(yearStart, yearEnd);
    }

    @GetMapping("/all")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'CASHIER')")
    public List<YearRevenue> getAllRevenue(
    ) {

        return revenueService.getAllRevenue();
    }

    @GetMapping("/get-top-item-by-date")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'CASHIER')")
    public List<DailyItemRevenue> getTopItemByDate(
            @RequestParam("date") @PastOrPresent @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam("sortBy") SearchType.RevenueSortBy sortBy,
            @RequestParam(name = "limit", defaultValue = "10") int limit
    ) {
        return switch (sortBy) {
            case REVENUE -> revenueService.getTopItemRevenue(date, limit);
            case PROFIT -> revenueService.getTopItemProfit(date, limit);
            case SOLD -> revenueService.getTopItemSold(date, limit);
            default -> throw new IllegalArgumentException("Invalid sort type");
        };
    }

    @GetMapping("/get-top-item-by-date-range")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'CASHIER')")
    public List<DailyItemRevenue> getTopItemByDateRange(
            @RequestParam("dateStart") @PastOrPresent @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateStart,
            @RequestParam("dateEnd") @PastOrPresent @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateEnd,
            @RequestParam("sortBy") SearchType.RevenueSortBy sortBy,
            @RequestParam(name = "limit", defaultValue = "10") int limit
    ) {
        return switch (sortBy) {
            case REVENUE -> revenueService.getTopItemRevenueByRange(dateStart, dateEnd, limit);
            case PROFIT -> revenueService.getTopItemProfitByRange(dateStart, dateEnd, limit);
            case SOLD -> revenueService.getTopItemSoldByRange(dateStart, dateEnd, limit);
            default -> throw new IllegalArgumentException("Invalid sort type");
        };
    }

    @GetMapping("/get-top-item-by-month")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    public List<MonthlyItemRevenue> getTopItemByMonth(
            @RequestParam("month") @PastOrPresent @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) YearMonth month,
            @RequestParam("sortBy") SearchType.RevenueSortBy sortBy,
            @RequestParam(name = "limit", defaultValue = "10") int limit
    ) {
        return switch (sortBy) {
            case REVENUE -> revenueService.getTopItemRevenue(month, limit);
            case PROFIT -> revenueService.getTopItemProfit(month, limit);
            case SOLD -> revenueService.getTopItemSold(month, limit);
            default -> throw new IllegalArgumentException("Invalid sort type");
        };
    }

    @GetMapping("/get-top-item-by-month-range")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'CASHIER')")
    public List<MonthlyItemRevenue> getTopItemByMonthRange(
            @RequestParam("monthStart") @PastOrPresent @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) YearMonth monthStart,
            @RequestParam("monthEnd") @PastOrPresent @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) YearMonth monthEnd,
            @RequestParam("sortBy") SearchType.RevenueSortBy sortBy,
            @RequestParam(name = "limit", defaultValue = "10") int limit
    ) {
        return switch (sortBy) {
            case REVENUE -> revenueService.getTopItemRevenueByRange(monthStart, monthEnd, limit);
            case PROFIT -> revenueService.getTopItemProfitByRange(monthStart, monthEnd, limit);
            case SOLD -> revenueService.getTopItemSoldByRange(monthStart, monthEnd, limit);
            default -> throw new IllegalArgumentException("Invalid sort type");
        };
    }

    @GetMapping("/get-top-item-all-time")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'CASHIER')")
    public List<MonthlyItemRevenue> getTopItemAllTime(
            @RequestParam(value = "sortBy") SearchType.RevenueSortBy sortBy
    ) {
        return switch (sortBy) {
            case REVENUE -> revenueService.getTopItemRevenueAllTime();
            case PROFIT -> revenueService.getTopItemProfitAllTime();
            case SOLD -> revenueService.getTopItemSoldAllTime();
        };
    }


}
