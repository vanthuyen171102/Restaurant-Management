package org.kltn.postconnector.api.security;

import org.kltn.postconnector.api.exception.InvalidCredentialsException;
import org.kltn.postconnector.api.model.UserEntity;
import org.kltn.postconnector.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService  {

    private final UserRepository userRepository;


    @Autowired
    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) {
        UserEntity userEntity = userRepository.findByUsername(username).orElseThrow(() -> new InvalidCredentialsException("Tên đăng nhập không tồn tại"));

        return new CustomUserDetails(userEntity);
    }
}