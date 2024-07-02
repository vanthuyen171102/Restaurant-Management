package org.kltn.postconnector.api.repository;

import org.kltn.postconnector.api.domain.TableOrder;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TableOrderRepository extends JpaRepository<TableOrder, Integer> {
}
