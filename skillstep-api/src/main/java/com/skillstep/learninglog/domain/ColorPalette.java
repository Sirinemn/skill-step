package com.skillstep.learninglog.domain;

import java.util.List;

public final class ColorPalette {

    // 10 couleurs harmonieuses — correspondent aux couleurs de la maquette
    private static final List<String> COLORS = List.of(
            "#6C63FF",  // Violet   — primary
            "#22C55E",  // Vert     — succès
            "#3B82F6",  // Bleu
            "#F59E0B",  // Ambre
            "#EF4444",  // Rouge
            "#14B8A6",  // Teal
            "#8B5CF6",  // Violet clair
            "#F97316",  // Orange
            "#EC4899",  // Rose
            "#06B6D4"   // Cyan
    );

    // Constructeur privé — classe utilitaire, pas d'instanciation
    private ColorPalette() {}

    // Retourne la couleur selon le nombre de catégories existantes
    // Si l'utilisateur a 11 catégories, on repart du début (modulo)
    public static String next(long existingCategoriesCount) {
        int index = (int) (existingCategoriesCount % COLORS.size());
        return COLORS.get(index);
    }

    public static List<String> all() {
        return COLORS;
    }
}
