package org.kltn.postconnector.api.controller;

import jakarta.validation.Valid;
import org.kltn.postconnector.api.dto.EmployeeDTO;
import org.kltn.postconnector.api.model.Employee;
import org.kltn.postconnector.api.payload.response.ResponseObject;
import org.kltn.postconnector.api.service.EmployeeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/employee")
public class EmployeeController {

    private final EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @GetMapping()
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<ResponseObject<List<Employee>>> getAllEmployee() {
        return ResponseEntity.ok(ResponseObject.<List<Employee>>builder()
                .code(HttpStatus.OK.value())
                .data(employeeService.getAll())
                .build());
    }

    @GetMapping("{id}")
    public ResponseEntity<ResponseObject<Employee>> getEmployee(@PathVariable(value = "id") int id) {
        return ResponseEntity.ok(ResponseObject.<Employee>builder()
                .code(HttpStatus.OK.value())
                .data(employeeService.getById(id))
                .build());
    }

    @PostMapping()
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<ResponseObject<Employee>> createEmployee(@Valid @ModelAttribute EmployeeDTO employeeDTO) {
        return ResponseEntity.ok(ResponseObject.<Employee>builder()
                .code(HttpStatus.CREATED.value())
                .message("Thêm nhân viên thành công!")
                .data(employeeService.create(employeeDTO))
                .build());
    }

    @PutMapping("{id}")
    public ResponseEntity<ResponseObject<Employee>> updateEmployee(@Valid @ModelAttribute EmployeeDTO employeeDTO, @PathVariable("id") int id) {
        return ResponseEntity.ok(ResponseObject.<Employee>builder()
                .code(HttpStatus.OK.value())
                .message("Sửa nhân viên thành công!")
                .data(employeeService.update(employeeDTO, id))
                .build());
    }

    @DeleteMapping("{id}")
    public ResponseEntity<ResponseObject<?>> deleteEmployee(@PathVariable("id") int id) {
        employeeService.delete(id);

        return ResponseEntity.ok(ResponseObject.builder()
                .code(HttpStatus.OK.value())
                .message("Xóa nhân viên thành công!")
                .build());
    }
}
