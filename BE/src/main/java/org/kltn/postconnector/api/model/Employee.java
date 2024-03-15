package org.kltn.postconnector.api.model;

import com.fasterxml.jackson.annotation.JsonIdentityReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Date;

@Data
@Entity
@Table(name = "`Employee`")
@NoArgsConstructor(force = true)
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    private  String email;

    @Column(name = "full_name")
    private String fullName;

    @ManyToOne
    @JoinColumn(name = "avatar")
    @JsonIdentityReference(alwaysAsId = true)
    private Image avatar;

    private String phone;

    private String address;

    private Date birth;

    private String gender;

    @Column(name = "create_at")
    private LocalDateTime createAt;



    @PrePersist
    public void prePersist() {
        createAt = LocalDateTime.now();
    }


}
