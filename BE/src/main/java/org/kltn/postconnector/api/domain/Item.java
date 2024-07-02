package org.kltn.postconnector.api.domain;

import com.fasterxml.jackson.annotation.JsonIdentityReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "`Item`")
public class Item {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String title;

    private float price;

    @Column(name = "capital_price")
    private float capitalPrice;

    @Column(name = "is_disable")
    private boolean isDisable;

    @Column(name = "is_deleted")
    @JsonIgnore
    private boolean isDeleted;

    private String thumb;

    private int stock;

    @ManyToOne
    @JoinColumn(name = "cat_id")
    @JsonProperty(value = "cat")
    @JsonIdentityReference(alwaysAsId = true)
    private Category cat;

    @Column(name = "create_at")
    private LocalDateTime createAt;

    @Column(name = "update_at")
    private LocalDateTime updateAt;

    @PrePersist
    public void prePersist() {
        createAt = LocalDateTime.now();
        updateAt = LocalDateTime.now();
        isDeleted = false;
        isDisable = false;
        stock = 0;
    }

    @PreUpdate
    public void preUpdate() {
        updateAt = LocalDateTime.now();
    }
}
