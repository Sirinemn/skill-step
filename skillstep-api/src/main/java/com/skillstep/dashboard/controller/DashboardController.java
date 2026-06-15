package com.skillstep.dashboard.controller;

import com.skillstep.dashboard.dto.DashboardStatsResponse;
import com.skillstep.dashboard.service.IDashboardService;
import com.skillstep.user.service.IUserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/dashboard")
@Tag(name = "Dashboard", description = "Statistiques du tableau de bord")
@SecurityRequirement(name = "bearerAuth")
public class DashboardController {

    private final IDashboardService dashboardService;
    private final IUserService userService;

    public DashboardController(IDashboardService dashboardService, IUserService userService) {
        this.dashboardService = dashboardService;
        this.userService = userService;
    }

    @GetMapping("/stats")
    @Operation(summary = "Retourne toutes les statistiques du dashboard")
    public ResponseEntity<DashboardStatsResponse> getStats(
            @AuthenticationPrincipal Jwt jwt) {

        String email  = jwt.getClaimAsString("email");
        Long   userId = userService.findByEmail(email)
                .orElseThrow().getId();

        return ResponseEntity.ok(dashboardService.getStats(userId));
    }
}
