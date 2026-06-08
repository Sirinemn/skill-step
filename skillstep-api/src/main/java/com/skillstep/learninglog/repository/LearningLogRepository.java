package com.skillstep.learninglog.repository;

import com.skillstep.learninglog.domain.LearningLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface LearningLogRepository extends JpaRepository<LearningLog, Long> {
    // Liste paginée avec filtres optionnels
    // @Query JPQL — plus lisible et typé que les méthodes derived
    @Query("""
            SELECT l FROM LearningLog l
            LEFT JOIN FETCH l.category
            WHERE l.user.id = :userId
              AND (:categoryId IS NULL OR l.category.id = :categoryId)
              AND (:from IS NULL OR l.logDate >= :from)
              AND (:to   IS NULL OR l.logDate <= :to)
              AND (
                    CAST(:search AS string) IS NULL
                    OR LOWER(l.title) LIKE LOWER(CONCAT('%', :search, '%'))
                  )
            ORDER BY l.logDate DESC, l.createdAt DESC
        """)
    Page<LearningLog> findByFilters(
            @Param("userId")     Long userId,
            @Param("categoryId") Long categoryId,
            @Param("from")       LocalDate from,
            @Param("to")         LocalDate to,
            @Param("search")     String search,
            Pageable             pageable
    );

    Optional<LearningLog> findByIdAndUserId(Long id, Long userId);

    // Vérifie si une catégorie est utilisée par au moins un log
    boolean existsByCategoryId(Long categoryId);

    // Pour les stats du dashboard
    long countByUserId(Long userId);
}
