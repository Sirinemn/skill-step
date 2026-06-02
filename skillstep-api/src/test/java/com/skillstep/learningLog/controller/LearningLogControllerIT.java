package com.skillstep.learningLog.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.skillstep.learninglog.controller.LearningLogController;
import com.skillstep.learninglog.domain.Category;
import com.skillstep.learninglog.domain.LearningLog;
import com.skillstep.learninglog.dto.CategoryResponse;
import com.skillstep.learninglog.dto.LearningLogResponse;
import com.skillstep.learninglog.service.ILearningLogService;
import com.skillstep.user.domain.User;
import com.skillstep.user.service.IUserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.request.RequestPostProcessor;


import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ActiveProfiles("test")
@WebMvcTest(LearningLogController.class)
public class LearningLogControllerIT {
    @Autowired
    private MockMvc mockMvc;
    @MockitoBean
    private ILearningLogService learningLogService;
    @MockitoBean
    private IUserService userService;
    @Autowired
    private ObjectMapper objectMapper;
    User userMock;
    LearningLog learningLogMock;
    Category categoryMock;
    RequestPostProcessor requestPostProcessor;
    LearningLogResponse learningLogResponseMock;


    @BeforeEach
    void setUp() {
        learningLogMock = LearningLog.builder()
                .id(1L)
                .title("Apprentissage Java")
                .description("J'ai appris les bases de Java.")
                .logDate(java.time.LocalDate.now())
                .build();
        userMock = User.builder()
                .id(1L)
                .firstName("John")
                .lastName("Doe")
                .email("johdoe.fr")
                .build();
        categoryMock = Category.builder()
                .id(1L)
                .name("Java")
                .user(userMock)
                .build();
        learningLogResponseMock = LearningLogResponse.builder()
                .id(1L)
                .title("Apprentissage Java")
                .description("J'ai appris les bases de Java.")
                .durationMin(60)
                .logDate(java.time.LocalDate.now())
                .category(CategoryResponse.builder()
                        .id(1L)
                        .name("Java")
                        .build())
                .build();

        requestPostProcessor = jwt().jwt(jwt -> jwt.claim("email", userMock.getEmail()));
    }
    @Test
    void shouldGetAllLearningLogs() throws Exception {
        when(learningLogService.findAll(any(), any(), any(), any(), any(), any()))
                .thenReturn((Page<LearningLogResponse>) new PageImpl<>(List.of(learningLogResponseMock)));
        when(userService.findByEmail(userMock.getEmail()))
                .thenReturn(Optional.of(userMock));
        mockMvc.perform(
                        org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get("/learning-logs")
                                .with(requestPostProcessor)
                )
                .andExpect(status().isOk());
    }
    @Test
    void shouldGetLearningLogById() throws Exception {
        when(learningLogService.findById(any(), any()))
                .thenReturn(learningLogResponseMock);
        when(userService.findByEmail(userMock.getEmail()))
                .thenReturn(Optional.of(userMock));
        mockMvc.perform(
                        org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get("/learning-logs/1")
                                .with(requestPostProcessor)
                )
                .andExpect(status().isOk());
    }
    @Test
    void shouldCreateLearningLog() throws Exception {
        when(learningLogService.create(any(), any()))
                .thenReturn(learningLogResponseMock);
        when(userService.findByEmail(userMock.getEmail()))
                .thenReturn(Optional.of(userMock));
        mockMvc.perform(
                        MockMvcRequestBuilders.post("/learning-logs")
                                .with(requestPostProcessor)
                                .contentType("application/json")
                                .content("""
                                        {
                                            "title": "Apprentissage Java",
                                            "description": "J'ai appris les bases de Java.",
                                            "durationMin": 60,
                                            "logDate": "2024-06-01",
                                            "resourceUrl": "https://www.example.com/java-tutorial",
                                            "categoryId": 1
                                        }
                                        """)
                )
                .andExpect(status().isCreated());
    }
    @Test
    void shouldUpdateLearningLog() throws Exception {
        when(learningLogService.update(any(), any(), any()))
                .thenReturn(learningLogResponseMock);
        when(userService.findByEmail(userMock.getEmail()))
                .thenReturn(Optional.of(userMock));
        mockMvc.perform(
                        MockMvcRequestBuilders.put("/learning-logs/1")
                                .with(requestPostProcessor)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(learningLogResponseMock))
                )
                .andExpect(status().isOk());
    }
     @Test
    void shouldDeleteLearningLog() throws Exception {
         when(userService.findByEmail(userMock.getEmail()))
                 .thenReturn(Optional.of(userMock));
         mockMvc.perform(
                         MockMvcRequestBuilders.delete("/learning-logs/1")
                                 .with(requestPostProcessor)
                 )
                 .andExpect(status().isNoContent());
    }
}
