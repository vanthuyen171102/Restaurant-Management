package org.kltn.postconnector.api.exception;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ErrorObject {
    private Integer code;
    private String message;

    public ErrorObject() {
    }

    ;

    public ErrorObject(Integer code, String message) {
        this.code = code;
        this.message = message;
    }
}
