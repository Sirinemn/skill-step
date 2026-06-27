package com.skillstep.learninglog.service;

import com.skillstep.learninglog.dto.LearningLogRequest;
import com.skillstep.learninglog.dto.LearningLogResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;

public interface ILearningLogService {

    Page<LearningLogResponse> findAll(Long userId,
                                      Long categoryId,
                                      LocalDate from,
                                      LocalDate to,
                                      String search,
                                      Pageable pageable);

    LearningLogResponse findById(Long id, Long userId);

    LearningLogResponse create(Long userId, LearningLogRequest request);

    LearningLogResponse update(Long id, Long userId,
                               LearningLogRequest request);

    void delete(Long id, Long userId);

    // Utilisé par CategoryServiceImpl pour vérifier avant suppression
    boolean existsByCategoryId(Long categoryId);

    // Pour les stats dashboard
    long countByUserId(Long userId);

    long            sumDurationByUserId(Long userId);
    long            countLogsThisWeek(Long userId, LocalDate weekStart);
    List<LocalDate> findDistinctLogDates(Long userId, LocalDate from);
    List<DayActivityData> findActivityLast7Days(Long userId, LocalDate from);
    List<CategoryStatsData> findTopCategories(Long userId, int limit);
    // Record Java 17 — immuable, compact, parfait pour transporter des données
    record DayActivityData(
            LocalDate logDate,
            long      totalMinutes,
            long      logCount
    ) {}

    record CategoryStatsData(
            Long   categoryId,
            String categoryName,
            String categoryColor,
            long   totalMinutes,
            long   logCount
    ) {}
    Page<LearningLogResponse> findByDateRange(Long userId,
                                              LocalDate from,
                                              LocalDate to,
                                              Pageable pageable);
}
