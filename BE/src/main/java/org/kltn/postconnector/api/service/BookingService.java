package org.kltn.postconnector.api.service;

import org.kltn.postconnector.api.domain.Booking;
import org.kltn.postconnector.api.dto.BookingCancelDTO;
import org.kltn.postconnector.api.dto.BookingDTO;
import org.springframework.data.domain.Page;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface BookingService {

    Booking getById(int id);

    List<Booking> getAvailableBookings(LocalTime time, LocalDate date);

    Page<Booking> getPagedTableBooking(int page);

    Booking create(BookingDTO bookingDTO);

    Booking update(BookingDTO bookingDTO, int bookingId);

    Booking cancel(BookingCancelDTO bookingCancelDTO, int bookingId);

    Booking checkIn(int bookingId);

    Booking confirm(int bookingId);
}
