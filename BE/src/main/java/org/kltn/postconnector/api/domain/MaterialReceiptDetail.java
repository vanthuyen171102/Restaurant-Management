package org.kltn.postconnector.api.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "`MaterialReceiptDetail`")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class MaterialReceiptDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "material_id")
    private Material material;

    @ManyToOne
    @JoinColumn(name = "receipt_id")
    @JsonIgnore
    private MaterialReceipt receipt;

    private float quantity;

    private float price;
}
