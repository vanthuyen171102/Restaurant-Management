package org.kltn.postconnector.api.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonIncludeProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import org.kltn.postconnector.api.enums.BookingStatus;
import org.springframework.cglib.core.Local;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;

@Data
@Entity
@Table(name = "`Booking`")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "booking_date")
    private LocalDate bookingDate;

    @Column(name = "booking_time")
    private LocalTime bookingTime;

    @Column(name = "customer_name")
    private String customerName;

    @Column(name = "customer_phone")
    private String customerPhone;

    @Column(name = "number_of_people")
    private byte numberOfPeople;

    private String note;

    @Enumerated(EnumType.STRING)
    private BookingStatus status;

    public int getStatusOrder() {
        return status.getOrder();
    }

    @Column(name = "create_at")
    private LocalDateTime createAt;

    @Column(name = "canceled_reason")
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String canceledReason;

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "booking", cascade = CascadeType.ALL)
    private List<TableReservation> reservations = new ArrayList<>();

    public void removeReservation(TableReservation reservation) {
        reservations.remove(reservation);
    }

    @PrePersist
    public void prePersist() {
        this.createAt = LocalDateTime.now();
    }

    @PostLoad
    public void postLoad() {
        if(this.status.equals(BookingStatus.CONFIRMED) && LocalDateTime.of(this.bookingDate, this.bookingTime).isBefore(LocalDateTime.now()))
            this.status = BookingStatus.EXPIRED;
    }
}

