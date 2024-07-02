package org.kltn.postconnector.api.service.impl;

import org.kltn.postconnector.api.domain.TimeLine;
import org.kltn.postconnector.api.repository.TimeLineRepository;
import org.kltn.postconnector.api.service.TimeLineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Time;
import java.util.List;

@Service
public class TimeLineServiceImpl implements TimeLineService {

    private final TimeLineRepository timeLineRepository;

    @Autowired
    public TimeLineServiceImpl(TimeLineRepository timeLineRepository) {
        this.timeLineRepository = timeLineRepository;
    }

    @Override
    public List<TimeLine> getAll() {
        return timeLineRepository.findAll();
    }

    @Override
    public TimeLine getByTime(Time time) {
        return timeLineRepository.findByTimeline(time).orElse(null);
    }
}
