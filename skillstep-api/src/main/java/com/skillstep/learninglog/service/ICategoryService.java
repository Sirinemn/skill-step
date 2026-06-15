package com.skillstep.learninglog.service;

import com.skillstep.learninglog.domain.Category;
import com.skillstep.learninglog.dto.CategoryRequest;
import com.skillstep.learninglog.dto.CategoryResponse;

import java.util.List;
import java.util.Optional;

public interface ICategoryService {
    List<CategoryResponse> findAllByUser(Long userId);
    CategoryResponse       create(Long userId, CategoryRequest request);
    CategoryResponse       update(Long categoryId, Long userId, CategoryRequest request);
    void                   delete(Long categoryId, Long userId);

    // Méthode interne utilisée par LearningLogService
    // pour résoudre une Category depuis son id
    Optional<Category> findEntityByIdAndUserId(Long categoryId, Long userId);

    // Pour le dashboard — nombre de catégories actives de l'utilisateur
    long countByUserId(Long userId);
}
