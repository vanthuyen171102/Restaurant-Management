package org.kltn.postconnector.api.controller;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.kltn.postconnector.api.domain.MaterialReceipt;
import org.kltn.postconnector.api.dto.MaterialReceiptDTO;
import org.kltn.postconnector.api.payload.response.PagedResponse;
import org.kltn.postconnector.api.security.CustomUserDetails;
import org.kltn.postconnector.api.service.MaterialReceiptService;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/material-receipts")
public class MaterialReceiptController {
    private final MaterialReceiptService materialReceiptService;

    @GetMapping("/all")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'STOCKER')")
    public List<MaterialReceipt> getAll() {
        return materialReceiptService.getAll();
    }

    @GetMapping("")
    public PagedResponse<MaterialReceipt> getPagedReceipt(@RequestParam(name = "page", defaultValue = "1") @Min(1) int page,
                                                          @RequestParam(name = "limit", defaultValue = "10") @Min(5) int limit) {
        Page<MaterialReceipt> pagedReceipt = materialReceiptService.getPagedReceipt(page, limit);
        return PagedResponse.<MaterialReceipt>builder()
                .total(pagedReceipt.getTotalElements())
                .currentPage(pagedReceipt.getNumber() + 1)
                .totalPage(pagedReceipt.getTotalPages())
                .items(pagedReceipt.getContent())
                .build();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'STOCKER')")
    public MaterialReceipt getById(@PathVariable(name = "id") int id) {
        return materialReceiptService.getById(id);
    }

    @PostMapping("/create")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'STOCKER')")
    public MaterialReceipt create(@Valid @RequestBody MaterialReceiptDTO materialReceiptDTO, @AuthenticationPrincipal CustomUserDetails userDetails) {
        return materialReceiptService.create(materialReceiptDTO, userDetails);
    }

    @PutMapping("/update/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'STOCKER')")
    public MaterialReceipt update(@Valid @RequestBody MaterialReceiptDTO materialReceiptDTO, @PathVariable(name = "id") int id,
                                  @AuthenticationPrincipal CustomUserDetails userDetails) {
        return materialReceiptService.update(materialReceiptDTO, id, userDetails);
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'STOCKER')")
    public void delete(@PathVariable(name = "id") int id) {
        materialReceiptService.delete(id);
    }
}
