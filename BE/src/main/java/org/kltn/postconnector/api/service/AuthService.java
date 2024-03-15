package org.kltn.postconnector.api.service;

import org.kltn.postconnector.api.dto.LoginDTO;
import org.kltn.postconnector.api.payload.response.LoginResponse;

public interface AuthService {
    LoginResponse authenticate(LoginDTO loginDTO);
}
