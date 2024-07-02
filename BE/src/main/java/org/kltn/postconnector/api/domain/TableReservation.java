package org.kltn.postconnector.api.domain;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonIncludeProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity
@Table(name = "`TableReservation`")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class TableReservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "table_id")
    @JsonIgnoreProperties({"reservations"})
    @JsonIncludeProperties({"id", "name", "area", "capacity"})
    private TableEntity table;

    @ManyToOne
    @JoinColumn(name = "booking_id")
    @JsonIgnoreProperties({"reservations"})
    private Booking booking;
}
