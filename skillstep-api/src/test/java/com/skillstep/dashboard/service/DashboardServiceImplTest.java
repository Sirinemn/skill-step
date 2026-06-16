package com.skillstep.dashboard.service;

import com.skillstep.dashboard.dto.DashboardStatsResponse;
import com.skillstep.dashboard.service.impl.DashboardServiceImpl;
import com.skillstep.learninglog.service.ICategoryService;
import com.skillstep.learninglog.service.ILearningLogService;
import com.skillstep.user.domain.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@ActiveProfiles("test")
public class DashboardServiceImplTest {

    @Mock
    private ILearningLogService learningLogService;
    @Mock
    private ICategoryService categoryService;
    @InjectMocks
    private DashboardServiceImpl dashboardService;


    @Test
    void testGetStats() {
        Long userId = 1L;

        // 1. Mock des appels KPI de base
        when(learningLogService.countByUserId(userId)).thenReturn(10L);
        when(learningLogService.sumDurationByUserId(userId)).thenReturn(300L);
        when(categoryService.countByUserId(userId)).thenReturn(5L);
        when(learningLogService.countLogsThisWeek(eq(userId), any(LocalDate.class))).thenReturn(7L);

        // 2. Mock pour le calcul du STREAK
        // On renvoie une liste vide pour simplifier (streak de 0)
        when(learningLogService.findDistinctLogDates(eq(userId), any(LocalDate.class)))
                .thenReturn(Collections.emptyList());

        // 3. Mock pour l'ACTIVITÉ des 7 derniers jours (Utilisation d'un record anonyme ou mock)
        ILearningLogService.DayActivityData mockActivityData = new ILearningLogService.DayActivityData(
                LocalDate.now(), // logDate
                90L,             // totalMinutes
                3L               // logCount
        );
        when(learningLogService.findActivityLast7Days(eq(userId), any(LocalDate.class)))
                .thenReturn(List.of(mockActivityData));

        // 4. Mock pour les TOP CATÉGORIES
        ILearningLogService.CategoryStatsData mockCategoryData = new ILearningLogService.CategoryStatsData(
                1L,        // categoryId
                "Java",    // categoryName
                "#FF0000", // categoryColor
                120L,      // totalMinutes
                5L         // logCount
        );
        when(learningLogService.findTopCategories(userId, 5))
                .thenReturn(List.of(mockCategoryData));

        // On appelle la vraie méthode du service injecté
        DashboardStatsResponse response = dashboardService.getStats(userId);

        // Assertions robustes avec JUnit 5
        assertEquals(10L, response.getTotalLogs());
        assertEquals(300L, response.getTotalMinutes());
        assertEquals(5L, response.getActiveCategories());
        assertEquals(7L, response.getLogsThisWeek());
        assertEquals(40, response.getTopCategories().get(0).getPercentage()); // 120 min / 300 min * 100 = 40%
    }
}
