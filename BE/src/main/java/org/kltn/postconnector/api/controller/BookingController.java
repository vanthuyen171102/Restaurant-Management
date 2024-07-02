package org.kltn.postconnector.api.controller;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.kltn.postconnector.api.constants.Constants;
import org.kltn.postconnector.api.domain.Booking;
import org.kltn.postconnector.api.dto.BookingCancelDTO;
import org.kltn.postconnector.api.dto.BookingDTO;
import org.kltn.postconnector.api.enums.BookingStatus;
import org.kltn.postconnector.api.payload.response.PagedResponse;
import org.kltn.postconnector.api.service.BookingService;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @GetMapping("/bookings")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'CASHIER')")
    public PagedResponse<Booking> getPagedBooking(@RequestParam(defaultValue = "1") @Min(1) int page,
                                                  @RequestParam(required = false) Date bookingDate,
                                                  @RequestParam(required = false) String keyword,
                                                  @RequestParam(required = false) BookingStatus status
                                                  ) {
        Page<Booking> pagedBooking = bookingService.getPagedTableBooking(page);
        return PagedResponse.<Booking>builder()
                .items(pagedBooking.getContent())
                .currentPage(page)
                .total(pagedBooking.getTotalElements())
                .totalPage(pagedBooking.getTotalPages()).build();
    }

    @GetMapping("/booking/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'CASHIER')")
    public Booking getBooking(@PathVariable(name = "id") int id) {
        return bookingService.getById(id);
    }

    @GetMapping("/available-bookings")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'CASHIER')")
    public List<Booking> getBookingToReservation(@RequestParam LocalTime time,
                                    @RequestParam LocalDate date) {
        return bookingService.getAvailableBookings(time, date);
    }

    @PostMapping("/booking/create")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'CASHIER')")
    public Booking createBooking(@Valid @ModelAttribute BookingDTO bookingDTO) {
        return bookingService.create(bookingDTO);
    }

    @PutMapping("/booking/update/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'CASHIER')")
    public Booking updateBooking(@Valid @ModelAttribute BookingDTO bookingDTO,
                                 @PathVariable(name = "id") int id) {
        return bookingService.update(bookingDTO, id);
    }

    @PostMapping("/booking/cancel/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'CASHIER')")
    public Booking cancelBooking(@Valid @RequestBody BookingCancelDTO bookingCancelDTO, @PathVariable(name = "id") int id) {
        return bookingService.cancel(bookingCancelDTO, id);
    }

    @PostMapping("/booking/check-in/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'CASHIER')")
    public Booking checkInBooking(@PathVariable(name = "id") int id) {
        return bookingService.checkIn(id);
    }

    @PostMapping("/booking/confirm/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'CASHIER')")
    public Booking confirmBooking(@PathVariable(name = "id") int id) {
        return bookingService.confirm(id);
    }

    @GetMapping("/booking/booking-hours")
    public List<LocalTime> getBookingHours() {
        return Constants.BOOKING_HOURS;
    }

    @GetMapping("/booking/booking-range")
    public Map<String, ?> getBookingRange() {
        Map<String, String> bookingRange = new HashMap<>();
        bookingRange.put("start", Constants.BOOKING_START.toString());
        bookingRange.put("end", Constants.BOOKING_END.toString());
        bookingRange.put("step", Constants.BOOKING_STEP.toString());
        bookingRange.put("minutesBeforeArrival", Constants.MINUTES_BEFORE_ARRIVAL.toString());
        return bookingRange;
    }
}
