package org.kltn.postconnector.api.service.impl;

import lombok.RequiredArgsConstructor;
import org.kltn.postconnector.api.domain.*;
import org.kltn.postconnector.api.dto.SaveReservationsRequest;
import org.kltn.postconnector.api.dto.TableDTO;
import org.kltn.postconnector.api.enums.OrderItemStatus;
import org.kltn.postconnector.api.enums.OrderStatus;
import org.kltn.postconnector.api.enums.PaymentStatus;
import org.kltn.postconnector.api.enums.TableStatus;
import org.kltn.postconnector.api.exception.BadRequestException;
import org.kltn.postconnector.api.exception.ResourceNotFoundException;
import org.kltn.postconnector.api.repository.*;
import org.kltn.postconnector.api.service.RevenueService;
import org.kltn.postconnector.api.service.TableService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class TableServiceImpl implements TableService {

    private final TableRepository tableRepository;
    private final OrderRepository orderRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final RevenueService revenueService;
    private final TableReservationRepository tableReservationRepository;
    private final BookingRepository bookingRepository;
    private final AreaRepository areaRepository;

    @Override
    public List<TableEntity> getAll(LocalDate date) {
        List<TableEntity> tables = tableRepository.findAllNotDeleted(date, Sort.by(Sort.Direction.ASC, "area"));

        return tables.stream()
                .peek(table -> {
                    List<TableReservation> filteredReservations = table.getReservations().stream()
                            .filter(tr -> tr.getBooking() == null || tr.getBooking().getBookingDate().equals(date))
                            .collect(Collectors.toList());
                    table.setReservations(filteredReservations);
                })
                .toList();
    }

    @Override
    public Page<TableEntity> getPagedTable(LocalDate date, int page, int limit) {
       return tableRepository.findAllNotDeleted(date,PageRequest.of(page - 1, limit, Sort.by(Sort.Direction.ASC, "area")));
    }

    @Override
    public List<TableEntity> getTableHaveOrder() {
        return tableRepository.findTablesHavingOrders();
    }


    @Override
    public TableEntity getById(int tableId) throws ResourceNotFoundException {
        TableEntity tableEntity = tableRepository.findByIdNotDeleted(tableId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy bàn cần tìm!"));

        return Stream.of(tableEntity)
                .peek(table -> {
                    List<TableReservation> filteredReservations = table.getReservations().stream()
                            .filter(tr -> tr.getBooking() == null || tr.getBooking().getBookingDate().equals(LocalDate.now()))
                            .collect(Collectors.toList());
                    table.setReservations(filteredReservations);
                })
                .findFirst()
                .get();
    }

    @Override
    public TableEntity create(TableDTO tableDTO) {

        Area area = areaRepository.findById(tableDTO.getAreaId())
                .orElseThrow(() -> new BadRequestException("Không tìm thấy khu vực {ID = %d}!".formatted(tableDTO.getAreaId())));


        TableEntity table = TableEntity.builder()
                .name(tableDTO.getName())
                .description(tableDTO.getDescription())
                .capacity(tableDTO.getCapacity())
                .area(area)
                .build();
        return tableRepository.save(table);
    }

    @Override
    public TableEntity update(TableDTO tableDTO, int tableId) {
        TableEntity table = tableRepository.findByIdNotDeleted(tableId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy bàn cần sửa { ID = %s }!".formatted(tableId)));

        Area area = areaRepository.findById(tableDTO.getAreaId())
                .orElseThrow(() -> new BadRequestException("Không tìm thấy khu vực {ID = %d}!".formatted(tableDTO.getAreaId())));

        table.setName(tableDTO.getName());
        table.setDescription(tableDTO.getDescription());
        table.setCapacity(tableDTO.getCapacity());
        table.setArea(area);

        return tableRepository.save(table);
    }

    @Override
    public void delete(int tableId) {
        TableEntity table = tableRepository.findByIdNotDeleted(tableId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy bàn cần xóa { ID = %s }!".formatted(tableId)));

        if (Objects.requireNonNull(table.getStatus()) == TableStatus.USING) {
            throw new BadRequestException("Bàn này đang được sử dụng nên không thể xóa!");
        }
        table.setDeleted(true);

        tableRepository.save(table);
    }

    @Override
    @Transactional
    public void returnTable(int tableId) {
        TableEntity table = tableRepository.findByIdNotDeleted(tableId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy bàn muốn trả { ID = %s }!".formatted(tableId)));

        if (!table.getStatus().equals(TableStatus.USING)) {
            throw new BadRequestException("Chỉ có thể trả các bàn đang hoạt động!");
        } else {
            Order order = table.getCurrentOrder();
            if (order.getPaymentStatus() == null || !order.getPaymentStatus().equals(PaymentStatus.PAID)) {
                throw new BadRequestException("Hóa đơn của bàn này chưa được thanh toán!");
            }
            if (order.getOrderItems().stream()
                    .anyMatch(orderItem -> orderItem.getStatus().equals(OrderItemStatus.WAITING))) {
                throw new BadRequestException("Có món ăn đang chờ phục vụ nên không thể trả bàn lúc này!");
            }

            LocalDate orderDate = order.getCreateAt().toLocalDate();

            order.getOrderItems()
                    .stream().filter(orderItem -> orderItem.getStatus().equals(OrderItemStatus.COMPLETED))
                    .forEach(orderItem -> revenueService.addDailyRevenueForItem(orderDate, orderItem.getItem(),
                            orderItem.getPrice() * orderItem.getQuantity(), orderItem.getQuantity(),
                            orderItem.getProfit() * orderItem.getQuantity()));

            System.out.println(order.getTables());
            for (TableOrder tableOrder : order.getTables()) {
                var returnTable = tableOrder.getTable();
                returnTable.setStatus(TableStatus.READY);
                returnTable.setCurrentOrder(null);
                tableRepository.save(returnTable);
                messagingTemplate.convertAndSend(String.format("/topic/table/update/%s", tableOrder.getTable().getId()), returnTable);
            }

            order.setStatus(OrderStatus.Completed);
            order.preUpdate();
            Order updatedOrder = orderRepository.save(order);
            messagingTemplate.convertAndSend(String.format("/topic/order/update/%s", updatedOrder.getId()), updatedOrder);
        }
    }

    @Transactional
    @Override
    public TableEntity saveReservations(int id, SaveReservationsRequest saveReservationsRequest) {
        TableEntity table = tableRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy bàn muốn lưu lịch đặt bàn {ID = %d}".formatted(id)));

        table.getReservations().removeIf(tableReservation -> tableReservation.getBooking().getBookingDate().equals(saveReservationsRequest.getDate()));
        tableReservationRepository.deleteAllByBookingDateAndTableId(saveReservationsRequest.getDate(), table.getId());

        for (SaveReservationsRequest.TableReservationDTO dto : saveReservationsRequest.getReservations()) {
            TableReservation reservation = new TableReservation();
            reservation.setTable(table);
            Booking booking = bookingRepository.findById(dto.getBookingId())
                    .orElseThrow(() -> new BadRequestException("Không tìm thấy đơn đặt bàn để xếp bàn {ID = %d}".formatted(dto.getBookingId())));
            if (!Objects.equals(booking.getBookingTime(), dto.getTime())) {
                throw new BadRequestException("Thời gian xếp bàn không trùng khớp với thời gian đặt bàn {ID = %d}".formatted(dto.getBookingId()));
            }
            reservation.setBooking(booking);
            table.addReservation(reservation);

        }

        return tableRepository.save(table);
    }

}
