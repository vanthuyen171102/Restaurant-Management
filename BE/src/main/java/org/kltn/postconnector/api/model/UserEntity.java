package org.kltn.postconnector.api.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.kltn.postconnector.api.enums.Role;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name="`User`")
@NoArgsConstructor
public class UserEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Column(nullable = false)
    private  String username;

    @Column(nullable = false)
    private  String password;


    @Column(name = "create_at")
    private LocalDateTime createAt;

    @PrePersist
    public void prePersist() {
        createAt = LocalDateTime.now();
    }

    @Enumerated(EnumType.STRING)
    private Role role;

    @OneToOne(cascade = CascadeType.MERGE)
    @JoinColumn(name = "employee_id")
    private Employee employee;

}
