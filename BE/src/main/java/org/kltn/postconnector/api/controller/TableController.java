package org.kltn.postconnector.api.controller;

import jakarta.validation.Valid;
import org.kltn.postconnector.api.dto.TableDTO;
import org.kltn.postconnector.api.model.Order;
import org.kltn.postconnector.api.model.TableEntity;
import org.kltn.postconnector.api.payload.response.ResponseObject;
import org.kltn.postconnector.api.service.TableService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/table")
public class TableController {
    private final TableService tableService;

    @Autowired
    public TableController(TableService tableService) {
        this.tableService = tableService;
    }

    @GetMapping()
    public ResponseEntity<ResponseObject<List<TableEntity>>> getAllTable() {
        return ResponseEntity.ok(ResponseObject.<List<TableEntity>>builder()
                .code(HttpStatus.OK.value())
                .data(tableService.getAll())
                .build());
    }

    @GetMapping("{id}")
    public ResponseEntity<ResponseObject<TableEntity>> getTable(@PathVariable(value = "id") byte id) {
        return ResponseEntity.ok(ResponseObject.<TableEntity>builder()
                .code(HttpStatus.OK.value())
                .data(tableService.getById(id))
                .build());    }

    @PostMapping()
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<ResponseObject<TableEntity>> createTable(@Valid @RequestBody TableDTO tableDTO) {
        return ResponseEntity.ok(ResponseObject.<TableEntity>builder()
                .code(HttpStatus.CREATED.value())
                        .message("Thêm bàn thành công!")
                .data(tableService.create(tableDTO))
                .build());
    }

    @PutMapping("{id}")
    public ResponseEntity<ResponseObject<?>> updateTable(@Valid @RequestBody TableDTO tableDTO, @PathVariable("id") byte id) {
        return ResponseEntity.ok(ResponseObject.<TableEntity>builder()
                .code(HttpStatus.OK.value())
                        .message("Sửa thông tin bàn thành công!")
                .data(tableService.update(tableDTO, id))
                .build());
    }

    @DeleteMapping("{id}")
    public ResponseEntity<?> deleteTable(@PathVariable("id") byte id) {
        tableService.delete(id);

        return ResponseEntity.ok(ResponseObject.<Order>builder()
                .code(HttpStatus.OK.value())
                .message("Xóa bàn thành công!")
                .build());
    }
}
