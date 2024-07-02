package org.kltn.postconnector.api.service.impl;

import lombok.RequiredArgsConstructor;
import org.kltn.postconnector.api.domain.*;
import org.kltn.postconnector.api.dto.BookingCancelDTO;
import org.kltn.postconnector.api.dto.BookingDTO;
import org.kltn.postconnector.api.enums.BookingStatus;
import org.kltn.postconnector.api.enums.OrderStatus;
import org.kltn.postconnector.api.enums.OrderType;
import org.kltn.postconnector.api.enums.TableStatus;
import org.kltn.postconnector.api.exception.BadRequestException;
import org.kltn.postconnector.api.exception.ResourceNotFoundException;
import org.kltn.postconnector.api.repository.*;
import org.kltn.postconnector.api.service.BookingService;
import org.kltn.postconnector.api.service.TableService;
import org.kltn.postconnector.api.service.TimeLineService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;

    private final TableService tableService;

    private final TimeLineService timeLineService;
    private final TableReservationRepository tableReservationRepository;
    private final OrderRepository orderRepository;
    private final TableOrderRepository tableOrderRepository;
    private final TableRepository tableRepository;
    private final SimpMessagingTemplate messagingTemplate;
    @Override
    public Page<Booking> getPagedTableBooking(int page) {
        return bookingRepository.findAll(PageRequest.of(page - 1, 10,
                Sort.by(Sort.Direction.DESC, "bookingDate")));
    }

    @Override
    public Booking getById(int id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn đạt bàn {ID = %d}".formatted(id)));
    }

    @Override
    public List<Booking> getAvailableBookings(LocalTime time, LocalDate date) {
        return bookingRepository.findAvailableBookings(time, date, List.of(BookingStatus.CONFIRMED));
    }

    @Override
    public Booking create(BookingDTO bookingDTO) {
        Booking booking = Booking.builder()
                .customerName(bookingDTO.getCustomerName())
                .customerPhone(bookingDTO.getCustomerPhone())
                .bookingDate(bookingDTO.getBookingDate())
                .bookingTime(bookingDTO.getBookingTime())
                .numberOfPeople(bookingDTO.getNumberOfPeople())
                .note(bookingDTO.getNote())
                .status(BookingStatus.CONFIRMED)
                .build();
        return bookingRepository.save(booking);
    }

    @Transactional
    @Override
    public Booking update(BookingDTO bookingDTO, int bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn đặt bàn muốn hủy {ID = %d}".formatted(bookingId)));

        switch (booking.getStatus()) {
            case CANCELED -> throw new BadRequestException("Đơn đặt bàn này đã bị hủy trước đó!");
            case COMPLETE -> throw new BadRequestException("Đơn đặt bàn này đã hoàn thành!");
        }


        booking.setCustomerName(bookingDTO.getCustomerName());
        booking.setCustomerPhone(bookingDTO.getCustomerPhone());
        booking.setNumberOfPeople(bookingDTO.getNumberOfPeople());
        booking.setNote(bookingDTO.getNote());
        if (!booking.getBookingDate().equals(bookingDTO.getBookingDate()) || !booking.getBookingTime().equals(bookingDTO.getBookingTime())) {
            tableReservationRepository.deleteAllByBookingId(bookingId);
        }
        booking.setBookingDate(bookingDTO.getBookingDate());
        booking.setBookingTime(bookingDTO.getBookingTime());

        return bookingRepository.save(booking);
    }

    @Transactional
    @Override
    public Booking cancel(BookingCancelDTO bookingCancelDTO, int bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn đặt bàn muốn hủy {ID = %d}".formatted(bookingId)));

        // Kiểm tra trạng thái hiện tại của đơn đặt bàn
        switch (booking.getStatus()) {
            case CANCELED -> throw new BadRequestException("Đơn đặt bàn này đã bị hủy trước đó!");
            case COMPLETE -> throw new BadRequestException("Đơn đặt bàn này đã hoàn thành!");
        }
        booking.setStatus(BookingStatus.CANCELED);
        booking.setCanceledReason(bookingCancelDTO.getCancelReason());

        tableReservationRepository.deleteAllByBookingId(bookingId);
        booking.getReservations().clear();

        bookingRepository.save(booking);

        return booking;
    }

    @Transactional
    @Override
    public Booking checkIn(int bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn đặt bàn muốn cho khách nhận bàn {ID = %d}".formatted(bookingId)));

        switch (booking.getStatus()) {
            case PENDING -> throw new BadRequestException("Đơn đặt bàn này chưa được xác nhận!");
            case CANCELED -> throw new BadRequestException("Đơn đặt bàn này đã bị hủy!");
            case COMPLETE -> throw new BadRequestException("Đơn đặt này đã bị hủy!");
        }

        if (booking.getReservations().isEmpty())
            throw new BadRequestException("Đơn đặt bàn này chưa được xếp bàn!");

        Order order = Order.builder()
                .type(OrderType.DINE_IN)
                .status(OrderStatus.InProgress)
                .orderItems(new ArrayList<>())
                .build();


        List<TableOrder> tableOrders = new ArrayList<>();
        for (TableReservation tableReservation : booking.getReservations()) {
            TableEntity table = tableReservation.getTable();
            if (table.getStatus().equals(TableStatus.UNAVAILABLE)) {
                throw new BadRequestException("Bàn %s - Khu %s không khả dụng!".formatted(table.getName(), table.getArea().getName()));
            }
            if (table.getStatus().equals(TableStatus.USING) || table.getCurrentOrder() != null) {
                throw new BadRequestException("Bàn %s - Khu %s đang được sử dụng!".formatted(table.getName(), table.getArea().getName()));
            }
            table.setCurrentOrder(order);

            TableOrder tableOrder = new TableOrder();
            tableOrder.setTable(table);
            tableOrder.setOrder(order);
            tableOrders.add(tableOrder);
        }
        order.setTables(tableOrders);
        Order createdOrder = orderRepository.save(order);
        booking.setStatus(BookingStatus.COMPLETE);
        for (TableOrder tableOrder : tableOrders) {
            messagingTemplate.convertAndSend(String.format("/topic/table/update/%s", tableOrder.getTable().getId()), tableOrder.getTable());
        }
        messagingTemplate.convertAndSend("/topic/order/new-order", createdOrder);

        return bookingRepository.save(booking);
    }

    @Override
    public Booking confirm(int bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn đặt bàn muốn xác nhận {ID = %d}".formatted(bookingId)));

        if (!BookingStatus.PENDING.equals(booking.getStatus())) {
            throw new BadRequestException("Trạng thái của đơn đặt bàn muốn xác nhận không hợp lệ!");
        }

        if (LocalDateTime.of(booking.getBookingDate(), booking.getBookingTime()).isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Thời gian đặt bàn của đơn muốn xác nhận không hợp lệ!");
        }

        booking.setStatus(BookingStatus.CONFIRMED);

        return bookingRepository.save(booking);
    }
}
