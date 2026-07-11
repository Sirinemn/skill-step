package com.skillstep.report.controller;

import com.skillstep.auth.config.SecurityConfig;
import com.skillstep.auth.service.OAuthUserService;
import com.skillstep.report.service.IReportService;
import com.skillstep.user.domain.User;
import com.skillstep.user.service.IUserService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


@WebMvcTest(ReportController.class)
@Import(SecurityConfig.class)
public class ReportControllerTest {
    @Autowired
    MockMvc mockMvc;
    @MockitoBean
    IReportService reportService;
    @MockitoBean
    IUserService userService;
    private final User mockUser = User.builder()
            .id(1L).email("sirine@example.com")
            .firstName("Sirine").lastName("Mnaffakh")
            .build();
    @MockitoBean
    OAuthUserService oAuthUserService;
    @Test
    @DisplayName("GET /reports/generate?period=30 — doit retourner un PDF")
    void generate_shouldReturnPdf_withPeriod() throws Exception {
        when(userService.findByEmail("sirine@example.com"))
                .thenReturn(Optional.of(mockUser));
        when(reportService.generatePdf(eq(1L), any()))
                .thenReturn(new byte[]{1, 2, 3});
        mockMvc.perform(get("/reports/generate")
                        .param("period", "30")
                        .with(jwt().jwt(j -> j
                                .claim("email", "sirine@example.com"))))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/pdf"))
                .andExpect(header().string("Content-Disposition",
                        org.hamcrest.Matchers.containsString(
                                "attachment; filename=\"skillstep-rapport-")));
    }
    @Test
    @DisplayName("GET /reports/generate sans token — doit retourner 401")
    void generate_shouldReturn401_whenNoToken() throws Exception {
        mockMvc.perform(get("/reports/generate")
                        .param("period", "30"))
                .andExpect(status().isUnauthorized());
    }
    @Test
    @DisplayName("GET /reports/generate?from=...&to=... — période personnalisée")
    void generate_shouldReturnPdf_withCustomPeriod() throws Exception {
        when(userService.findByEmail("sirine@example.com"))
                .thenReturn(Optional.of(mockUser));
        when(reportService.generatePdf(eq(1L), any()))
                .thenReturn(new byte[]{1, 2, 3});

        mockMvc.perform(get("/reports/generate")
                        .param("from", "2026-06-01")
                        .param("to",   "2026-06-24")
                        .with(jwt().jwt(j -> j
                                .claim("email", "sirine@example.com"))))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/pdf"));
    }
}
