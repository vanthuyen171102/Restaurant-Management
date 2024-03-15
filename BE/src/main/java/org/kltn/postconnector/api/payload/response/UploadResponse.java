package org.kltn.postconnector.api.payload.response;

import lombok.Data;

@Data
public class UploadResponse {
    private String path;

    public UploadResponse(String fileName) {
        this.path = "/uploads/" + fileName;
    }
}
