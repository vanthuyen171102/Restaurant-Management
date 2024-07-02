package org.kltn.postconnector.api.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Date;

@Getter
@Setter
@Entity
@Table(name = "`Employee`")
@Builder
@AllArgsConstructor
@NoArgsConstructor(force = true)
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    private String email;

    @JsonIgnore
    private String password;

    @ManyToOne
    @JoinColumn(name = "role_id")
    private Role role;

    @Column(name = "full_name")
    private String fullName;

    private String avatar;

    private String phone;

    private String address;

    private Date birth;

    private String gender;

    @Column(name = "is_deleted")
    @JsonIgnore
    private boolean isDeleted;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "is_blocked")
    @Getter
    private boolean isBlocked;

    public boolean getBlocked() {
        return this.isBlocked;
    }

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
        isDeleted = false;
        isBlocked = false;
    }
}
