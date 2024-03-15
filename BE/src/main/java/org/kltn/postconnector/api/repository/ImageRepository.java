package org.kltn.postconnector.api.repository;

import org.kltn.postconnector.api.model.Image;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ImageRepository extends JpaRepository<Image, Long> {
}
