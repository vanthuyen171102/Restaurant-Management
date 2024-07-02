package org.kltn.postconnector.api.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "`Area`")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Area {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String name;
}
