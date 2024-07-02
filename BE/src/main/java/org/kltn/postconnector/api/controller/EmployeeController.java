package org.kltn.postconnector.api.controller;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import org.kltn.postconnector.api.domain.Employee;
import org.kltn.postconnector.api.dto.EmployeeDTO;
import org.kltn.postconnector.api.payload.response.PagedResponse;
import org.kltn.postconnector.api.service.EmployeeService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1")
public class EmployeeController {

    private final EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @GetMapping("/employee/options")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public List<Map<String, String>> getEmployeeOptions() {
        return employeeService.getAll().stream()
                .map(employee -> Map.of("id", String.valueOf(employee.getId()), "name", employee.getFullName()))
                .collect(Collectors.toList());
    }

    @GetMapping("/employees")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public PagedResponse<Employee> getPagedEmployee(
            @RequestParam(name = "page", defaultValue = "1", required = false) @Min(1) int page) {
        Page<Employee> pagedEmployee = employeeService.getPagedEmployee(page);
        return PagedResponse.<Employee>builder()
                .total(pagedEmployee.getTotalElements())
                .totalPage(pagedEmployee.getTotalPages())
                .currentPage(pagedEmployee.getNumber() + 1)
                .items(pagedEmployee.getContent())
                .build();
    }

    @GetMapping("employees/all")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public List<Employee> getAllEmployee() {
        return employeeService.getAll();
    }

    @GetMapping("employee/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public Employee getEmployeeById(@PathVariable(value = "id") int id) {
        return employeeService.getById(id);
    }

    @PostMapping("employee/create")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    @ResponseStatus(HttpStatus.CREATED)
    public Employee createEmployee(@ModelAttribute EmployeeDTO.Create employeeDTO) {
        return employeeService.create(employeeDTO);
    }

    @PutMapping("employee/update/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public Employee updateEmployee(@Valid @ModelAttribute EmployeeDTO.Update employeeDTO, @PathVariable("id") int id) {
        return employeeService.update(employeeDTO, id);
    }

    @DeleteMapping("employee/delete/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN')")

    public void deleteEmployee(@PathVariable("id") int id) {
        employeeService.delete(id);
    }

    @PutMapping("employee/block/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public void blockEmployee(@PathVariable("id") int id) {
        employeeService.block(id);
    }

    @PutMapping("employee/unBlock/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public void unBlockEmployee(@PathVariable("id") int id) {
        employeeService.unBlock(id);

    }
}
