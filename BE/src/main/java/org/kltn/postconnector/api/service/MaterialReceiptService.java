package org.kltn.postconnector.api.service;

import org.kltn.postconnector.api.domain.MaterialReceipt;
import org.kltn.postconnector.api.dto.MaterialReceiptDTO;
import org.kltn.postconnector.api.security.CustomUserDetails;
import org.springframework.data.domain.Page;

import java.util.List;

public interface MaterialReceiptService {
    List<MaterialReceipt> getAll();

    MaterialReceipt getById(int id);

    MaterialReceipt create(MaterialReceiptDTO materialReceiptDTO, CustomUserDetails userDetails);

    MaterialReceipt update(MaterialReceiptDTO materialReceiptDTO, int id, CustomUserDetails userDetails);

    void delete(int id);

    Page<MaterialReceipt> getPagedReceipt(int page, int limit);
}
