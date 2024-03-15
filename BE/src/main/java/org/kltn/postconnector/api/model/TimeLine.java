package org.kltn.postconnector.api.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.sql.Time;

@Data
@Entity
@Table(name = "`TimeLine`")
public class TimeLine {

    @Id
    @GeneratedValue( strategy = GenerationType.IDENTITY)
    private short id;

    @Column(name = "day_of_week")
    @JsonIgnore
    private String dayOfWeek;

    private Time timeline;
}
