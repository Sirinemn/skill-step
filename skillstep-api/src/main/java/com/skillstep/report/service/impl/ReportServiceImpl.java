package com.skillstep.report.service.impl;

import com.skillstep.dashboard.dto.DashboardStatsResponse;
import com.skillstep.dashboard.service.IDashboardService;
import com.skillstep.learninglog.dto.LearningLogResponse;
import com.skillstep.learninglog.service.ILearningLogService;
import com.skillstep.report.dto.ReportData;
import com.skillstep.report.dto.ReportRequest;
import com.skillstep.report.service.IReportService;
import com.skillstep.user.mapper.UserMapper;
import com.skillstep.user.service.IUserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import org.xhtmlrenderer.pdf.ITextRenderer;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Locale;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements IReportService {

    private final IUserService        userService;
    private final ILearningLogService learningLogService;
    private final IDashboardService dashboardService;
    private final UserMapper userMapper;
    private final TemplateEngine templateEngine;

    private static final DateTimeFormatter FR_FORMATTER =
            DateTimeFormatter.ofPattern("d MMMM yyyy", Locale.FRENCH);

    @Override
    @Transactional(readOnly = true)
    public byte[] generatePdf(Long userId, ReportRequest request) {
        // ── Résoudre la période ────────────────────────────────
        LocalDate[] period = resolvePeriod(request);
        LocalDate from     = period[0];
        LocalDate to       = period[1];

        // ── Récupérer les données ──────────────────────────────
        var user = userService.findById(userId);

        // Tous les logs de la période, sans pagination
        var logsPage = learningLogService.findByDateRange(
                userId, from, to,
                PageRequest.of(0, 1000, Sort.by("logDate").descending())
        );
        List<LearningLogResponse> logs = logsPage.getContent();

        // Stats du dashboard pour les catégories
        DashboardStatsResponse stats = dashboardService.getStats(userId);

        // ── Calculer les métriques de la période ──────────────
        long totalMinutes = logs.stream()
                .mapToLong(LearningLogResponse::getDurationMin)
                .sum();

        long daysBetween = ChronoUnit.DAYS.between(from, to) + 1;
        double avgPerDay = daysBetween > 0
                ? (double) totalMinutes / daysBetween
                : 0;

        long activeDays = logs.stream()
                .map(LearningLogResponse::getLogDate)
                .distinct()
                .count();

        // ── Construire le ReportData ───────────────────────────
        ReportData data = ReportData.builder()
                .periodFrom(from)
                .periodTo(to)
                .generatedAt(LocalDate.now().format(FR_FORMATTER))
                .user(userMapper.toProfileResponse(user))
                .logs(logs)
                .topCategories(stats.getTopCategories())
                .totalLogs(logs.size())
                .totalMinutes(totalMinutes)
                .totalDuration(formatDuration(totalMinutes))
                .avgMinutesPerDay(Math.round(avgPerDay * 10.0) / 10.0)
                .activeDays((int) activeDays)
                .build();

        // ── Générer le HTML via Thymeleaf ──────────────────────
        Context ctx = new Context(Locale.FRENCH);
        ctx.setVariable("report", data);
        ctx.setVariable("frFormatter",
                DateTimeFormatter.ofPattern("d MMM yyyy", Locale.FRENCH));

        String html = templateEngine.process("report/pdf-report", ctx);

        // ── Convertir HTML → PDF via Flying Saucer ────────────
        return htmlToPdf(html);
    }


    private byte[] htmlToPdf(String html) {
        try (ByteArrayOutputStream os = new ByteArrayOutputStream()) {
            ITextRenderer renderer = new ITextRenderer();
            renderer.setDocumentFromString(html);
            renderer.layout();       //calcule la mise en page
            renderer.createPDF(os);  //écrit les bytes dans le stream
            return os.toByteArray(); //retourne le tableau de bytes
        } catch (Exception e) {
            log.error("Erreur génération PDF", e);
            throw new RuntimeException("Impossible de générer le PDF", e);
        }
    }
    private LocalDate[] resolvePeriod(ReportRequest request) {
        LocalDate to = LocalDate.now();
        LocalDate from;

        if (request.getFrom() != null && request.getTo() != null) {
            // Période personnalisée
            from = request.getFrom();
            to   = request.getTo();
        } else {
            // Période prédéfinie
            int days = request.getPeriod() != null
                    ? request.getPeriod()
                    : 30; // défaut 30 jours
            from = to.minusDays(days - 1);
        }
        return new LocalDate[]{from, to};
    }

    private String formatDuration(long minutes) {
        if (minutes == 0) return "0 min";
        if (minutes < 60) return minutes + " min";
        long h = minutes / 60;
        long m = minutes % 60;
        return m > 0 ? h + "h " + m + "min" : h + "h";
    }
}
