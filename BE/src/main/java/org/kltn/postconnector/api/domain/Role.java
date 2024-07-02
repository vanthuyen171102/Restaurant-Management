package org.kltn.postconnector.api.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "`Role`")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String name;

    @Column(name = "name_vi")
    private String nameVI;
}
