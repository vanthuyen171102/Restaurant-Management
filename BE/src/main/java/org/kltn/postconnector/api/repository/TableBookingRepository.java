package org.kltn.postconnector.api.repository;

import org.kltn.postconnector.api.model.TableBooking;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.sql.Date;
import java.sql.Time;
import java.util.Optional;

public interface TableBookingRepository extends JpaRepository<TableBooking, Long> {

    Page<TableBooking> findAllByBookingDate(Date date, PageRequest pageRequest);

    Optional<TableBooking> findByBookingDateAndBookingTimeAndTableId(Date bookingDate, Time bookingTime, Byte table_id);
}
