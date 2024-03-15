package org.kltn.postconnector.api.service.impl;

import org.kltn.postconnector.api.exception.ResourceNotFoundException;
import org.kltn.postconnector.api.model.Image;
import org.kltn.postconnector.api.repository.ImageRepository;
import org.kltn.postconnector.api.service.ImageService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ImageServiceImpl implements ImageService {

    private final ImageRepository imageRepository;

    public ImageServiceImpl(ImageRepository imageRepository) {
        this.imageRepository = imageRepository;
    }

    @Override
    public List<Image> getAll() {
        return imageRepository.findAll();
    }

    @Override
    public Image getById(long id) {
        return imageRepository.findById(id).orElse(null);
    }

    @Override
    public Image create(String name) {
        Image image = new Image();
        image.setName(name);
        return imageRepository.save(image);
    }

    @Override
    public Image update(String name, long imageId) {
        Image image = imageRepository.findById(imageId).orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy ảnh cần sửa!"));

        return imageRepository.save(image);
    }

    @Override
    public void delete(long imageId) {
        Image image = imageRepository.findById(imageId).orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy ảnh cần sửa!"));
        imageRepository.deleteById(imageId);
    }
}
