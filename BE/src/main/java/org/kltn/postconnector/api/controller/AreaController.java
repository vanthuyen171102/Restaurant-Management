package org.kltn.postconnector.api.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.kltn.postconnector.api.domain.Area;
import org.kltn.postconnector.api.dto.AreaDTO;
import org.kltn.postconnector.api.service.AreaService;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1")
public class AreaController {
    private final AreaService areaService;


    @GetMapping("/area/all")
    @PreAuthorize("permitAll()")
    public List<Area> getAllArea() {
        return areaService.getAll();
    }

    @GetMapping("/area/{id}")
    @PreAuthorize("permitAll()")
    public Area getAreaById(@PathVariable(value = "id") Integer id) {
        return areaService.getById(id);
    }

    @PostMapping("/area/create")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public Area createArea(@Valid @RequestBody AreaDTO areaDTO) {
        return areaService.create(areaDTO);
    }

    @PutMapping("/area/update/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public Area updateArea(@Valid @RequestBody AreaDTO areaDTO, @PathVariable("id") int id) {
        return areaService.update(areaDTO, id);
    }

    @DeleteMapping("/area/delete/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public void deleteArea(@PathVariable("id") int id) {
        areaService.delete(id);
    }
}
