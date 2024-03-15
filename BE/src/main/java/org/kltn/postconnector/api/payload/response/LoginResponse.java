package org.kltn.postconnector.api.payload.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponse {
    private String avatar;
    private String name;
    private String token;
}
