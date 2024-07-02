package org.kltn.postconnector.api.service;

import org.kltn.postconnector.api.domain.Supplier;
import org.kltn.postconnector.api.dto.SupplierDTO;
import org.kltn.postconnector.api.dto.SupplierOption;

import java.util.List;

public interface SupplierService {

    Supplier getById(int id);

    List<Supplier> getAll();

    Supplier create(SupplierDTO supplierDTO);

    Supplier update(SupplierDTO supplierDTO, int id);

    void delete(int id);

    List<SupplierOption> getSupplierOptions();
}
