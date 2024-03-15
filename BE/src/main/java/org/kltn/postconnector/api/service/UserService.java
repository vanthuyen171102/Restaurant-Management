package org.kltn.postconnector.api.service;

import org.kltn.postconnector.api.dto.UserDTO;
import org.kltn.postconnector.api.model.UserEntity;

import java.util.List;

public interface UserService {

    List<UserEntity> getAll();
    UserEntity findByUsername(String username);

    boolean isUsernameExist(String username);

    UserEntity getById(int userId);

    UserEntity create(UserDTO account);

    UserEntity update(UserDTO account, int userId);

    void delete(int userId);
}
