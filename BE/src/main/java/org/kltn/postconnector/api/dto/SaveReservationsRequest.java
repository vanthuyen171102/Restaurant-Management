package org.kltn.postconnector.api.dto;

import java.time.LocalDate;
import java.util.Objects;
import java.util.Set;

import lombok.*;

import java.time.LocalTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class SaveReservationsRequest {
    public LocalDate date;
    public Set<TableReservationDTO> reservations;

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @ToString
    public static class TableReservationDTO {
        public LocalTime time;
        public int bookingId;

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            TableReservationDTO that = (TableReservationDTO) o;
            return bookingId == that.bookingId ||
                    Objects.equals(time, that.time);
        }

        @Override
        public int hashCode() {
            return 1;
        }

    }
}
