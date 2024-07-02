package org.kltn.postconnector.api.controller;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.kltn.postconnector.api.domain.Order;
import org.kltn.postconnector.api.domain.TableEntity;
import org.kltn.postconnector.api.dto.SaveReservationsRequest;
import org.kltn.postconnector.api.dto.TableDTO;
import org.kltn.postconnector.api.payload.response.PagedResponse;
import org.kltn.postconnector.api.service.TableService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1")
public class TableController {
    private final TableService tableService;


    @GetMapping("/tables/all")
    @PreAuthorize("isAuthenticated()")
    public List<TableEntity> getAll(@RequestParam(required = false, defaultValue = "") String date) {
        LocalDate currentDate = LocalDate.now();
        if (!date.isEmpty()) {
            currentDate = LocalDate.parse(date);
        }
        return tableService.getAll(currentDate);
    }

    @GetMapping("/tables")
    @PreAuthorize("isAuthenticated()")
    public PagedResponse<TableEntity> getPagedTables(@RequestParam(required = false, defaultValue = "") String date,
                                            @RequestParam(name = "page", defaultValue = "1") @Min(1) int page,
                                            @RequestParam(name = "limit", defaultValue = "10") @Min(5) @Max(20) int limit) {
        LocalDate currentDate = LocalDate.now();
        if (!date.isEmpty()) {
            currentDate = LocalDate.parse(date);
        }

        Page<TableEntity> pagedTable = tableService.getPagedTable(currentDate,page, limit);
        return PagedResponse.<TableEntity>builder()
                .total(pagedTable.getTotalElements())
                .currentPage(pagedTable.getNumber() + 1)
                .totalPage(pagedTable.getTotalPages())
                .items(pagedTable.getContent())
                .build();
    }

    @GetMapping("/tables/tables-have-order")
    @PreAuthorize("isAuthenticated()")
    public List<TableEntity> getTablesHaveOrder() {
        return tableService.getTableHaveOrder();
    }


    @GetMapping("/table/{id}")
    @PreAuthorize("isAuthenticated()")
    public TableEntity getTable(@PathVariable(value = "id") int id) {
        return tableService.getById(id);
    }

    @PostMapping("/table/create")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    @ResponseStatus(HttpStatus.CREATED)
    public TableEntity createTable(@Valid @RequestBody TableDTO tableDTO) {
        return tableService.create(tableDTO);
    }


    @PutMapping("/table/update/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public TableEntity updateTable(@Valid @RequestBody TableDTO tableDTO, @PathVariable(value = "id") int id) {
        return tableService.update(tableDTO, id);
    }

    @DeleteMapping("/table/delete/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public void deleteTable(@PathVariable("id") int id) {
        tableService.delete(id);
    }

    @PostMapping("/table/return-table/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'WAITER', 'CASHIER')")
    public void returnTable(@PathVariable(value = "id") int id) {
        tableService.returnTable(id);
    }

    @PostMapping("/table/save-reservations/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'CASHIER')")
    public TableEntity saveReservations(@PathVariable int id,
                                        @RequestBody SaveReservationsRequest saveReservationsRequest) {
        return tableService.saveReservations(id, saveReservationsRequest);
    }
}
