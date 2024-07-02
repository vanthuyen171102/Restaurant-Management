package org.kltn.postconnector.api.service.impl;

import lombok.RequiredArgsConstructor;
import org.kltn.postconnector.api.domain.Item;
import org.kltn.postconnector.api.dto.ItemDTO;
import org.kltn.postconnector.api.event.StockUpdateEvent;
import org.kltn.postconnector.api.exception.ResourceNotFoundException;
import org.kltn.postconnector.api.repository.CategoryRepository;
import org.kltn.postconnector.api.repository.ItemRepository;
import org.kltn.postconnector.api.service.ItemService;
import org.kltn.postconnector.api.utils.ImageUtil;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ItemServiceImpl implements ItemService {

    private final ItemRepository itemRepository;
    private final CategoryRepository categoryRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final ImageUtil imageUtil;

    @Override
    public List<Item> getAll() {
        return itemRepository.findAllNotDeleted();
    }

    @Override
    public Page<Item> getPagedItem(int page) {
        return itemRepository.findAllNotDeleted(PageRequest.of(page, 10));
    }

    @Override
    public Page<Item> getPagedItem(int page, Integer catId, String keyword) {
        return itemRepository.findByKeywordAndCategory(keyword, catId, PageRequest.of(page, 10));
    }

    @Override
    public List<Item> getEnableItem() {
        return itemRepository.findAllNotDeleted().stream()
                .filter(item -> !item.isDisable())
                .collect(Collectors.toList());
    }

    @Override
    public Item getById(int itemId) {
        return itemRepository.findByIdNotDeleted(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy món ăn muốn tìm!"));
    }


    @Override
    public Item create(ItemDTO itemDTO) {


        Item item = Item.builder()
                .title(itemDTO.getTitle())
                .thumb(imageUtil.storeImage(itemDTO.getThumbFile()))
                .price(itemDTO.getPrice())
                .capitalPrice(itemDTO.getCapitalPrice())
                .cat(categoryRepository.findById(itemDTO.getCatId()).orElseThrow(() ->
                        new ResourceNotFoundException("Không tìm thấy danh mục đã chọn!")))
                .build();

        return itemRepository.save(item);
    }

    @Override
    public Item update(ItemDTO itemDTO, int itemId) {
        Item item = itemRepository.findByIdNotDeleted(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy món ăn muốn sửa!"));

        item.setTitle(itemDTO.getTitle());
        item.setPrice(itemDTO.getPrice());
        item.setCapitalPrice(itemDTO.getCapitalPrice());
        item.setThumb(itemDTO.getThumbFile() != null ? imageUtil.storeImage(itemDTO.getThumbFile()) : item.getThumb());
        item.setCat(categoryRepository.findById(itemDTO.getCatId()).orElseThrow(() ->
                new ResourceNotFoundException("Không tìm thấy danh mục đã chọn!")));

        return itemRepository.save(item);
    }

    @Override
    public Item updateStock(int stock, int itemId) {
        Item item = itemRepository.findByIdNotDeleted(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy món ăn muốn cập nhật tồn!"));

        item.setStock(stock);

        Item updatedItem = itemRepository.save(item);

        messagingTemplate.convertAndSend("/topic/item/update-stock", StockUpdateEvent.builder()
                .id(updatedItem.getId()).stock(updatedItem.getStock()).build());

        return updatedItem;
    }

    @Override
    public void delete(int itemId) {
        Item item = itemRepository.findByIdNotDeleted(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy món ăn muốn xóa!"));

        item.setDeleted(true);
        itemRepository.save(item);
    }

}
