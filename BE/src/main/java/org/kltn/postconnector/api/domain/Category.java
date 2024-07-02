package org.kltn.postconnector.api.domain;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Data
@Entity
@NoArgsConstructor
@Getter
@Setter
@Table(name = "`Category`")

public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String title;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public Category(String title) {
        this.title = title;
    }

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.title = this.title.trim();
    }


}
