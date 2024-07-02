package org.kltn.postconnector.api.service.impl;

import lombok.RequiredArgsConstructor;
import org.kltn.postconnector.api.domain.Supplier;
import org.kltn.postconnector.api.dto.SupplierDTO;
import org.kltn.postconnector.api.dto.SupplierOption;
import org.kltn.postconnector.api.exception.ResourceNotFoundException;
import org.kltn.postconnector.api.repository.SupplierRepository;
import org.kltn.postconnector.api.service.SupplierService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SupplierServiceImpl implements SupplierService {

    private final SupplierRepository supplierRepository;

    @Override
    public Supplier getById(int id) {
        return supplierRepository.findByIdNotDeleted(id).orElseThrow(() ->
                new ResourceNotFoundException("Không tìm thấy nhà cung cấp { ID = %d}".formatted(id)));
    }

    @Override
    public List<SupplierOption> getSupplierOptions() {
        return supplierRepository.findAllNotDeleted().stream()
                .map(supplier -> new SupplierOption(supplier.getId(), supplier.getName()))
                .toList();
    }

    @Override
    public List<Supplier> getAll() {
        return supplierRepository.findAllNotDeleted();
    }

    @Override
    public Supplier create(SupplierDTO supplierDTO) {
        return supplierRepository.save(Supplier.builder()
                .name(supplierDTO.getName())
                .email(supplierDTO.getEmail())
                .phone(supplierDTO.getPhone())
                .address(supplierDTO.getAddress()).build());
    }

    @Override
    public Supplier update(SupplierDTO supplierDTO, int id) {
        Supplier supplier = supplierRepository.findByIdNotDeleted(id).orElseThrow(() ->
                new ResourceNotFoundException("Không tìm thấy nhà cung cấp { ID = %d}".formatted(id)));

        supplier.setName(supplierDTO.getName());
        supplier.setEmail(supplierDTO.getEmail());
        supplier.setPhone(supplierDTO.getPhone());
        supplier.setAddress(supplierDTO.getAddress());


        return supplierRepository.save(supplier);
    }

    @Override
    public void delete(int id) {
        Supplier supplier = supplierRepository.findByIdNotDeleted(id).orElseThrow(() ->
                new ResourceNotFoundException("Không tìm thấy nhà cung cấp { ID = %d}".formatted(id)));

        supplier.setDeleted(true);

        supplierRepository.save(supplier);
    }
}
