package org.kltn.postconnector.api.service.impl;

import lombok.RequiredArgsConstructor;
import org.kltn.postconnector.api.domain.Area;
import org.kltn.postconnector.api.dto.AreaDTO;
import org.kltn.postconnector.api.exception.ResourceNotFoundException;
import org.kltn.postconnector.api.repository.AreaRepository;
import org.kltn.postconnector.api.service.AreaService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AreaServiceImpl implements AreaService {
    private final AreaRepository areaRepository;

    @Override
    public List<Area> getAll() {
        return areaRepository.findAll();
    }

    @Override
    public Area getById(int id) {
        return areaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy khu vực cần tìm"));
    }

    @Override
    public Area create(AreaDTO areaDTO) {
        Area area = new Area();
        area.setName(areaDTO.getName());
        return areaRepository.save(area);
    }

    @Override
    public Area update(AreaDTO areaDTO, int id) {
        Area area = areaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy khu vực muốn sửa"));
        area.setName(areaDTO.getName());
        return areaRepository.save(area);
    }

    @Override
    public void delete(int id) {
        Area area = areaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy khu vực muốn xóa"));
        areaRepository.delete(area);
    }
}
