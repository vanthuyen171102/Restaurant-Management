package org.kltn.postconnector.api.service.impl;

import lombok.RequiredArgsConstructor;
import org.kltn.postconnector.api.dto.UserDTO;
import org.kltn.postconnector.api.exception.BadRequestException;
import org.kltn.postconnector.api.exception.ResourceNotFoundException;
import org.kltn.postconnector.api.model.Employee;
import org.kltn.postconnector.api.model.UserEntity;
import org.kltn.postconnector.api.repository.UserRepository;
import org.kltn.postconnector.api.service.EmployeeService;
import org.kltn.postconnector.api.service.UserService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    private final EmployeeService employeeService;


    @Override
    public List<UserEntity> getAll() {
        return userRepository.findAll();
    }

    @Override
    public UserEntity getById(int userId) {
        return userRepository.findById(userId).orElse(null);
    }

    @Override
    public UserEntity findByUsername(String username) {
        return userRepository.findByUsername(username).orElse(null);
    }

    public boolean isUsernameExist(String username) {
        UserEntity existingUser = userRepository.findByUsername(username).orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tài khoản!"));
        return existingUser != null;
    }

    @Override
    public UserEntity create(UserDTO userDTO) {
        if (isUsernameExist(userDTO.getUsername()))
            throw new BadRequestException("Tên đăng nhập đã được sử dụng!");

        UserEntity user = new UserEntity();
        mapDTOToEntity(user, userDTO);
        return userRepository.save(user);

    }

    @Override
    public UserEntity update(UserDTO userDTO, int userId) {
        UserEntity user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tài khoản!"));
        // Kiểm tra tên đăng nhập có thay đổi
        if(!user.getUsername().equals(userDTO.getUsername())) {
            if (isUsernameExist(userDTO.getUsername()))
                throw new BadRequestException("Tên đăng nhập đã được sử dụng!");
        }

        mapDTOToEntity(user, userDTO);

        return userRepository.save(user);
    }

    @Override
    public void delete(int userId) {
        UserEntity user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tài khoản!"));
        userRepository.deleteById(userId);
    }

    public void mapDTOToEntity(UserEntity user,UserDTO userDTO) {

        // Gán các giá trị
        user.setUsername(userDTO.getUsername());

        // Mã hóa mật khẩu
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));


        user.setRole(userDTO.getRole());

        // Gán Employee
        Employee employee = employeeService.getById(userDTO.getEmployeeId());
        if(employee == null) {
            throw new ResourceNotFoundException("Không tìm thấy nhân sự đã chọn!");
        }
        user.setEmployee(employee);

    }
}
