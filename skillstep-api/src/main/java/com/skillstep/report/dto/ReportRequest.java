package com.skillstep.report.dto;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReportRequest {
    // Période prédéfinie : 7, 30, 90 — null si période personnalisée
    private Integer period;

    // Période personnalisée — null si période prédéfinie
    private LocalDate from;
    private LocalDate to;
}
