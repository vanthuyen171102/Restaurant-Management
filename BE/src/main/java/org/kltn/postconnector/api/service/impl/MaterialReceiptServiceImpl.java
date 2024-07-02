package org.kltn.postconnector.api.service.impl;

import lombok.RequiredArgsConstructor;
import org.kltn.postconnector.api.domain.Material;
import org.kltn.postconnector.api.domain.MaterialReceipt;
import org.kltn.postconnector.api.domain.MaterialReceiptDetail;
import org.kltn.postconnector.api.domain.Supplier;
import org.kltn.postconnector.api.dto.MaterialReceiptDTO;
import org.kltn.postconnector.api.exception.BadRequestException;
import org.kltn.postconnector.api.exception.ResourceNotFoundException;
import org.kltn.postconnector.api.repository.EmployeeRepository;
import org.kltn.postconnector.api.repository.MaterialReceiptRepository;
import org.kltn.postconnector.api.repository.MaterialRepository;
import org.kltn.postconnector.api.repository.SupplierRepository;
import org.kltn.postconnector.api.security.CustomUserDetails;
import org.kltn.postconnector.api.service.MaterialReceiptService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MaterialReceiptServiceImpl implements MaterialReceiptService {
    private final MaterialReceiptRepository materialReceiptRepository;
    private final SupplierRepository supplierRepository;
    private final MaterialRepository materialRepository;
    private final EmployeeRepository employeeRepository;

    @Override
    public List<MaterialReceipt> getAll() {
        return materialReceiptRepository.findAll();
    }

    @Override
    public MaterialReceipt getById(int id) {
        return materialReceiptRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy biên lai muốn tìm!"));
    }

    @Override
    @Transactional
    public MaterialReceipt create(MaterialReceiptDTO materialReceiptDTO, CustomUserDetails userDetails) {
        MaterialReceipt receipt = new MaterialReceipt();
        Supplier supplier = supplierRepository.findById(materialReceiptDTO.getSupplierId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy NCC!"));

        receipt.setSupplier(supplier);

        List<MaterialReceiptDetail> receiptItems = materialReceiptDTO.getReceiptItems().stream()
                .map(item -> {
                    Material material = materialRepository.findById(item.getMaterialId())
                            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy nguyên liệu muốn nhập!"));
                    return MaterialReceiptDetail.builder()
                            .material(material)
                            .receipt(receipt)
                            .price(item.getPrice())
                            .quantity(item.getQuantity())
                            .build();
                })
                .toList();

        for (MaterialReceiptDetail newItem : receiptItems) {
            Material material = newItem.getMaterial();
            material.setStock(material.getStock() + newItem.getQuantity());
            if (material.getPrice() < newItem.getPrice())
                material.setPrice(newItem.getPrice());
            materialRepository.save(material);
        }

        receipt.setItems(receiptItems);
        receipt.setNote(materialReceiptDTO.getNote());
        receipt.setPaid(materialReceiptDTO.getPaid());
        receipt.setEmployee(employeeRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new BadRequestException("Không tìm thấy nhân viên tạo biên lai!")));

        return materialReceiptRepository.save(receipt);
    }

    @Override
    public Page<MaterialReceipt> getPagedReceipt(int page, int limit) {
        return materialReceiptRepository.findAll(PageRequest.of(page - 1, limit));
    }

    @Override
    public MaterialReceipt update(MaterialReceiptDTO materialReceiptDTO, int id, CustomUserDetails userDetails) {
        MaterialReceipt receipt = materialReceiptRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy biên lai muốn sửa!"));

        Supplier supplier = supplierRepository.findById(materialReceiptDTO.getSupplierId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy NCC!"));

        receipt.setSupplier(supplier);

        // Map mới cho các chi tiết biên lai nhập nguyên liệu từ DTO
        List<MaterialReceiptDetail> newReceiptItems = materialReceiptDTO.getReceiptItems().stream()
                .map(item -> {
                    Material material = materialRepository.findById(item.getMaterialId())
                            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy nguyên liệu muốn nhập!"));

                    return MaterialReceiptDetail.builder()
                            .material(material)
                            .receipt(receipt)
                            .price(item.getPrice())
                            .quantity(item.getQuantity())
                            .build();
                })
                .toList();

        // Khôi phục tồn kho từ các chi tiết biên lai cũ
        for (MaterialReceiptDetail oldItem : receipt.getItems()) {
            Material material = oldItem.getMaterial();
            material.setStock(material.getStock() - oldItem.getQuantity());

            materialRepository.save(material);
        }

        // Cập nhật biên lai với các chi tiết mới
        receipt.setItems(newReceiptItems);

        // Cập nhật tồn kho từ các chi tiết biên lai mới
        for (MaterialReceiptDetail newItem : newReceiptItems) {
            Material material = newItem.getMaterial();
            material.setStock(material.getStock() + newItem.getQuantity());
            if (material.getPrice() < newItem.getPrice())
                material.setPrice(newItem.getPrice());
            materialRepository.save(material);
        }

        receipt.setNote(materialReceiptDTO.getNote());
        receipt.setPaid(materialReceiptDTO.getPaid());

        receipt.preUpdate();

        return materialReceiptRepository.save(receipt);
    }

    @Override
    @Transactional
    public void delete(int id) {
        MaterialReceipt receipt = materialReceiptRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy biên lai muốn xóa!"));

        for (MaterialReceiptDetail item : receipt.getItems()) {
            Material material = item.getMaterial();
            if (material.getStock() > item.getQuantity())
                material.setStock(material.getStock() - item.getQuantity());
            else material.setStock(0);
            materialRepository.save(material);
        }
        materialReceiptRepository.deleteAllItemsInReceipt(receipt.getId());
        materialReceiptRepository.delete(receipt);
    }
}
