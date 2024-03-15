package org.kltn.postconnector.api.model;

import com.fasterxml.jackson.annotation.JsonIdentityReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "`Item`")
public class Item {

    @Id
    @GeneratedValue( strategy = GenerationType.IDENTITY )
    private int id;

    private String title;

    private String slug;

    private String summary;

    private String recipe;

    private String instructions;

    private float price;

    private boolean disable;

    private float discount;

    @ManyToOne
    @JoinColumn(name = "thumb")
    @JsonIdentityReference(alwaysAsId = true)
    private Image thumb;

    @ManyToOne
    @JoinColumn(name = "cat_id")
    @JsonProperty(value = "cat")
    @JsonIdentityReference( alwaysAsId = true)
    private Category catId;

    @Column(name = "create_at")
    private LocalDateTime createAt;

    @Column(name = "update_at")
    private LocalDateTime update_at;

    @PrePersist
    public void prePersist() {
        createAt = LocalDateTime.now();
        update_at = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        update_at = LocalDateTime.now();
    }
}
