package org.kltn.postconnector.api.service;

import org.kltn.postconnector.api.dto.TableDTO;
import org.kltn.postconnector.api.model.TableEntity;

import java.util.List;

public interface TableService {

    List<TableEntity> getAll() ;

    TableEntity getById(byte tableId);

    TableEntity create(TableDTO tableDTO);

    TableEntity update(TableDTO tableDTO, byte tableId);

    void delete(byte tableId);
}
