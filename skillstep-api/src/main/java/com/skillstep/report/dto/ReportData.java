package com.skillstep.report.dto;

import com.skillstep.dashboard.dto.DashboardStatsResponse;
import com.skillstep.learninglog.dto.LearningLogResponse;
import com.skillstep.user.dto.UserProfileResponse;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.util.List;

// Objet complet passé au template Thymeleaf
@Getter
@Builder
public class ReportData {
    // Métadonnées du rapport
    private LocalDate periodFrom;
    private LocalDate periodTo;
    private String    generatedAt;   // "24 juin 2026"

    // Profil utilisateur
    private UserProfileResponse user;

    // Contenu
    private List<LearningLogResponse> logs;
    private List<DashboardStatsResponse.CategoryStats> topCategories;

    // Stats globales sur la période
    private long   totalLogs;
    private long   totalMinutes;
    private String totalDuration;   // "4h 25min"
    private double avgMinutesPerDay;
    private int    activeDays;
}
