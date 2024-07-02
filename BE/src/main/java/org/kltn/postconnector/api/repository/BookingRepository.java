package org.kltn.postconnector.api.repository;

import org.kltn.postconnector.api.domain.Booking;
import org.kltn.postconnector.api.enums.BookingStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Integer> {

    Page<Booking> findAllByBookingDate(LocalDate date, PageRequest pageRequest);


    @Query("SELECT b FROM Booking b ORDER BY b.status, b.bookingDate DESC")
    Page<Booking> findAllSortedByStatusAndDate(Pageable pageable);

    @Query("SELECT b FROM Booking b " +
            "WHERE b.bookingDate = :date AND b.bookingTime = :time " +
            "AND b.status IN :bookingStatusList")
    List<Booking> findAvailableBookings(LocalTime time, LocalDate date, List<BookingStatus> bookingStatusList);

}
