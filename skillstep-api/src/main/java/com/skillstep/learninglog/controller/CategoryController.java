package com.skillstep.learninglog.controller;

import com.skillstep.learninglog.dto.CategoryRequest;
import com.skillstep.learninglog.dto.CategoryResponse;
import com.skillstep.learninglog.service.ICategoryService;
import com.skillstep.user.service.IUserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
@Tag(name = "Categories", description = "Gestion des catégories")
@SecurityRequirement(name = "bearerAuth")
public class CategoryController {

    private final ICategoryService categoryService;
    private final IUserService     userService;

    @GetMapping
    @Operation(summary = "Liste toutes les catégories de l'utilisateur")
    public ResponseEntity<List<CategoryResponse>> getAll(
            @AuthenticationPrincipal Jwt jwt) {
        Long userId = resolveUserId(jwt);
        return ResponseEntity.ok(categoryService.findAllByUser(userId));
    }

    @PostMapping
    @Operation(summary = "Crée une nouvelle catégorie")
    public ResponseEntity<CategoryResponse> create(
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody CategoryRequest request) {
        Long userId = resolveUserId(jwt);
        CategoryResponse created = categoryService.create(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Met à jour une catégorie")
    public ResponseEntity<CategoryResponse> update(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable Long id,
            @Valid @RequestBody CategoryRequest request) {
        Long userId = resolveUserId(jwt);
        return ResponseEntity.ok(categoryService.update(id, userId, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Supprime une catégorie")
    public ResponseEntity<Void> delete(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable Long id) {
        Long userId = resolveUserId(jwt);
        categoryService.delete(id, userId);
        return ResponseEntity.noContent().build();
    }

    // Résout l'userId depuis le JWT une seule fois par requête
    private Long resolveUserId(Jwt jwt) {
        String email = jwt.getClaimAsString("email");
        return userService.findByEmail(email)
                .orElseThrow()
                .getId();
    }
}
