package org.kltn.postconnector.api.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.kltn.postconnector.api.domain.Material;
import org.kltn.postconnector.api.dto.MaterialDTO;
import org.kltn.postconnector.api.service.MaterialService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/materials")
public class MaterialController {

    private final MaterialService materialService;

    @GetMapping("/all")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public List<Material> getAllMaterial() {
        return materialService.getAll();
    }

    ;

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public Material getMaterialById(@PathVariable(name = "id") int id) {
        return materialService.getById(id);
    }

    @PostMapping("/create")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public Material createMaterial(@Valid @RequestBody MaterialDTO materialDTO) {
        return materialService.create(materialDTO);
    }

    @PutMapping("/update/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public Material updateMaterial(@Valid @RequestBody MaterialDTO materialDTO, @PathVariable(name = "id") int id) {
        return materialService.update(materialDTO, id);
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public void deleteMaterial(@PathVariable(name = "id") int id) {
        materialService.delete(id);
    }
}
