package com.skillstep.report.service;

import com.skillstep.dashboard.dto.DashboardStatsResponse;
import com.skillstep.dashboard.service.IDashboardService;
import com.skillstep.learninglog.service.ILearningLogService;
import com.skillstep.report.dto.ReportRequest;
import com.skillstep.report.service.impl.ReportServiceImpl;
import com.skillstep.user.domain.User;
import com.skillstep.user.mapper.UserMapper;
import com.skillstep.user.service.IUserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.test.context.ActiveProfiles;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@ActiveProfiles("test")
public class ReportServiceImplTest {

    @Mock
    private IUserService userService;
    @Mock
    private ILearningLogService learningLogService;
    @Mock
    private IDashboardService dashboardService;
    @Mock
    private UserMapper userMapper;
    @Mock
    private TemplateEngine templateEngine;
    @InjectMocks
    private ReportServiceImpl reportService;
    User userMock;

    @BeforeEach
    void Setup() {
        userMock = User.builder()
                .id(1L)
                .email("john@doe.fr")
                .firstName("John")
                .lastName("Doe")
                .provider("google")
                .providerId("123456789")
                .build();
    }
    @Test
    @DisplayName("generatePdf — période personnalisée respectée")
    void shouldGeneratePdf_for30days() {
        ReportRequest reportRequest = new ReportRequest();
        reportRequest.setPeriod(30);

        LocalDate expectedFrom = LocalDate.now().minusDays(29);

        setupMocks(expectedFrom, LocalDate.now());
        when(templateEngine.process(anyString(), any(Context.class)))
                .thenReturn("<html><body>test</body></html>");

        // On vérifie juste que ça ne lève pas d'exception
        byte[] result = reportService.generatePdf(1L, reportRequest);
        assertThat(result).isNotEmpty();

    }
    @Test
    @DisplayName("generatePdf — période par défaut = 30 jours si null")
    void generatePdf_shouldDefault30Days_whenPeriodNull() {
        ReportRequest request = new ReportRequest();
        // period = null, from = null, to = null

        setupMocks(LocalDate.now().minusDays(29), LocalDate.now());
        when(templateEngine.process(anyString(), any(Context.class)))
                .thenReturn("<html><body>test</body></html>");

        byte[] result = reportService.generatePdf(1L, request);
        assertThat(result).isNotEmpty();
    }
    private void setupMocks(LocalDate from, LocalDate to) {
        User user = User.builder().id(1L).email("test@example.com").build();
        when(userService.findById(1L)).thenReturn(user);
        when(learningLogService.findByDateRange(eq(1L), eq(from), eq(to), any()))
                .thenReturn(new PageImpl<>(List.of()));
        when(dashboardService.getStats(1L))
                .thenReturn(DashboardStatsResponse.builder()
                        .totalLogs(0).totalMinutes(0).activeCategories(0)
                        .logsThisWeek(0).streakDays(0)
                        .activityLast7Days(List.of())
                        .topCategories(List.of())
                        .build());
        when(userMapper.toProfileResponse(user)).thenReturn(null);

    }
}
