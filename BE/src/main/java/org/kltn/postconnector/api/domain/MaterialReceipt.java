package org.kltn.postconnector.api.domain;

import com.fasterxml.jackson.annotation.JsonIncludeProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "`MaterialReceipt`")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class MaterialReceipt {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private float total;

    @Column(name = "is_paid")
    private boolean isPaid;

    @Column(name = "created_at")
    @CreatedDate
    private LocalDateTime createdAt;

    @ManyToOne()
    @JoinColumn(name = "created_by")
    private Employee employee;

    @JoinColumn(name = "supplier_id")
    @ManyToOne
    @JsonIncludeProperties({"id", "name"})
    private Supplier supplier;

    private String note;

    @OneToMany(mappedBy = "receipt", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JsonProperty(value = "items")
    private List<MaterialReceiptDetail> items;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.total = (float) items.stream()
                .mapToDouble(item -> item.getPrice() * item.getQuantity())
                .sum();
    }

    @PreUpdate
    public void preUpdate() {
        this.total = (float) items.stream()
                .mapToDouble(item -> item.getPrice() * item.getQuantity())
                .sum();
    }
}
