package org.kltn.postconnector.api.controller;

import org.kltn.postconnector.api.domain.TimeLine;
import org.kltn.postconnector.api.payload.response.ResponseObject;
import org.kltn.postconnector.api.service.TimeLineService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/timeline")
public class TimeLineController {

    private final TimeLineService timeLineService;

    public TimeLineController(TimeLineService timeLineService) {
        this.timeLineService = timeLineService;
    }

    @GetMapping()
    public ResponseEntity<ResponseObject<List<TimeLine>>> getAllTimeLine() {
        return ResponseEntity.ok(ResponseObject.<List<TimeLine>>builder()
                .code(HttpStatus.OK.value())
                .data(timeLineService.getAll())
                .build());
    }
}
