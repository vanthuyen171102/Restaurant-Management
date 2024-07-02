package org.kltn.postconnector.api.repository;

import org.kltn.postconnector.api.domain.Employee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Integer> {

    @Query("SELECT e FROM Employee e WHERE e.isDeleted = false")
    List<Employee> findAllNotDeleted();

    @Query("SELECT DISTINCT e from Employee e WHERE e.isDeleted = false AND e.email = :email")
    Optional<Employee> findByEmail(String email);

    @Query("SELECT e FROM Employee e WHERE e.isDeleted = false")
    Page<Employee> findAllNotDeleted(PageRequest pageRequest);

    @Query("SELECT e FROM Employee e WHERE e.id = :id AND e.isDeleted = false")
    Optional<Employee> findByIdNotDelete(Integer id);
}
