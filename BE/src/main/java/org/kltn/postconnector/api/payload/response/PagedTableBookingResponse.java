package org.kltn.postconnector.api.payload.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.kltn.postconnector.api.model.TableBooking;

import java.util.ArrayList;
import java.util.List;

public class PagedTableBookingResponse extends PagedResponse {

    @JsonProperty(value = "bookings")
    private List<TableBooking> bookings = new ArrayList<>();

    public PagedTableBookingResponse(List<TableBooking> bookings, long total, int currentPage, int totalPage) {
        super(total, currentPage, totalPage);
        this.bookings = bookings;
    }
}
