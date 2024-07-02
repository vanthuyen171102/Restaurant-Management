package org.kltn.postconnector.api.service;

import org.kltn.postconnector.api.domain.Employee;
import org.kltn.postconnector.api.dto.EmployeeDTO;
import org.springframework.data.domain.Page;

import java.util.List;

public interface EmployeeService {

    List<Employee> getAll();

    Page<Employee> getPagedEmployee(int page);

    Employee getById(int employeeId);

    Employee getByEmail(String email);

    Employee create(EmployeeDTO.Create createEmployeeRequest);

    Employee update(EmployeeDTO.Update updateEmployeeRequest, int employeeId);

    void delete(int employeeId);

    void block(int employeeId);

    void unBlock(int employeeId);

}
