package com.skillstep.learninglog.service.impl;

import com.skillstep.learninglog.domain.Category;
import com.skillstep.learninglog.domain.LearningLog;
import com.skillstep.learninglog.dto.CategoryResponse;
import com.skillstep.learninglog.dto.LearningLogRequest;
import com.skillstep.learninglog.dto.LearningLogResponse;
import com.skillstep.learninglog.repository.LearningLogRepository;
import com.skillstep.learninglog.service.ICategoryService;
import com.skillstep.learninglog.service.ILearningLogService;
import com.skillstep.shared.exception.ResourceNotFoundException;
import com.skillstep.user.service.IUserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Slf4j
@Service
@RequiredArgsConstructor  // fonctionne car pas de @Lazy ici
public class LearningLogServiceImpl implements ILearningLogService {

    private final LearningLogRepository learningLogRepository;
    private final IUserService          userService;
    private final ICategoryService      categoryService;

    @Override
    @Transactional(readOnly = true)
    public Page<LearningLogResponse> findAll(Long userId,
                                             Long categoryId,
                                             LocalDate from,
                                             LocalDate to,
                                             String search,
                                             Pageable pageable) {
        return learningLogRepository
                .findByFilters(userId, categoryId, from, to, search, pageable)
                .map(this::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public LearningLogResponse findById(Long id, Long userId) {
        return learningLogRepository
                .findByIdAndUserId(id, userId)
                .map(this::toResponse)
                .orElseThrow(() ->
                        new ResourceNotFoundException("LearningLog", id));
    }

    @Override
    @Transactional
    public LearningLogResponse create(Long userId, LearningLogRequest request) {
        var user = userService.findById(userId);

        // Résout la catégorie via ICategoryService — nullable
        Category category = resolveCategory(request.getCategoryId(), userId);

        LearningLog learningLog = LearningLog.builder()
                .title(request.getTitle().trim())
                .description(request.getDescription())
                .durationMin(request.getDurationMin())
                .logDate(request.getLogDate())
                .resourceUrl(request.getResourceUrl())
                .user(user)
                .category(category)
                .build();

        LearningLog saved = learningLogRepository.save(learningLog);
        log.info("Log créé : '{}' pour userId={}", saved.getTitle(), userId);
        return toResponse(saved);
    }

    @Override
    @Transactional
    public LearningLogResponse update(Long id, Long userId,
                                      LearningLogRequest request) {
        LearningLog learningLog = learningLogRepository
                .findByIdAndUserId(id, userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("LearningLog", id));

        Category category = resolveCategory(request.getCategoryId(), userId);

        learningLog.setTitle(request.getTitle().trim());
        learningLog.setDescription(request.getDescription());
        learningLog.setDurationMin(request.getDurationMin());
        learningLog.setLogDate(request.getLogDate());
        learningLog.setResourceUrl(request.getResourceUrl());
        learningLog.setCategory(category);

        return toResponse(learningLog); // flush automatique
    }

    @Override
    @Transactional
    public void delete(Long id, Long userId) {
        LearningLog learningLog = learningLogRepository
                .findByIdAndUserId(id, userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("LearningLog", id));

        learningLogRepository.delete(learningLog);
        log.info("Log supprimé : id={} userId={}", id, userId);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByCategoryId(Long categoryId) {
        return learningLogRepository.existsByCategoryId(categoryId);
    }

    @Override
    @Transactional(readOnly = true)
    public long countByUserId(Long userId) {
        return learningLogRepository.countByUserId(userId);
    }

    // ─── Méthodes privées ───────────────────────────────────

    // Résout la catégorie depuis ICategoryService
    // Retourne null si categoryId est null (catégorie optionnelle)
    private Category resolveCategory(Long categoryId, Long userId) {
        if (categoryId == null) return null;

        return categoryService
                .findEntityByIdAndUserId(categoryId, userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Catégorie", categoryId));
    }

    private LearningLogResponse toResponse(LearningLog l) {
        CategoryResponse categoryResponse = l.getCategory() != null
                ? CategoryResponse.builder()
                .id(l.getCategory().getId())
                .name(l.getCategory().getName())
                .color(l.getCategory().getColor())
                .build()
                : null;

        return LearningLogResponse.builder()
                .id(l.getId())
                .title(l.getTitle())
                .description(l.getDescription())
                .durationMin(l.getDurationMin())
                .logDate(l.getLogDate())
                .resourceUrl(l.getResourceUrl())
                .category(categoryResponse)
                .createdAt(l.getCreatedAt())
                .updatedAt(l.getUpdatedAt())
                .build();
    }
}