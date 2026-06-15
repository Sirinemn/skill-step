package com.skillstep.dashboard.service;

import com.skillstep.dashboard.dto.DashboardStatsResponse;

public interface IDashboardService {
    DashboardStatsResponse getStats(Long userId);
}
