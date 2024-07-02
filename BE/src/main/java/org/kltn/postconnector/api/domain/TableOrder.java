package org.kltn.postconnector.api.domain;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonIncludeProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity
@Table(name = "`TableOrder`")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
public class TableOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "table_id")
    @JsonIgnoreProperties({"currentOrder","reservations"})
    @JsonIncludeProperties({"id", "name", "area", "capacity"})
    private TableEntity table;

    @ManyToOne
    @JoinColumn(name = "order_id")
    @JsonIgnoreProperties({"tables"})
    private Order order;
}
