package org.kltn.postconnector.api.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.kltn.postconnector.api.dto.UserDTO;
import org.kltn.postconnector.api.model.Order;
import org.kltn.postconnector.api.model.UserEntity;
import org.kltn.postconnector.api.payload.response.ResponseObject;
import org.kltn.postconnector.api.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;


    @GetMapping()
    public ResponseEntity<ResponseObject<List<UserEntity>>> getAllUser() {
        return ResponseEntity.ok(ResponseObject.<List<UserEntity>>builder()
                .code(HttpStatus.OK.value())
                .data(userService.getAll())
                .build());
    }

    @GetMapping("{id}")
    public ResponseEntity<ResponseObject<UserEntity>> getUser(@PathVariable("id") int id) {
        return ResponseEntity.ok(ResponseObject.<UserEntity>builder()
                .code(HttpStatus.OK.value())
                .data(userService.getById(id))
                .build());
    }

    @PostMapping()
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<ResponseObject<?>> createUser(@Valid @RequestBody UserDTO userDTO) {
        return ResponseEntity.ok(ResponseObject.<UserEntity>builder()
                .code(HttpStatus.CREATED.value())
                        .message("Thêm tài khoản thành công!")
                .data(userService.create(userDTO))
                .build());
    }

    @PutMapping("{id}")
    public ResponseEntity<ResponseObject<UserEntity>> updateUser(@Valid @RequestBody UserDTO userDTO, @PathVariable("id") int id) {
        return ResponseEntity.ok(ResponseObject.<UserEntity>builder()
                .code(HttpStatus.OK.value())
                .message("Sửa tài khoản thành công!")
                .data(userService.update(userDTO, id))
                .build());
    }

    @DeleteMapping("{id}")
    public ResponseEntity<?> deleteUser(@PathVariable("id") int id) {
        userService.delete(id);

        return ResponseEntity.ok(ResponseObject.<Order>builder()
                .code(HttpStatus.OK.value())
                .message("Xóa tài khoản thành công!")
                .build());
    }

}
