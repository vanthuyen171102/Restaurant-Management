package org.kltn.postconnector.api.service.impl;

import org.kltn.postconnector.api.dto.ItemDTO;
import org.kltn.postconnector.api.exception.ResourceNotFoundException;
import org.kltn.postconnector.api.model.Item;
import org.kltn.postconnector.api.repository.ItemRepository;
import org.kltn.postconnector.api.service.ItemService;
import org.kltn.postconnector.api.utils.ImageUtil;
import org.kltn.postconnector.api.utils.StringUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.Instant;
import java.util.List;

@Service
public class ItemServiceImpl implements ItemService {

    private final ItemRepository itemRepository;

    private final ImageUtil imageUtil;

    @Autowired
    public ItemServiceImpl(ItemRepository itemRepository, ImageUtil imageUtil) {
        this.itemRepository = itemRepository;
        this.imageUtil = imageUtil;
    }

    @Override
    public boolean isSlugExist(String slug) {
        return itemRepository.findBySlug(slug) != null;
    }

    @Override
    public List<Item> getAll() {
        return itemRepository.findAll();
    }

    @Override
    public Item getById(int itemId) {
        return itemRepository.findById(itemId).orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy món ăn muốn tìm!"));
    }

    @Override
    public Item getBySlug(String slug) {
        return itemRepository.findBySlug(slug).orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy món ăn muốn tìm!"));
    }

    @Override
    public Item create(ItemDTO itemDTO) {
        Item item = new Item();
        mapDTOToEntity(item, itemDTO);

        return itemRepository.save(item);
    }

    @Override
    public Item update(ItemDTO itemDTO, int itemId) {
        Item item = itemRepository.findById(itemId).orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy món ăn muốn sửa!"));

        mapDTOToEntity(item, itemDTO);

        return itemRepository.save(item);
    }

    @Override
    public void delete(int itemId) {
        Item item = itemRepository.findById(itemId).orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy món ăn muốn xóa!"));

        itemRepository.deleteById(itemId);
    }

    public void mapDTOToEntity(Item item, ItemDTO itemDTO) {
        // Gán thông tin món ăn
        item.setTitle(itemDTO.getTitle());
        item.setSummary(itemDTO.getSummary());
        item.setRecipe(itemDTO.getRecipe());
        item.setInstructions(itemDTO.getInstructions());
        item.setPrice(itemDTO.getPrice());
        item.setDisable(itemDTO.getDisable());
        item.setDiscount(itemDTO.getDiscount());

        // Xử lý Slug
        String slug = StringUtil.generateSlug(item.getTitle());
        if (!slug.equals(item.getSlug())) {
            if (isSlugExist(slug)) {
                slug += "-" + Instant.now().getEpochSecond();
            }
            item.setSlug(slug);
        }

        //Xử lý ảnh
        if (itemDTO.getThumbFile() != null) {
            try {
                item.setThumb(imageUtil.storeImage(itemDTO.getThumbFile()));
            } catch (IOException ex) {
                item.setThumb(null);
            }
        }
    }


}
