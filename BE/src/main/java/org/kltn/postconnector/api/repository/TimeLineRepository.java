package org.kltn.postconnector.api.repository;

import org.kltn.postconnector.api.model.TimeLine;
import org.springframework.data.jpa.repository.JpaRepository;

import java.sql.Time;
import java.util.Optional;

public interface TimeLineRepository extends JpaRepository<TimeLine, Short> {
    Optional<TimeLine> findByTimeline(Time time);
}
