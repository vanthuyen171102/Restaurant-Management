package org.kltn.postconnector.api.repository;

import org.kltn.postconnector.api.domain.MaterialReceipt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface MaterialReceiptRepository extends JpaRepository<MaterialReceipt, Integer> {
    @Modifying
    @Transactional
    @Query("DELETE FROM MaterialReceiptDetail r WHERE r.receipt.id = :receiptId")
    void deleteAllItemsInReceipt(@Param("receiptId") int receiptId);
}
