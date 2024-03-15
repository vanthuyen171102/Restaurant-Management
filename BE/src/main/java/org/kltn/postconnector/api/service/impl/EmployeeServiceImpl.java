package org.kltn.postconnector.api.service.impl;

import lombok.RequiredArgsConstructor;
import org.kltn.postconnector.api.dto.EmployeeDTO;
import org.kltn.postconnector.api.exception.ResourceNotFoundException;
import org.kltn.postconnector.api.model.Employee;
import org.kltn.postconnector.api.repository.EmployeeRepository;
import org.kltn.postconnector.api.service.EmployeeService;
import org.kltn.postconnector.api.utils.ImageUtil;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployeeServiceImpl implements EmployeeService {
    private final EmployeeRepository employeeRepository;

    private final ImageUtil imageUtil;


    @Override
    public List<Employee> getAll() {
        return employeeRepository.findAll();
    }

    @Override
    public Employee getById(int employeeId) {
        return employeeRepository.findById(employeeId).orElse(null);
    }

    @Override
    @Transactional
    public Employee create(EmployeeDTO employeeDTO) {
        Employee employee = new Employee();

        mapToEntity(employee, employeeDTO);

        // Xử lý ảnh
        if (employeeDTO.getAvatarFile() != null) {
            try {
                employee.setAvatar(imageUtil.storeImage(employeeDTO.getAvatarFile()));
            } catch (IOException ex) {
                employee.setAvatar(null);
            }
        }

        return employeeRepository.save(employee);
    }

    @Override
    @Transactional
    public Employee update(EmployeeDTO employeeDTO, int employeeId) {
        Employee employee = employeeRepository.findById(employeeId).orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy nhân viên muốn sửa!"));

        mapToEntity(employee, employeeDTO);

        // Xử lý ảnh
        if (employeeDTO.getAvatarFile() != null) {
            try {
                employee.setAvatar(imageUtil.storeImage(employeeDTO.getAvatarFile()));
            } catch (IOException ex) {
                employee.setAvatar(null);
            }
        }
        return employeeRepository.save(employee);
    }

    @Override
    public void delete(int employeeId) {
        Employee employee = employeeRepository.findById(employeeId).orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy nhân viên muốn sửa!"));

        employeeRepository.deleteById(employeeId);
    }


    public void mapToEntity(Employee employee, EmployeeDTO employeeDTO) {

        // Gán thông tin nhân viên
        employee.setEmail(employeeDTO.getEmail());
        employee.setPhone(employeeDTO.getPhone());
        employee.setFullName(employeeDTO.getFullName());
        employee.setAddress(employeeDTO.getAddress());
        employee.setBirth(employeeDTO.getBirth());
        employee.setGender(employeeDTO.getGender());


    }
}
