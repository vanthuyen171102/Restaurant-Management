package org.kltn.postconnector.api.service.impl;

import lombok.RequiredArgsConstructor;
import org.kltn.postconnector.api.domain.Material;
import org.kltn.postconnector.api.dto.MaterialDTO;
import org.kltn.postconnector.api.dto.MaterialOption;
import org.kltn.postconnector.api.exception.ResourceNotFoundException;
import org.kltn.postconnector.api.repository.MaterialRepository;
import org.kltn.postconnector.api.service.MaterialService;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class MaterialServiceImpl implements MaterialService {

    private final MaterialRepository materialRepository;

    @Override
    public List<Material> getAll() {
        return materialRepository.findAllNotDeleted();
    }

    @Override
    public Material getById(int id) {
        return materialRepository.findByIdNotDeleted(id).orElseThrow(() ->
                new ResourceNotFoundException("Không tìm thấy nguyên vật liệu muốn tìm!"));
    }

    @Override
    public Material create(MaterialDTO materialDTO) {
        return materialRepository.save(Material.builder()
                .name(materialDTO.getName())
                .unit(materialDTO.getUnit())
                .stock(materialDTO.getPrice())
                .price(materialDTO.getPrice())
                .build());
    }

    @Override
    public Material update(MaterialDTO materialDTO, int id) {
        Material material = materialRepository.findByIdNotDeleted(id).orElseThrow(() ->
                new ResourceNotFoundException("Không tìm thấy nguyên vật liệu muốn sửa!"));
        material.setName(materialDTO.getName());
        material.setStock(materialDTO.getStock());
        material.setUnit(materialDTO.getUnit());
        material.setPrice(materialDTO.getPrice());

        return materialRepository.save(material);
    }

    @Override
    public void delete(int id) {
        Material material = materialRepository.findByIdNotDeleted(id).orElseThrow(() ->
                new ResourceNotFoundException("Không tìm thấy nguyên vật liệu muốn xóa!"));
        material.setDeleted(true);
        materialRepository.save(material);
    }

    @Override
    public List<MaterialOption> getMaterialOptions() {
        return materialRepository.findAll().stream()
                .map(material -> new MaterialOption(material.getId(), material.getName()))
                .toList();
    }
}
