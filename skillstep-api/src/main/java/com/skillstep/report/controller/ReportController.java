package com.skillstep.report.controller;

import com.skillstep.report.dto.ReportRequest;
import com.skillstep.report.service.IReportService;
import com.skillstep.user.service.IUserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@RestController
@RequestMapping("/reports")
@RequiredArgsConstructor
@Tag(name = "Reports", description = "Génération de rapports PDF")
@SecurityRequirement(name = "bearerAuth")
public class ReportController {

    private final IReportService reportService;
    private final IUserService userService;

    @GetMapping("/generate")
    @Operation(summary = "Génère un rapport PDF pour la période donnée")
    public ResponseEntity<byte[]> generate(
            @AuthenticationPrincipal Jwt jwt,
            @RequestParam(required = false) Integer period,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {

        Long userId = userService
                .findByEmail(jwt.getClaimAsString("email"))
                .orElseThrow().getId();

        ReportRequest request = new ReportRequest();
        request.setPeriod(period);
        request.setFrom(from);
        request.setTo(to);

        byte[] pdf = reportService.generatePdf(userId, request);

        // Nom du fichier : skillstep-rapport-2026-06-24.pdf
        String filename = "skillstep-rapport-"
                + LocalDate.now().format(DateTimeFormatter.ISO_DATE)
                + ".pdf";

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }
}
