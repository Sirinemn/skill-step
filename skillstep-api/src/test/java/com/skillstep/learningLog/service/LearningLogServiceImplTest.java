package com.skillstep.learningLog.service;

import com.skillstep.learninglog.domain.Category;
import com.skillstep.learninglog.domain.LearningLog;
import com.skillstep.learninglog.dto.CategoryResponse;
import com.skillstep.learninglog.dto.LearningLogResponse;
import com.skillstep.learninglog.mapper.LearningLogMapper;
import com.skillstep.learninglog.repository.LearningLogRepository;
import com.skillstep.learninglog.service.ICategoryService;
import com.skillstep.learninglog.service.impl.LearningLogServiceImpl;
import com.skillstep.user.service.IUserService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.assertEquals;
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


}
