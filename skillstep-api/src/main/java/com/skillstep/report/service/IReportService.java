package com.skillstep.report.service;

import com.skillstep.report.dto.ReportRequest;

public interface IReportService {
    byte[] generatePdf(Long userId, ReportRequest request);
}
