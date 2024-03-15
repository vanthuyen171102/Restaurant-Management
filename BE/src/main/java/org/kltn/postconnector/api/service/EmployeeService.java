package org.kltn.postconnector.api.service;

import org.kltn.postconnector.api.dto.EmployeeDTO;
import org.kltn.postconnector.api.model.Employee;

import java.util.List;

public interface EmployeeService {

    List<Employee> getAll() ;

    Employee getById(int employeeId);

    Employee create(EmployeeDTO employeeDTO);

    Employee update(EmployeeDTO employeeDTO, int employeeId);

    void delete(int employeeId);

}
