package org.kltn.postconnector.api.service;

import org.kltn.postconnector.api.domain.Item;
import org.kltn.postconnector.api.dto.ItemDTO;
import org.springframework.data.domain.Page;

import java.util.List;

public interface ItemService {

    List<Item> getAll();

    Page<Item> getPagedItem(int page);

    Page<Item> getPagedItem(int page, Integer catId, String keyword);


    List<Item> getEnableItem();

    Item getById(int itemId);

    Item create(ItemDTO itemDTO);

    Item update(ItemDTO itemDTO, int itemId);

    Item updateStock(int stock, int itemId);

    void delete(int itemId);
}
