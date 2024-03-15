package org.kltn.postconnector.api.service;

import org.kltn.postconnector.api.dto.TableBookingDTO;
import org.kltn.postconnector.api.model.TableBooking;
import org.kltn.postconnector.api.payload.response.PagedTableBookingResponse;

import java.sql.Date;

public interface TableBookingService {

    PagedTableBookingResponse getAllByBookingDate(int page, Date bookingDate);

    TableBooking create(TableBookingDTO tableBookingDTO);

    TableBooking update(TableBookingDTO tableBookingDTO, long tableBookingId);

    void delete(long tableBookingId);
}
