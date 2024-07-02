package org.kltn.postconnector.api.utils;

import org.kltn.postconnector.api.exception.BadRequestException;
import org.kltn.postconnector.api.exception.ResourceNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;

@Component
public class ImageUtil {

    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    private final Path imageStorageLocation;

    public ImageUtil() {
        // Tạo thư mục lưu trữ ảnh ( nếu chưa tồn tại )
        this.imageStorageLocation = Path.of("src/main/resources/static/images").toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.imageStorageLocation);
        } catch (IOException e) {
            throw new RuntimeException("Không thể tạo thư mục lưu trữ ảnh!", e);
        }

    }


    public void validateImage(MultipartFile file) {
        // Kiểm tra tên file
        String fileName = file.getOriginalFilename();
        if (fileName == null || fileName.isEmpty()) {
            throw new BadRequestException("Tên file không được để trống");
        }

        // Kiểm tra đuôi file (jpg, png, jpeg)
        String fileExtension = getFileExtension(fileName);
        if (!checkFileExtension(fileExtension)) {
            throw new BadRequestException("File ảnh không đúng định dạng");
        }

    }

    public String getFileExtension(String fileName) {
        int lastIndexOf = fileName.lastIndexOf(".");
        return fileName.substring(lastIndexOf + 1);
    }

    public boolean checkFileExtension(String fileExtension) {
        List<String> extensions = new ArrayList<>(List.of("png", "jpg", "jpeg", "pdf"));
        return extensions.contains(fileExtension.toLowerCase());
    }

    public String storeImage(MultipartFile file) {
        try {

            // Validate ảnh
            validateImage(file);
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path targetLocation = this.imageStorageLocation.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            return fileName;

        } catch (IOException e) {
            logger.warn("Lưu ảnh không thành công!");
            return null;
        }
    }

    public Resource loadImageAsResource(String fileName) throws MalformedURLException {
        Path filePath = this.imageStorageLocation.resolve(fileName).normalize();
        Resource resource = new UrlResource(filePath.toUri());

        if (resource.exists()) {
            return resource;
        } else {
            throw new ResourceNotFoundException("Không thể tìm thấy ảnh: " + fileName);
        }
    }
}
