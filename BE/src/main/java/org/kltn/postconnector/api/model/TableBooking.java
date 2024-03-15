package org.kltn.postconnector.api.model;

import com.fasterxml.jackson.annotation.JsonIdentityReference;
import jakarta.persistence.*;
import lombok.Data;
import org.kltn.postconnector.api.enums.BookingStatus;

import java.sql.Date;
import java.sql.Time;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "`TableBooking`")
public class TableBooking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "booking_date")
    private Date bookingDate;

    @Column(name = "booking_time")
    private Time bookingTime;

    @Column(name = "customer_name")
    private String customerName;

    @Column(name = "customer_phone")
    private String customerPhone;

    @Column(name = "number_of_people")
    private byte numberOfPeople;

    @ManyToOne
    @JoinColumn(name = "table_id")
    @JsonIdentityReference(alwaysAsId = true)
    private TableEntity table;

    private String note;

    @Enumerated(EnumType.STRING)
    private BookingStatus status;

    @Column(name = "create_at")
    private LocalDateTime createAt;

    @PrePersist
    public void prePersist() {
        this.createAt = LocalDateTime.now();
        this.status = BookingStatus.CONFIRMED;
    }

}
