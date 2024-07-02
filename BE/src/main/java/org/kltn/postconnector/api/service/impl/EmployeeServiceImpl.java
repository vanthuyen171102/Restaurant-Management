package org.kltn.postconnector.api.service.impl;

import lombok.RequiredArgsConstructor;
import org.kltn.postconnector.api.domain.Employee;
import org.kltn.postconnector.api.dto.EmployeeDTO;
import org.kltn.postconnector.api.exception.BadRequestException;
import org.kltn.postconnector.api.exception.ResourceNotFoundException;
import org.kltn.postconnector.api.repository.EmployeeRepository;
import org.kltn.postconnector.api.repository.RoleRepository;
import org.kltn.postconnector.api.service.EmployeeService;
import org.kltn.postconnector.api.utils.ImageUtil;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class EmployeeServiceImpl implements EmployeeService {
    private final EmployeeRepository employeeRepository;
    private final RoleRepository roleRepository;
    private final ImageUtil imageUtil;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();


    @Override
    public List<Employee> getAll() {
        return employeeRepository.findAllNotDeleted();
    }

    @Override
    public Page<Employee> getPagedEmployee(int page) {
        return employeeRepository.findAllNotDeleted(PageRequest.of(page - 1, 10));
    }

    @Override
    public Employee getById(int employeeId) {
        return employeeRepository.findByIdNotDelete(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy nhân sự!"));
    }

    @Override
    public Employee getByEmail(String email) {
        return employeeRepository.findByEmail(email)
                .orElse(null);
    }

    @Override
    @Transactional
    public Employee create(EmployeeDTO.Create employeeDTO) {
        Optional<Employee> existingEmployeeOptional = employeeRepository.findByEmail(employeeDTO.getEmail());

        if (existingEmployeeOptional.isPresent()) {
            throw new BadRequestException("Email: %s đã được sử dụng".formatted(employeeDTO.getEmail()));
        }

        Employee employee = Employee.builder()
                .email(employeeDTO.getEmail())
                .fullName(employeeDTO.getFullName())
                .password(encoder.encode(employeeDTO.getPassword()))
                .role(roleRepository.findById(employeeDTO.getRoleId()).orElseThrow(
                        () -> new ResourceNotFoundException("Không tìm thấy Role ID = %d".formatted(employeeDTO.getRoleId()))
                ))
                .address(employeeDTO.getAddress())
                .phone(employeeDTO.getPhone())
                .gender(employeeDTO.getGender())
                .birth(employeeDTO.getBirth())
                .avatar(employeeDTO.getAvatarFile() != null ? imageUtil.storeImage(employeeDTO.getAvatarFile()) : null)
                .build();

        return employeeRepository.save(employee);
    }

    @Override
    @Transactional
    public Employee update(EmployeeDTO.Update employeeDTO, int employeeId) {
        Employee employee = employeeRepository.findByIdNotDelete(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy nhân viên muốn sửa!"));

        if (employee.getRole().getName().equals("ADMIN")) {
            throw new BadRequestException("Không thể sửa tài khoản của Quản lý!");
        }

        if (!employee.getEmail().equals(employeeDTO.getEmail())) {
            Optional<Employee> existingEmployeeOptional = employeeRepository.findByEmail(employeeDTO.getEmail());

            if (existingEmployeeOptional.isPresent()) {
                throw new BadRequestException("Email: %s đã được sử dụng".formatted(employeeDTO.getEmail()));
            }
        }


        employee.setEmail(employeeDTO.getEmail());
        employee.setFullName(employeeDTO.getFullName());
        employee.setPassword(StringUtils.hasText(employeeDTO.getPassword()) ? encoder.encode(employeeDTO.getPassword()) : employee.getPassword());
        employee.setRole(roleRepository.findById(employeeDTO.getRoleId()).orElseThrow(
                () -> new ResourceNotFoundException("Không tìm thấy Role ID = %d".formatted(employeeDTO.getRoleId()))
        ));
        employee.setAddress(employeeDTO.getAddress());
        employee.setPhone(employeeDTO.getPhone());
        employee.setGender(employeeDTO.getGender());
        employee.setBirth(employeeDTO.getBirth());
        employee.setAvatar(employeeDTO.getAvatarFile() != null ? imageUtil.storeImage(employeeDTO.getAvatarFile()) : employee.getAvatar());

        return employeeRepository.save(employee);
    }

    @Override
    @Transactional
    public void delete(int employeeId) {
        Employee employee = employeeRepository.findByIdNotDelete(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy nhân viên muốn xóa!"));

        if (employee.getRole().getName().equals("ADMIN")) {
            throw new BadRequestException("Không thể xóa tài khoản của Quản lý!");
        }
        employee.setDeleted(true);
        employeeRepository.save(employee);
    }

    @Override
    @Transactional
    public void block(int employeeId) {
        Employee employee = employeeRepository.findByIdNotDelete(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy nhân viên muốn xóa!"));
        if (employee.getRole().getName().equals("ADMIN")) {
            throw new BadRequestException("Không thể khóa tài khoản của Quản lý!");
        }
        employee.setBlocked(true);
        employeeRepository.save(employee);
    }

    @Override
    @Transactional
    public void unBlock(int employeeId) {
        Employee employee = employeeRepository.findByIdNotDelete(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy nhân viên muốn xóa!"));

        employee.setBlocked(false);

        employeeRepository.save(employee);
    }


}
