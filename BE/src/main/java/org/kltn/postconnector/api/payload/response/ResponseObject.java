package org.kltn.postconnector.api.payload.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ResponseObject<T> {
    private  int code;
    private String message;
    private  T data;
}
