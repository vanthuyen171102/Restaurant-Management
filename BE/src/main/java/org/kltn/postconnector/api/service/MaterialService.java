package org.kltn.postconnector.api.service;

import org.kltn.postconnector.api.domain.Material;
import org.kltn.postconnector.api.dto.MaterialDTO;
import org.kltn.postconnector.api.dto.MaterialOption;

import java.util.List;

public interface MaterialService {
    List<Material> getAll();

    Material getById(int id);

    Material create(MaterialDTO materialDTO);

    Material update(MaterialDTO materialDTO, int id);

    void delete(int id);

    List<MaterialOption> getMaterialOptions();
}
