package org.kltn.postconnector.api.model;

import com.fasterxml.jackson.annotation.JsonIdentityReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
@Entity
@Table(name = "`Category`")
public class Category {

    @Id
    @GeneratedValue( strategy = GenerationType.IDENTITY)
    private int id;

    @NotBlank(message = "Tên danh mục không được để trống!")
    private String title;

    private String summary;

    private boolean disable;

    private String slug;

    @ManyToOne
    @JoinColumn(name = "thumb")
    @JsonIdentityReference(alwaysAsId = true)
    private Image thumb;
}
