package org.kltn.postconnector.api.service;

import org.kltn.postconnector.api.model.Image;

import java.util.List;

public interface ImageService {
    List<Image> getAll();

    Image getById(long id);

    Image create(String name);

    Image update(String name, long imageId);

    void delete(long imageId);

}
