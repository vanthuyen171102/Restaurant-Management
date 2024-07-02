package org.kltn.postconnector.api.controller;

import org.kltn.postconnector.api.payload.response.ResponseObject;
import org.kltn.postconnector.api.utils.ImageUtil;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
public class ImageController {

    private final ImageUtil imageUtil;

    public ImageController(ImageUtil imageUtil) {
        this.imageUtil = imageUtil;
    }

    @GetMapping("api/v1/image/{imageSrc}")
    public ResponseEntity<byte[]> getImage(@PathVariable String imageSrc) throws IOException {
        Resource imageResource = imageUtil.loadImageAsResource(imageSrc);

        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_JPEG)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + imageResource.getFilename() + "\"")
                .body(imageResource.getInputStream().readAllBytes());
    }

    @PostMapping("/api/image")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ResponseObject<String>> uploadImage(@RequestParam MultipartFile imageFile) throws IOException {
        return ResponseEntity.ok(ResponseObject.<String>builder()
                .code(HttpStatus.CREATED.value())
                .message("Thêm ảnh thành công!")
                .data(imageUtil.storeImage(imageFile))
                .build());
    }
}
