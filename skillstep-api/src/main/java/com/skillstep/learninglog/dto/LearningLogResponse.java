package com.skillstep.learninglog.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.OffsetDateTime;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LearningLogResponse {
    private Long             id;
    private String           title;
    private String           description;
    private Integer          durationMin;
    private LocalDate        logDate;
    private String           resourceUrl;
    private CategoryResponse category;    // null si pas de catégorie
    private OffsetDateTime   createdAt;
    private OffsetDateTime   updatedAt;
}