package org.kltn.postconnector.api.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.kltn.postconnector.api.domain.Supplier;
import org.kltn.postconnector.api.dto.SupplierDTO;
import org.kltn.postconnector.api.service.SupplierService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/suppliers")
@RequiredArgsConstructor
public class SupplierController {
    private final SupplierService supplierService;

    @GetMapping("/all")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public List<Supplier> getAllSuppliers() {
        return supplierService.getAll();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public Supplier getSupplierById(@PathVariable(name = "id") int id) {
        return supplierService.getById(id);
    }

    @PostMapping("/create")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public Supplier createSupplier(@Valid @RequestBody SupplierDTO supplierDTO) {
        return supplierService.create(supplierDTO);
    }

    @PutMapping("/update/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public Supplier updateSupplier(@Valid @RequestBody SupplierDTO supplierDTO,
                                   @PathVariable(name = "id") int id) {
        return supplierService.update(supplierDTO, id);
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public void deleteSupplier(@PathVariable(name = "id") int id) {
        supplierService.delete(id);
    }
}
