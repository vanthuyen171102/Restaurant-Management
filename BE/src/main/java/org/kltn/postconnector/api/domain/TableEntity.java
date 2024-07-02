package org.kltn.postconnector.api.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonIncludeProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.kltn.postconnector.api.enums.TableStatus;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Controller;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

@Data
@Entity
@Table(name = "`Tables`")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String name;

    private byte capacity;

    @OneToOne
    @JoinColumn(name = "current_order_id")
    @JsonIgnoreProperties({"tables"})
    private Order currentOrder;

    @ManyToOne()
    @JoinColumn(name = "area_id")
    private Area area;

    private String description;

    @Enumerated(EnumType.STRING)
    private TableStatus status;

    @Column(name = "is_deleted")
    @JsonIgnore
    private boolean isDeleted;

    @OneToMany(mappedBy = "table", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JsonIncludeProperties({"booking"})
    private List<TableReservation> reservations = new ArrayList<>();


    public void addReservation(TableReservation reservation) {
        reservations.add(reservation);
        reservation.setTable(this);
    }

    @PrePersist
    public void prePersist() {
        isDeleted = false;
        status = TableStatus.READY;
        name = name.trim();
    }
}
