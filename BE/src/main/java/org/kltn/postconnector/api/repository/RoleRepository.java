package org.kltn.postconnector.api.repository;

import org.kltn.postconnector.api.domain.Role;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role, Integer> {
}
