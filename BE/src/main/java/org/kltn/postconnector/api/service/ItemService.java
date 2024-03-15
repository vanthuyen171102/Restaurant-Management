package org.kltn.postconnector.api.service;

import org.kltn.postconnector.api.dto.ItemDTO;
import org.kltn.postconnector.api.model.Item;

import java.util.List;

public interface ItemService {

    boolean isSlugExist(String slug);

    List<Item> getAll() ;

    Item getById(int itemId);

    Item getBySlug(String slug);

    Item create(ItemDTO itemDTO);

    Item update(ItemDTO itemDTO, int itemId);

    void delete(int itemId);
}
