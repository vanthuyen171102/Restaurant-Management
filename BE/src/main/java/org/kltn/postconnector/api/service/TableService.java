package org.kltn.postconnector.api.service;

import org.kltn.postconnector.api.domain.TableEntity;
import org.kltn.postconnector.api.dto.SaveReservationsRequest;
import org.kltn.postconnector.api.dto.TableDTO;
import org.springframework.data.domain.Page;

import java.time.LocalDate;
import java.util.List;

public interface TableService {

    List<TableEntity> getAll(LocalDate date);

    Page<TableEntity> getPagedTable(LocalDate date, int page, int limit);
    TableEntity getById(int tableId);

    List<TableEntity> getTableHaveOrder();

    TableEntity create(TableDTO tableDTO);

    TableEntity update(TableDTO tableDTO, int tableId);

    void returnTable(int tableId);

    void delete(int tableId);

    TableEntity saveReservations(int id, SaveReservationsRequest saveReservationsRequest);
}
