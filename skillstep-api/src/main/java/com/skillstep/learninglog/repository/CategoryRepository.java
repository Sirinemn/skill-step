package com.skillstep.learninglog.repository;

import com.skillstep.learninglog.domain.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    // Toutes les catégories d'un utilisateur triées par nom
    List<Category> findByUserIdOrderByNameAsc(Long userId);

    // Vérifie si un nom existe déjà pour cet utilisateur
    boolean existsByNameIgnoreCaseAndUserId(String name, Long userId);

    // Compte les catégories d'un utilisateur (pour la palette couleur)
    long countByUserId(Long userId);

    Optional<Category> findByIdAndUserId(Long id, Long userId);
}
