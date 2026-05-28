package com.skillstep.learninglog.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CategoryRequest {
    @NotBlank(message = "Le nom est obligatoire")
    @Size(max = 100, message = "Le nom ne peut pas dépasser 100 caractères")
    private String name;

    // Couleur HEX optionnelle — si null, palette automatique
    @Pattern(
            regexp  = "^#[0-9A-Fa-f]{6}$",
            message = "La couleur doit être au format HEX (#RRGGBB)"
    )
    private String color;
}
