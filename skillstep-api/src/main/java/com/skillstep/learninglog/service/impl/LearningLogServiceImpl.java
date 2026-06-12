package com.skillstep.learninglog.service.impl;

import com.skillstep.learninglog.domain.Category;
import com.skillstep.learninglog.domain.LearningLog;
import com.skillstep.learninglog.dto.CategoryResponse;
import com.skillstep.learninglog.dto.LearningLogRequest;
import com.skillstep.learninglog.dto.LearningLogResponse;
import com.skillstep.learninglog.mapper.LearningLogMapper;
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
    private final LearningLogMapper mapper;

    @Override
    @Transactional(readOnly = true)
    public Page<LearningLogResponse> findAll(Long userId,
                                             Long categoryId,
                                             LocalDate from,
                                             LocalDate to,
                                             String search,
                                             Pageable pageable) {
        // Défense : chaîne vide ou blank → null
        String normalizedSearch = (search != null && !search.isBlank())
                ? search.trim()
                : null;

        return learningLogRepository
                .findByFilters(userId, categoryId, from, to, normalizedSearch, pageable)
                .map(mapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public LearningLogResponse findById(Long id, Long userId) {
        return learningLogRepository
                .findByIdAndUserId(id, userId)
                .map(mapper::toResponse)
                .orElseThrow(() ->
                        new ResourceNotFoundException("LearningLog", id));
    }

    @Override
    @Transactional
    public LearningLogResponse create(Long userId, LearningLogRequest request) {
        // 1. MapStruct crée l'entité depuis le request
        LearningLog learningLog = mapper.toEntity(request);

        // 2. Le service assigne les champs que MapStruct ignore
        learningLog.setUser(userService.findById(userId));
        learningLog.setCategory(resolveCategory(request.getCategoryId(), userId));
        learningLog.setTitle(normalizeName(learningLog.getTitle()));

        LearningLog saved = learningLogRepository.save(learningLog);
        log.info("Log créé : '{}' pour userId={}", saved.getTitle(), userId);
        return mapper.toResponse(saved);
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

        learningLog.setTitle(normalizeName(request.getTitle()));
        learningLog.setDescription(request.getDescription());
        learningLog.setDurationMin(request.getDurationMin());
        learningLog.setLogDate(request.getLogDate());
        learningLog.setResourceUrl(request.getResourceUrl());
        learningLog.setCategory(category);

        return mapper.toResponse(learningLog); // flush automatique
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
    private String normalizeName(String name) {
        if (name == null) return "";
        String normalized = name.trim().replaceAll("\\s+", " ");
        // Capitalise uniquement la première lettre
        if (normalized.isEmpty()) return normalized;
        return Character.toUpperCase(normalized.charAt(0))
                + normalized.substring(1).toLowerCase();
    }
}