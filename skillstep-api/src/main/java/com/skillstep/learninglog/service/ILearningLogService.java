package com.skillstep.learninglog.service;

import com.skillstep.learninglog.dto.LearningLogRequest;
import com.skillstep.learninglog.dto.LearningLogResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;

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
}
