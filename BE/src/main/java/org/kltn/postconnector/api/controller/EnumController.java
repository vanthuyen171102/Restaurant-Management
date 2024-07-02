package org.kltn.postconnector.api.controller;

import lombok.RequiredArgsConstructor;
import org.kltn.postconnector.api.constants.Constants;
import org.kltn.postconnector.api.domain.Area;
import org.kltn.postconnector.api.domain.DailyRevenue;
import org.kltn.postconnector.api.domain.Role;
import org.kltn.postconnector.api.dto.MaterialOption;
import org.kltn.postconnector.api.dto.SupplierOption;
import org.kltn.postconnector.api.repository.DailyRevenueRepository;
import org.kltn.postconnector.api.repository.OrderRepository;
import org.kltn.postconnector.api.repository.RoleRepository;
import org.kltn.postconnector.api.service.MaterialService;
import org.kltn.postconnector.api.service.SupplierService;
import org.springframework.cglib.core.Local;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class EnumController {
    private final MaterialService materialService;
    private final SupplierService supplierService;
    private final RoleRepository roleRepository;
    private final DailyRevenueRepository dailyRevenueRepository;
    private final OrderRepository orderRepository;

    @GetMapping("/api/v1/enums/role")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public List<Role> getRolesEnum() {
        return roleRepository.findAll();
    }

    @GetMapping("/api/v1/enums/material-options")
    public List<MaterialOption> getMaterialOptions() {
        return materialService.getMaterialOptions();
    }

    @GetMapping("/api/v1/enums/supplier-options")
    public List<SupplierOption> getSupplierOptions() {
        return supplierService.getSupplierOptions();
    }

    @GetMapping("/api/v1/restaurant-info")
    public Map<String, Object> getRestaurantInfo() {
        Map<String, Object> restaurantInfo = new LinkedHashMap<>();
        LocalDate today = LocalDate.now();
        DailyRevenue revenueToday = dailyRevenueRepository.findByDate(today)
                .orElse(DailyRevenue.builder().revenue(0).profit(0).build());
        restaurantInfo.put("startYear", Constants.YEAR_START);
        restaurantInfo.put("revenueToday", revenueToday.getRevenue());
        restaurantInfo.put("profitToday", revenueToday.getProfit());
        restaurantInfo.put("ordersToday", orderRepository.countAllByCreateAt(today));
        return restaurantInfo;
    }
}

