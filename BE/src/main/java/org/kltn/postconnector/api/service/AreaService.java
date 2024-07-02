package org.kltn.postconnector.api.service;

import org.kltn.postconnector.api.domain.Area;
import org.kltn.postconnector.api.dto.AreaDTO;

import java.util.List;

public interface AreaService {
    List<Area> getAll();

    Area getById(int id);

    Area create(AreaDTO areaDTO);

    Area update(AreaDTO areaDTO, int id);

    void delete(int id);
}
