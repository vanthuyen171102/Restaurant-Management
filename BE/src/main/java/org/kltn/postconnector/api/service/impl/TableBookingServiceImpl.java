package org.kltn.postconnector.api.service.impl;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.kltn.postconnector.api.dto.TableBookingDTO;
import org.kltn.postconnector.api.exception.BadRequestException;
import org.kltn.postconnector.api.exception.ResourceNotFoundException;
import org.kltn.postconnector.api.model.TableBooking;
import org.kltn.postconnector.api.model.TableEntity;
import org.kltn.postconnector.api.payload.response.PagedTableBookingResponse;
import org.kltn.postconnector.api.repository.TableBookingRepository;
import org.kltn.postconnector.api.service.TableBookingService;
import org.kltn.postconnector.api.service.TableService;
import org.kltn.postconnector.api.service.TimeLineService;
import org.kltn.postconnector.api.utils.DateUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

@Service
public class TableBookingServiceImpl implements TableBookingService {

    @PersistenceContext
    private EntityManager entityManager;

    private final TableBookingRepository tableBookingRepository;

    private final TableService tableService;

    private final TimeLineService timeLineService;

    @Autowired
    public TableBookingServiceImpl(TableBookingRepository tableBookingRepository, TableService tableService,
                                   TimeLineService timeLineService) {
        this.tableBookingRepository = tableBookingRepository;
        this.tableService = tableService;
        this.timeLineService = timeLineService;
    }

    @Override
    public PagedTableBookingResponse getAllByBookingDate(int page, Date bookingDate) {
        Page<TableBooking> bookings = tableBookingRepository.findAllByBookingDate(bookingDate,PageRequest.of(page - 1, 10));

        return new PagedTableBookingResponse(bookings.getContent(),
                bookings.getTotalElements(),
                page, bookings.getTotalPages());
    }


    @Override
    public TableBooking create(TableBookingDTO tableBookingDTO) {
        TableBooking tableBooking = new TableBooking();
        mapRequestToEntity(tableBooking, tableBookingDTO);

        return tableBookingRepository.save(tableBooking);
    }

    @Override
    public TableBooking update(TableBookingDTO tableBookingDTO, long tableBookingId) {
        return null;
    }

    @Override
    public void delete(long tableBookingId) {

    }

    public void mapRequestToEntity(TableBooking tableBooking, TableBookingDTO tableBookingDTO) {
        try {
            TableEntity table = tableService.getById(tableBookingDTO.getTableId());
            tableBooking.setTable(table);
        } catch (ResourceNotFoundException ex) {
            throw new ResourceNotFoundException("Không tìm thấy bàn muốn đặt!");
        }


        // Validate dữ liệu ngày đặt
        if(!DateUtil.validate(tableBookingDTO.getBookingDate())) {
            throw new BadRequestException("Ngày đặt bàn không hợp lệ!");
        }

        // Chuyển date dạng String về java.date.sql
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        Date bookingDate = Date.valueOf(LocalDate.parse(tableBookingDTO.getBookingDate(), dateFormatter));

        // Chuyển date dạng String về java.time.sql
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm:ss");
        Time bookingTime = Time.valueOf(LocalTime.parse(tableBookingDTO.getBookingTime(), timeFormatter));

        if (System.currentTimeMillis() > bookingDate.getTime() + bookingTime.getTime()) {
            throw new BadRequestException("Thời điểm đặt bàn phải ở tương lai!");
        }

        if(timeLineService.getByTime(bookingTime) == null) {
            throw new BadRequestException("Chúng tôi không nhận đặt bàn vào giờ này!");
        }

        if(tableBookingRepository.findByBookingDateAndBookingTimeAndTableId(bookingDate,
                bookingTime, tableBookingDTO.getTableId()).isPresent()) {
            throw new BadRequestException("Bàn này đã được đặt trước!");
        }

        tableBooking.setBookingDate(bookingDate);
        tableBooking.setBookingTime(bookingTime);
        tableBooking.setCustomerName(tableBookingDTO.getCustomerName());
        tableBooking.setCustomerPhone(tableBookingDTO.getCustomerPhone());
        tableBooking.setNumberOfPeople(tableBookingDTO.getNumberOfPeople());
        tableBooking.setNote(tableBookingDTO.getNote());

    }
}
