package org.kltn.postconnector.api.model;

import jakarta.persistence.*;
import lombok.Data;
import org.kltn.postconnector.api.enums.TableStatus;

@Data
@Entity
@Table(name = "`Tables`")
public class TableEntity {

    @Id
    @GeneratedValue( strategy = GenerationType.IDENTITY)
    private Byte id;

    private String name;

    private byte capacity;


    @Column(name = "current_order_id")
    private Long currentOrder;

    private String description;

    @Enumerated(EnumType.STRING)
    private TableStatus status;

    @PrePersist
    public void prePersist() {
        status = TableStatus.READY;
    }


}
