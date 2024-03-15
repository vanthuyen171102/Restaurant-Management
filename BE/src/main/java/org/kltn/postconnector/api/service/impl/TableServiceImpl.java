package org.kltn.postconnector.api.service.impl;

import org.kltn.postconnector.api.dto.TableDTO;
import org.kltn.postconnector.api.exception.ResourceNotFoundException;
import org.kltn.postconnector.api.model.TableEntity;
import org.kltn.postconnector.api.repository.TableRepository;
import org.kltn.postconnector.api.service.TableService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TableServiceImpl implements TableService {

    private final TableRepository tableRepository;

    @Autowired
    public TableServiceImpl(TableRepository tableRepository) {
        this.tableRepository = tableRepository;
    }

    @Override
    public List<TableEntity> getAll() {
        return tableRepository.findAll();
    }

        @Override
        public TableEntity getById(byte tableId) throws ResourceNotFoundException {
            return tableRepository.findById(tableId)
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy bàn cần tìm!"));
        }

    @Override
    public TableEntity create(TableDTO tableDTO) {
        TableEntity table = new TableEntity();
        mapDTOToEnity(table, tableDTO);

        return tableRepository.save(table);
    }

    @Override
    public TableEntity update(TableDTO tableDTO, byte tableId) {
        TableEntity table = tableRepository.findById(tableId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy bàn cần sửa!"));

        mapDTOToEnity(table, tableDTO);
        return tableRepository.save(table);
    }

    @Override
    public void delete(byte tableId) {
        TableEntity table = tableRepository.findById(tableId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy bàn cần xóa!"));

        tableRepository.deleteById(tableId);
    }

    public void mapDTOToEnity(TableEntity table, TableDTO tableDTO) {

        table.setName(tableDTO.getName());
        table.setDescription(tableDTO.getDescription());
        table.setCapacity(tableDTO.getCapacity());
    }
}
