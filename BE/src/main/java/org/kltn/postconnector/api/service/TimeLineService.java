package org.kltn.postconnector.api.service;

import org.kltn.postconnector.api.model.TimeLine;

import java.sql.Time;
import java.util.List;

public interface TimeLineService {
    List<TimeLine> getAll();

    TimeLine getByTime(Time time);
}
