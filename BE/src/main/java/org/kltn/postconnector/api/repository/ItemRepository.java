package org.kltn.postconnector.api.repository;

import org.kltn.postconnector.api.domain.Item;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ItemRepository extends JpaRepository<Item, Integer> {
    @Query("SELECT i FROM Item i WHERE i.isDeleted = false")
    List<Item> findAllNotDeleted();

    @Query("SELECT i FROM Item i WHERE i.isDeleted = false")
    Page<Item> findAllNotDeleted(PageRequest pageRequest);

    @Query("SELECT i FROM Item i WHERE i.isDeleted = false AND i.id = :id")
    Optional<Item> findByIdNotDeleted(Integer id);


    @Query("SELECT i FROM Item i WHERE " +
            "(:keyword IS NULL OR " +
            "i.title LIKE CONCAT('%', :keyword, '%'))  AND " +
            "(:catId IS NULL OR i.cat.id = :catId) AND " +
            "i.isDeleted = false")
    Page<Item> findByKeywordAndCategory(@Param("keyword") String keyword,
                                        @Param("catId") Integer catId,
                                        Pageable pageable);
}

