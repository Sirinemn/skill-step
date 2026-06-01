package com.skillstep.learningLog.service;

import com.skillstep.learninglog.domain.Category;
import com.skillstep.learninglog.dto.CategoryRequest;
import com.skillstep.learninglog.dto.CategoryResponse;
import com.skillstep.learninglog.mapper.CategoryMapper;
import com.skillstep.learninglog.repository.CategoryRepository;
import com.skillstep.learninglog.service.ICategoryService;
import com.skillstep.learninglog.service.ILearningLogService;
import com.skillstep.learninglog.service.impl.CategoryServiceImpl;
import com.skillstep.user.domain.User;
import com.skillstep.user.service.IUserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@ActiveProfiles("test")
public class CategoryServiceImplTest {

    @InjectMocks
    private CategoryServiceImpl categoryService;
    @Mock
    private CategoryMapper categoryMapper;

    @Mock
    CategoryRepository categoryRepository;
    @Mock
    private IUserService userService;
    @Mock
    private ILearningLogService learningLogService;
    User userMock;
    Category categoryMock;

    @BeforeEach
    void setUp() {
        userMock = User.builder()
                .id(1L)
                .email("john@doe.fr")
                .firstName("John")
                .build();
        categoryMock = Category.builder()
                .id(1L)
                .name("Java")
                .color("#FF0000")
                .user(userMock)
                .build();
    }
    @Test
    void findAllByUser() {
        when(categoryRepository.findByUserIdOrderByNameAsc(1L))
                .thenReturn(List.of(categoryMock));
        when(categoryMapper.toResponse(categoryMock))
                .thenReturn(new CategoryResponse(1L, "Java", "#FF0000"));

        List<CategoryResponse> responses = categoryService.findAllByUser(1L);
            assert(responses.size() == 1);
            assert(responses.get(0).getName().equals("Java"));
    }

    @Test
    void shouldCreateCategory() {
        when(userService.findById(1L)).thenReturn(userMock);
        when(categoryRepository.save(categoryMock))
                .thenReturn(categoryMock);
        when(categoryRepository.existsByNameIgnoreCaseAndUserId("Java", 1L))
                .thenReturn(false);
        when(categoryMapper.toResponse(categoryMock))
                .thenReturn(new CategoryResponse(1L, "Java", "#FF0000"));
        when(categoryMapper.toEntity(any(CategoryRequest.class)))
                .thenReturn(categoryMock);

        CategoryResponse response = categoryService.create(1L, new CategoryRequest("Java", "#FF0000"));
        assert(response.getName().equals("Java"));
    }

    @Test
    void shouldNotCreateDuplicateCategory() {
        when(categoryRepository.existsByNameIgnoreCaseAndUserId("Java", 1L))
                .thenReturn(true);

        try {
            categoryService.create(1L, new CategoryRequest("Java", "#FF0000"));
            assert false; // on ne doit pas atteindre cette ligne
        } catch (Exception e) {
            assert e.getMessage().contains("Vous avez déjà une catégorie nommée");
        }
    }
    @Test
    void shouldUpdateCategory() {
        when(categoryRepository.findByIdAndUserId(1L, 1L))
                .thenReturn(java.util.Optional.of(categoryMock));
        when(categoryRepository.existsByNameIgnoreCaseAndUserId("Python", 1L))
                .thenReturn(false);
        when(categoryMapper.toResponse(any(Category.class)))
                .thenReturn(new CategoryResponse(1L, "Python", "#FF0000"));

        CategoryResponse response = categoryService.update(1L, 1L, new CategoryRequest("Python", "#FF0000"));
        assert(response.getName().equals("Python"));
    }
    @Test
    void shouldNotUpdateToDuplicateCategory() {
        when(categoryRepository.findByIdAndUserId(1L, 1L))
                .thenReturn(java.util.Optional.of(categoryMock));
        when(categoryRepository.existsByNameIgnoreCaseAndUserId("Python", 1L))
                .thenReturn(true);

        try {
            categoryService.update(1L, 1L, new CategoryRequest("Python", "#FF0000"));
            assert false; // on ne doit pas atteindre cette ligne
        } catch (Exception e) {
            assert e.getMessage().contains("Vous avez déjà une catégorie nommée");
        }
    }
    @Test
    void shouldDeleteCategory() {
        when(categoryRepository.findByIdAndUserId(1L, 1L))
                .thenReturn(java.util.Optional.of(categoryMock));
        when(learningLogService.existsByCategoryId(1L))
                .thenReturn(false);

        try {
            categoryService.delete(1L, 1L);
            assert true; // suppression réussie
        } catch (Exception e) {
            assert false; // on ne doit pas atteindre cette ligne
        }
    }
}
