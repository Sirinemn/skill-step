package com.skillstep.dashboard.controller;


import com.skillstep.dashboard.dto.DashboardStatsResponse;
import com.skillstep.dashboard.service.IDashboardService;
import com.skillstep.learninglog.controller.CategoryController;
import com.skillstep.user.domain.User;
import com.skillstep.user.service.IUserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.request.RequestPostProcessor;

import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(DashboardController.class)
@ActiveProfiles("test")
public class DashboardControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    IDashboardService dashboardService;
    @MockitoBean
    IUserService userService;

    RequestPostProcessor requestPostProcessor;
    User userMock;

    @Test
    void shouldGetStats() throws Exception {
        userMock = User.builder()
                .id(1L)
                .firstName("John")
                .lastName("Doe")
                .email("johdoe.fr")
                .build();
        requestPostProcessor = jwt().jwt(jwt -> jwt.claim("email", userMock.getEmail()));

        when(userService.findByEmail(userMock.getEmail()))
                .thenReturn(Optional.of(userMock));
        when(dashboardService.getStats(userMock.getId())).thenReturn(any(DashboardStatsResponse.class));

        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders
                .get("/dashboard/stats")
                        .with(requestPostProcessor);
        mockMvc.perform(requestBuilder)
                .andExpect(status().isOk());
    }

}
