package org.kltn.postconnector.api.repository;

import org.kltn.postconnector.api.model.TableEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TableRepository extends JpaRepository<TableEntity, Byte> {
}
