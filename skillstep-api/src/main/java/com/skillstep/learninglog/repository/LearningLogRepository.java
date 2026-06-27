package com.skillstep.learninglog.repository;

import com.skillstep.learninglog.domain.LearningLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
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
                    OR LOWER(l.title) LIKE LOWER(CONCAT('%', CAST(:search AS string), '%'))
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

    // Temps total en minutes
    @Query("SELECT COALESCE(SUM(l.durationMin), 0) FROM LearningLog l WHERE l.user.id = :userId")
    long sumDurationByUserId(@Param("userId") Long userId);

    // Nombre de logs cette semaine
    @Query("""
    SELECT COUNT(l) FROM LearningLog l
    WHERE l.user.id = :userId
      AND l.logDate >= :weekStart
    """)
    long countLogsThisWeek(@Param("userId") Long userId,
                           @Param("weekStart") LocalDate weekStart);

    // Activité par jour sur les 7 derniers jours
    @Query("""
    SELECT l.logDate        AS logDate,
           SUM(l.durationMin) AS totalMinutes,
           COUNT(l)           AS logCount
    FROM LearningLog l
    WHERE l.user.id  = :userId
      AND l.logDate >= :from
    GROUP BY l.logDate
    ORDER BY l.logDate ASC
    """)
    List<Object[]> findActivityLast7Days(@Param("userId") Long userId,
                                         @Param("from")   LocalDate from);

    // Stats par catégorie (top 5)
    @Query("""
    SELECT c.id             AS catId,
           c.name           AS catName,
           c.color          AS catColor,
           SUM(l.durationMin) AS totalMinutes,
           COUNT(l)           AS logCount
    FROM LearningLog l
    JOIN l.category c
    WHERE l.user.id = :userId
    GROUP BY c.id, c.name, c.color
    ORDER BY SUM(l.durationMin) DESC
    """)
    List<Object[]> findTopCategories(@Param("userId") Long userId,
                                     Pageable pageable);

    @Query("""
    SELECT DISTINCT l.logDate FROM LearningLog l
    WHERE l.user.id  = :userId
      AND l.logDate >= :from
    ORDER BY l.logDate DESC
    """)
    List<LocalDate> findDistinctLogDates(@Param("userId") Long userId,
                                         @Param("from")   LocalDate from);
    @Query("""
    SELECT l FROM LearningLog l
    LEFT JOIN FETCH l.category
    WHERE l.user.id  = :userId
      AND l.logDate >= :from
      AND l.logDate <= :to
    ORDER BY l.logDate DESC, l.createdAt DESC
    """)
    Page<LearningLog> findByUserAndDateRange(
            @Param("userId") Long      userId,
            @Param("from")   LocalDate from,
            @Param("to")     LocalDate to,
            Pageable         pageable
    );
}
