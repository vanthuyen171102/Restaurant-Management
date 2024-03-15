package org.kltn.postconnector.api.security;

import lombok.Getter;
import lombok.Setter;
import org.kltn.postconnector.api.model.Employee;
import org.kltn.postconnector.api.model.UserEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

public class CustomUserDetails implements UserDetails {

    private final UserEntity userEntity;

    @Getter
    @Setter
    private String avatar = "";

    @Getter
    @Setter
    private String fullName = "";

    public CustomUserDetails(UserEntity userEntity) {
        this.userEntity = userEntity;
        Employee employee  = userEntity.getEmployee();
        if(employee != null) {
            this.avatar = employee.getAvatar().getName();
            this.fullName = employee.getFullName();
        }
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singleton(new SimpleGrantedAuthority(userEntity.getRole().toString()));
    }

    @Override
    public String getPassword() {
        return userEntity.getPassword();
    }

    @Override
    public String getUsername() {
        return userEntity.getUsername();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
