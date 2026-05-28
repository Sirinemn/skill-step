package com.skillstep.learninglog.dto;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter @Setter @NoArgsConstructor
public class LearningLogRequest {

    @NotBlank(message = "Le titre est obligatoire")
    @Size(max = 255, message = "Le titre ne peut pas dépasser 255 caractères")
    private String title;

    @Size(max = 5000, message = "La description ne peut pas dépasser 5000 caractères")
    private String description;

    @NotNull(message = "La durée est obligatoire")
    @Min(value = 1, message = "La durée minimum est 1 minute")
    @Max(value = 1440, message = "La durée maximum est 1440 minutes (24h)")
    private Integer durationMin;

    @NotNull(message = "La date est obligatoire")
    @PastOrPresent(message = "La date ne peut pas être dans le futur")
    private LocalDate logDate;

    @Size(max = 500)
    private String resourceUrl;

    // Nullable — catégorie optionnelle
    private Long categoryId;
}