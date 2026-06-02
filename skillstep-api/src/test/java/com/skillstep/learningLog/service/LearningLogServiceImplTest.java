package com.skillstep.learningLog.service;

import com.skillstep.learninglog.domain.Category;

import com.skillstep.learninglog.domain.LearningLog;
import com.skillstep.learninglog.dto.LearningLogRequest;
import com.skillstep.learninglog.dto.LearningLogResponse;
import com.skillstep.learninglog.mapper.LearningLogMapper;
import com.skillstep.learninglog.repository.LearningLogRepository;
import com.skillstep.learninglog.service.ICategoryService;
import com.skillstep.learninglog.service.impl.LearningLogServiceImpl;
import com.skillstep.user.domain.User;
import com.skillstep.user.service.IUserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.test.context.ActiveProfiles;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@ActiveProfiles("test")
public class LearningLogServiceImplTest {
    @InjectMocks
    private LearningLogServiceImpl learningLogService;
    @Mock
    private LearningLogRepository learningLogRepository;
    @Mock
    private IUserService userService;
    @Mock
    private ICategoryService categoryService;
    @Mock
    private LearningLogMapper mapper;
    User userMock;
    Category categoryMock;
    LearningLog learningLogMock;

    @BeforeEach
    void setUp() {
        userMock = new User();
        userMock.setId(1L);
        userMock.setFirstName("testuser");

        categoryMock = new Category();
        categoryMock.setId(1L);
        categoryMock.setName("Test Category");

        learningLogMock = new LearningLog(1L, "Test Title", "Test Description", null, null, "", userMock, null, null, null);
    }

    @Test
    void shouldFindAllLearningLogsByFilters() {
        // Given
        when(learningLogRepository.findByFilters(1L, 1L, null, null, null, null))
                .thenReturn(Page.empty());
        learningLogService.findAll(1L, 1L, null, null, null, null);
        // Then
        assertEquals(Page.empty(), learningLogService.findAll(1L, 1L, null, null, null, null));

    }
    @Test
    void shouldCreateLearningLog() {
        // GIVEN
        LearningLogRequest request = new LearningLogRequest("title", "description", 60, null, null, null); // Ajout du categoryId (1L) pour la cohérence

        // On simule le comportement des mocks
        when(mapper.toEntity(request)).thenReturn(learningLogMock);
        when(userService.findById(1L)).thenReturn(userMock);
        when(learningLogRepository.save(any(LearningLog.class))).thenReturn(learningLogMock);

        LearningLogResponse expectedResponse = new LearningLogResponse(1L, "title", "description", 60, null, null, null, null, null);
        when(mapper.toResponse(learningLogMock)).thenReturn(expectedResponse);
        // WHEN (On appelle la vraie méthode de ton service)
        LearningLogResponse actualResponse = learningLogService.create(1L, request);
        // Then
        // 1. On vérifie que la réponse retournée est celle attendue
        assertNotNull(actualResponse);
        assertEquals("title", actualResponse.getTitle());
        assertEquals(60, actualResponse.getDurationMin());

        // 2. On vérifie que les dépendances ont bien été appelées (très important !)
        verify(userService).findById(1L);
        verify(learningLogRepository).save(any(LearningLog.class));
        verify(mapper).toResponse(learningLogMock);
    }
    @Test
    void shouldUpdateLearningLog() {
        // Given
        LearningLogRequest request = new LearningLogRequest("updated title", "description", 90, null, null, null);

        when(learningLogRepository.findByIdAndUserId(1L, 1L)).thenReturn(Optional.of(learningLogMock));

        LearningLogResponse expectedResponse = new LearningLogResponse(1L, "updated title", "description", 90, null, null, null, null, null);
        when(mapper.toResponse(learningLogMock)).thenReturn(expectedResponse);
        // When
        LearningLogResponse actualResponse = learningLogService.update(1L, 1L, request);
        // Then
        assertNotNull(actualResponse);
        assertEquals("updated title", actualResponse.getTitle());
        assertEquals(90, actualResponse.getDurationMin());

        verify(learningLogRepository).findByIdAndUserId(1L, 1L);
        verify(mapper).toResponse(learningLogMock);
    }
    @Test
    void shouldDeleteLearningLog() {
        // Given
        when(learningLogRepository.findByIdAndUserId(1L, 1L)).thenReturn(Optional.of(learningLogMock));
        // When
        learningLogService.delete(1L, 1L);
        // Then
        verify(learningLogRepository).findByIdAndUserId(1L, 1L);
        verify(learningLogRepository).delete(learningLogMock);
    }
    @Test
    void shouldFindLearningLogByCategoryId() {
        // Given
        when(learningLogRepository.existsByCategoryId(1L))
                .thenReturn(true);
        // When
        boolean exists = learningLogService.existsByCategoryId(1L);
        // Then
        assertTrue(exists);
    }
    @Test
    void shouldNotFindLearningLogByCategoryId() {
        // Given
        when(learningLogRepository.existsByCategoryId(1L))
                .thenReturn(false);
        // When
        boolean exists = learningLogService.existsByCategoryId(1L);
        // Then
        assertFalse(exists);
    }
    @Test
    void shouldCountLearningLogsByUserId() {
        // Given
        when(learningLogRepository.countByUserId(1L))
                .thenReturn(5L);
        // When
        long count = learningLogService.countByUserId(1L);
        // Then
        assertEquals(5L, count);
    }
}
