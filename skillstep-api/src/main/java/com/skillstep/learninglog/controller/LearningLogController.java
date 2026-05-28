package com.skillstep.learninglog.controller;

import com.skillstep.learninglog.dto.LearningLogRequest;
import com.skillstep.learninglog.dto.LearningLogResponse;
import com.skillstep.learninglog.service.ILearningLogService;
import com.skillstep.user.service.IUserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/learning-logs")
@RequiredArgsConstructor
@Tag(name = "LearningLogs", description = "Gestion des apprentissages")
@SecurityRequirement(name = "bearerAuth")
public class LearningLogController {

    private final ILearningLogService learningLogService;
    private final IUserService        userService;

    @GetMapping
    @Operation(summary = "Liste les apprentissages avec filtres et pagination")
    public ResponseEntity<Page<LearningLogResponse>> getAll(
            @AuthenticationPrincipal Jwt jwt,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
            @RequestParam(required = false) String search,
            @PageableDefault(size = 20, sort = "logDate",
                    direction = Sort.Direction.DESC)
            Pageable pageable) {

        Long userId = resolveUserId(jwt);
        return ResponseEntity.ok(
                learningLogService.findAll(userId, categoryId, from, to,
                        search, pageable)
        );
    }

    @GetMapping("/{id}")
    @Operation(summary = "Récupère un apprentissage par son id")
    public ResponseEntity<LearningLogResponse> getById(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable Long id) {
        Long userId = resolveUserId(jwt);
        return ResponseEntity.ok(learningLogService.findById(id, userId));
    }

    @PostMapping
    @Operation(summary = "Crée un nouvel apprentissage")
    public ResponseEntity<LearningLogResponse> create(
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody LearningLogRequest request) {
        Long userId = resolveUserId(jwt);
        LearningLogResponse created = learningLogService.create(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Met à jour un apprentissage")
    public ResponseEntity<LearningLogResponse> update(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable Long id,
            @Valid @RequestBody LearningLogRequest request) {
        Long userId = resolveUserId(jwt);
        return ResponseEntity.ok(
                learningLogService.update(id, userId, request)
        );
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Supprime un apprentissage")
    public ResponseEntity<Void> delete(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable Long id) {
        Long userId = resolveUserId(jwt);
        learningLogService.delete(id, userId);
        return ResponseEntity.noContent().build();
    }

    private Long resolveUserId(Jwt jwt) {
        return userService.findByEmail(jwt.getClaimAsString("email"))
                .orElseThrow()
                .getId();
    }
}