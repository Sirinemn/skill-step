package com.skillstep.dashboard.service.impl;

import com.skillstep.dashboard.dto.DashboardStatsResponse;
import com.skillstep.dashboard.service.IDashboardService;
import com.skillstep.learninglog.service.ICategoryService;
import com.skillstep.learninglog.service.ILearningLogService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.format.TextStyle;
import java.util.*;

@Slf4j
@Service
public class DashboardServiceImpl implements IDashboardService {

    private final ILearningLogService learningLogService;
    private final ICategoryService categoryService;

    public DashboardServiceImpl(ILearningLogService learningLogService, ICategoryService categoryService) {
        this.learningLogService = learningLogService;
        this.categoryService = categoryService;
    }

    @Override
    @Transactional(readOnly = true)
    public DashboardStatsResponse getStats(Long userId) {

        LocalDate today        = LocalDate.now();
        LocalDate weekStart    = today.with(DayOfWeek.MONDAY);
        LocalDate sevenDaysAgo = today.minusDays(6);

        // ── KPI ────────────────────────────────────────────────
        long totalLogs        = learningLogService.countByUserId(userId);
        long totalMinutes     = learningLogService.sumDurationByUserId(userId);
        long activeCategories = categoryService.countByUserId(userId);
        long logsThisWeek     = learningLogService.countLogsThisWeek(
                userId, weekStart);

        // ── Streak ─────────────────────────────────────────────
        int streak = calculateStreak(userId, today);

        // ── Activité 7 jours ───────────────────────────────────
        List<DashboardStatsResponse.DayActivity> activity = buildActivityLast7Days(
                userId, sevenDaysAgo, today
        );

        // ── Top catégories (max 5) ──────────────────────────────
        List<DashboardStatsResponse.CategoryStats> topCats = buildTopCategories(
                userId, totalMinutes
        );

        return DashboardStatsResponse.builder()
                .totalLogs(totalLogs)
                .totalMinutes(totalMinutes)
                .activeCategories(activeCategories)
                .logsThisWeek(logsThisWeek)
                .streakDays(streak)
                .activityLast7Days(activity)
                .topCategories(topCats)
                .build();
    }

    // ── Méthodes privées ───────────────────────────────────────

    private int calculateStreak(Long userId, LocalDate today) {
        List<LocalDate> dates = learningLogService
                .findDistinctLogDates(userId, today.minusDays(365));

        if (dates.isEmpty()) return 0;

        Set<LocalDate> datesSet = new HashSet<>(dates);
        int streak = 0;

        // Si aujourd'hui pas de log → on commence à compter depuis hier
        LocalDate current = datesSet.contains(today)
                ? today
                : today.minusDays(1);

        while (datesSet.contains(current)) {
            streak++;
            current = current.minusDays(1);
        }

        return streak;
    }

    private List<DashboardStatsResponse.DayActivity> buildActivityLast7Days(Long userId,
                                                                            LocalDate from,
                                                                            LocalDate today) {
        List<ILearningLogService.DayActivityData> data = learningLogService
                .findActivityLast7Days(userId, from);

        // Map date → données pour lookup O(1)
        Map<LocalDate, ILearningLogService.DayActivityData> dataMap = new HashMap<>();
        data.forEach(d -> dataMap.put(d.logDate(), d));

        // Construit les 7 jours — les jours sans logs = 0
        List<DashboardStatsResponse.DayActivity> result = new ArrayList<>();
        for (int i = 6; i >= 0; i--) {
            LocalDate date = today.minusDays(i);
            ILearningLogService.DayActivityData dayData = dataMap.get(date);

            String dayLabel = date.getDayOfWeek()
                    .getDisplayName(TextStyle.SHORT, Locale.FRENCH)
                    .substring(0, 1)
                    .toUpperCase();

            result.add(DashboardStatsResponse.DayActivity.builder()
                    .day(dayLabel)
                    .date(date.toString())
                    .totalMinutes(dayData != null ? dayData.totalMinutes() : 0)
                    .logCount(dayData != null ? dayData.logCount() : 0)
                    .build());
        }
        return result;
    }

    private List<DashboardStatsResponse.CategoryStats> buildTopCategories(Long userId,
                                                                          long totalMinutes) {
        List<ILearningLogService.CategoryStatsData> data = learningLogService
                .findTopCategories(userId, 5);

        return data.stream()
                .map(cat -> {
                    int percentage = totalMinutes > 0
                            ? (int) Math.round(
                            (cat.totalMinutes() * 100.0) / totalMinutes)
                            : 0;

                    return DashboardStatsResponse.CategoryStats.builder()
                            .id(cat.categoryId())
                            .name(cat.categoryName())
                            .color(cat.categoryColor())
                            .totalMinutes(cat.totalMinutes())
                            .logCount(cat.logCount())
                            .percentage(percentage)
                            .build();
                })
                .toList();
    }
}
