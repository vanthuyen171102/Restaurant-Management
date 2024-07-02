package org.kltn.postconnector.api.repository;

import org.kltn.postconnector.api.domain.MaterialReceipt;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InventoryReceiptRepository extends JpaRepository<MaterialReceipt, Integer> {
}
