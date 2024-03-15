package org.kltn.postconnector.api.controller;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import org.kltn.postconnector.api.dto.TableBookingDTO;
import org.kltn.postconnector.api.model.Order;
import org.kltn.postconnector.api.payload.response.PagedTableBookingResponse;
import org.kltn.postconnector.api.payload.response.ResponseObject;
import org.kltn.postconnector.api.service.TableBookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;

@RestController
@RequestMapping("/api/table-booking")
public class TableBookingController {

    private final TableBookingService tableBookingService;

    @Autowired
    public TableBookingController(TableBookingService tableBookingService) {
        this.tableBookingService = tableBookingService;
    }

    @GetMapping("")
    public ResponseEntity<ResponseObject<?>> getPagedBooking(@RequestParam(name = "page", defaultValue = "1") @Min(1) int page,
                                                             @RequestParam(value = "bookingDate") Date bookingDate) {
        return ResponseEntity.ok(ResponseObject.<PagedTableBookingResponse>builder()
                .code(HttpStatus.OK.value())
                .data(tableBookingService.getAllByBookingDate(page, bookingDate))
                .build());
    }


    @PostMapping()
    public ResponseEntity<ResponseObject<?>> createBooking(@Valid @RequestBody TableBookingDTO tableBookingDTO) {
        return ResponseEntity.ok(ResponseObject.<Order>builder()
                .code(HttpStatus.OK.value())
                .message("Xóa đơn đặt bàn thành công!")
                .build());    }
}
