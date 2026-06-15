package com.skillstep.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DashboardStatsResponse {

    // KPI cards
    private long    totalLogs;
    private long    totalMinutes;
    private long    activeCategories;
    private long    logsThisWeek;
    private int     streakDays;       // jours consécutifs d'apprentissage

    // Graphique activité 7 jours
    private List<DayActivity> activityLast7Days;

    // Top catégories
    private List<CategoryStats> topCategories;

    // ── DTOs imbriqués ──────────────────────────────

    @Getter
    @Builder
    public static class DayActivity {
        private String day;           // "L", "M", "M", "J", "V", "S", "D"
        private String date;          // "2026-06-07"
        private long   totalMinutes;
        private long   logCount;
    }

    @Getter
    @Builder
    public static class CategoryStats {
        private Long   id;
        private String name;
        private String color;
        private long   totalMinutes;
        private long   logCount;
        private int    percentage;    // % du temps total
    }
}
