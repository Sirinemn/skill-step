package com.skillstep.learninglog.service.impl;

import com.skillstep.learninglog.domain.Category;
import com.skillstep.learninglog.domain.ColorPalette;
import com.skillstep.learninglog.dto.CategoryRequest;
import com.skillstep.learninglog.dto.CategoryResponse;
import com.skillstep.learninglog.mapper.CategoryMapper;
import com.skillstep.learninglog.repository.CategoryRepository;
import com.skillstep.learninglog.service.ICategoryService;
import com.skillstep.learninglog.service.ILearningLogService;
import com.skillstep.shared.exception.ConflictException;
import com.skillstep.shared.exception.ResourceNotFoundException;
import com.skillstep.user.service.IUserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class CategoryServiceImpl implements ICategoryService {

    private final CategoryRepository  categoryRepository;
    private final IUserService        userService;
    private final CategoryMapper      categoryMapper;

    // @Lazy rompt le cycle : Spring instancie CategoryServiceImpl
    // sans attendre que LearningLogServiceImpl soit prêt
    // LearningLogServiceImpl sera instancié à la première utilisation
    private final ILearningLogService learningLogService;

    // Constructeur manuel — @RequiredArgsConstructor ne supporte pas @Lazy
    public CategoryServiceImpl(
            CategoryRepository  categoryRepository,
            IUserService        userService,
            CategoryMapper categoryMapper, @Lazy ILearningLogService learningLogService) {
        this.categoryRepository  = categoryRepository;
        this.userService         = userService;
        this.categoryMapper = categoryMapper;
        this.learningLogService  = learningLogService;
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoryResponse> findAllByUser(Long userId) {
        return categoryRepository
                .findByUserIdOrderByNameAsc(userId)
                .stream()
                .map(categoryMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional
    public CategoryResponse create(Long userId, CategoryRequest request) {
        String trimmedName = normalizeName(request.getName());

        if (categoryRepository.existsByNameIgnoreCaseAndUserId(trimmedName, userId)) {
            throw new ConflictException(
                    "Vous avez déjà une catégorie nommée \"" + trimmedName + "\""
            );
        }

        // Couleur : celle fournie OU assignée depuis la palette
        String color = request.getColor() != null
                ? request.getColor()
                : ColorPalette.next(categoryRepository.countByUserId(userId));

        // On récupère l'entité User via IUserService — pas via UserRepository
        var user = userService.findById(userId);

        Category category = categoryMapper.toEntity(request); // ← MapStruct
        category.setName(trimmedName);
        category.setColor(color);
        category.setUser(userService.findById(userId));

        Category saved = categoryRepository.save(category);
        log.info("Catégorie créée : '{}' pour userId={}", saved.getName(), userId);
        return categoryMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public CategoryResponse update(Long categoryId, Long userId,
                                   CategoryRequest request) {
        Category category = findEntityOwnedByUser(categoryId, userId);
        String trimmedName = normalizeName(request.getName());

        // Vérifie le doublon uniquement si le nom change
        boolean nameChanged = !category.getName().equalsIgnoreCase(trimmedName);
        if (nameChanged && categoryRepository
                .existsByNameIgnoreCaseAndUserId(trimmedName, userId)) {
            throw new ConflictException(
                    "Vous avez déjà une catégorie nommée \"" + trimmedName + "\""
            );
        }

        category.setName(trimmedName);
        if (request.getColor() != null) {
            category.setColor(request.getColor());
        }

        log.info("Catégorie mise à jour : id={} userId={}", categoryId, userId);
        return categoryMapper.toResponse(category); // flush automatique fin de transaction
    }

    @Override
    @Transactional
    public void delete(Long categoryId, Long userId) {
        Category category = findEntityOwnedByUser(categoryId, userId);

        // Délègue la vérification à ILearningLogService — pas au repo directement
        if (learningLogService.existsByCategoryId(categoryId)) {
            throw new ConflictException(
                    "Cette catégorie est utilisée par des apprentissages. " +
                            "Réassignez-les avant de la supprimer."
            );
        }

        categoryRepository.delete(category);
        log.info("Catégorie supprimée : id={} userId={}", categoryId, userId);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Category> findEntityByIdAndUserId(Long categoryId,
                                                      Long userId) {
        return categoryRepository.findByIdAndUserId(categoryId, userId);
    }

    // ─── Méthodes privées ───────────────────────────────────────

    private Category findEntityOwnedByUser(Long categoryId, Long userId) {
        return categoryRepository
                .findByIdAndUserId(categoryId, userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Catégorie", categoryId));
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