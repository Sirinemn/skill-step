package com.skillstep.learninglog.service.impl;

import com.skillstep.learninglog.domain.Category;
import com.skillstep.learninglog.domain.ColorPalette;
import com.skillstep.learninglog.dto.CategoryRequest;
import com.skillstep.learninglog.dto.CategoryResponse;
import com.skillstep.learninglog.repository.CategoryRepository;
import com.skillstep.learninglog.repository.LearningLogRepository;
import com.skillstep.learninglog.service.ICategoryService;
import com.skillstep.shared.exception.ConflictException;
import com.skillstep.shared.exception.ForbiddenException;
import com.skillstep.shared.exception.ResourceNotFoundException;
import com.skillstep.user.repository.UserRepository;
import com.skillstep.user.service.IUserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements ICategoryService {

    private final CategoryRepository    categoryRepository;
    private final LearningLogRepository learningLogRepository;
    private final IUserService         userService;

    @Override
    @Transactional(readOnly = true)
    public List<CategoryResponse> findAllByUser(Long userId) {
        return categoryRepository
                .findByUserIdOrderByNameAsc(userId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional
    public CategoryResponse create(Long userId, CategoryRequest request) {
        // Vérifier unicité (name, user_id)
        String trimmedName = request.getName().trim();
        if (categoryRepository.existsByNameIgnoreCaseAndUserId(trimmedName, userId)) {
            throw new ConflictException(
                    "Vous avez déjà une catégorie nommée \"" + trimmedName + "\""
            );
        }

        // Couleur : celle fournie OU palette automatique
        String color = request.getColor() != null
                ? request.getColor()
                : ColorPalette.next(categoryRepository.countByUserId(userId));

        Category category = Category.builder()
                .name(trimmedName)
                .color(color)
                .user(userService.getReferenceById(userId))
                .build();

        Category saved = categoryRepository.save(category);
        log.info("Catégorie créée : '{}' pour userId={}", saved.getName(), userId);
        return toResponse(saved);
    }

    @Override
    @Transactional
    public CategoryResponse update(Long categoryId, Long userId,
                                   CategoryRequest request) {
        Category category = findCategoryOwnedByUser(categoryId, userId);

        String trimmedName = request.getName().trim();

        // Vérifie le doublon uniquement si le nom change
        if (!category.getName().equalsIgnoreCase(trimmedName)
                && categoryRepository.existsByNameIgnoreCaseAndUserId(
                trimmedName, userId)) {
            throw new ConflictException(
                    "Vous avez déjà une catégorie nommée \"" + trimmedName + "\""
            );
        }

        category.setName(trimmedName);
        if (request.getColor() != null) {
            category.setColor(request.getColor());
        }

        return toResponse(category); // save implicite via @Transactional
    }

    @Override
    @Transactional
    public void delete(Long categoryId, Long userId) {
        Category category = findCategoryOwnedByUser(categoryId, userId);

        // Vérifie si des logs utilisent cette catégorie
        if (learningLogRepository.existsByCategoryId(categoryId)) {
            throw new ConflictException(
                    "Cette catégorie est utilisée par des logs. " +
                            "Réassignez-les avant de la supprimer."
            );
        }

        categoryRepository.delete(category);
        log.info("Catégorie supprimée : id={} pour userId={}", categoryId, userId);
    }

    // ─── Méthodes privées ───────────────────────────────────────

    private Category findCategoryOwnedByUser(Long categoryId, Long userId) {
        return categoryRepository
                .findByIdAndUserId(categoryId, userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Catégorie", categoryId));
    }

    private CategoryResponse toResponse(Category c) {
        return CategoryResponse.builder()
                .id(c.getId())
                .name(c.getName())
                .color(c.getColor())
                .build();
    }
}
