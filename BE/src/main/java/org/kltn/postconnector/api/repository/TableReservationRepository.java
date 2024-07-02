package org.kltn.postconnector.api.repository;

import org.kltn.postconnector.api.domain.TableReservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;

public interface TableReservationRepository extends JpaRepository<TableReservation, Integer> {
    @Modifying
    @Query("DELETE TableReservation tr WHERE tr.booking.bookingDate = :bookingDate AND tr.table.id = :tableId")
    void deleteAllByBookingDateAndTableId(LocalDate bookingDate, int tableId);


    @Modifying
    @Query("DELETE TableReservation tr WHERE tr.booking.id = :bookingId")
    void deleteAllByBookingId(int bookingId);

}
