package org.kltn.postconnector.api.controller;

import org.kltn.postconnector.api.model.Image;
import org.kltn.postconnector.api.payload.response.ResponseObject;
import org.kltn.postconnector.api.utils.ImageUtil;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
public class ImageController {

    private final ImageUtil imageUtil;

    public ImageController(ImageUtil imageUtil) {
        this.imageUtil = imageUtil;
    }

    @GetMapping("uploads/{imageName}")
    public ResponseEntity<byte[]> getImage(@PathVariable String imageName) throws IOException {
        Resource imageResource = imageUtil.loadImageAsResource(imageName);

        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_JPEG)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + imageResource.getFilename() + "\"")
                .body(imageResource.getInputStream().readAllBytes());
    }

    @PostMapping("/api/image")
    public ResponseEntity<ResponseObject<Image>> uploadImage(@RequestParam MultipartFile imageFile) throws IOException {
            return ResponseEntity.ok(ResponseObject.<Image>builder()
                    .code(HttpStatus.CREATED.value())
                    .message("Thêm ảnh thành công!")
                    .data(imageUtil.storeImage(imageFile))
                    .build());
    }
}
