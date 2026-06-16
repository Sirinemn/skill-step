package com.skillstep.learningLog.controller;


import com.skillstep.learninglog.controller.CategoryController;
import com.skillstep.learninglog.domain.Category;
import com.skillstep.learninglog.dto.CategoryResponse;
import com.skillstep.learninglog.service.ICategoryService;
import com.skillstep.user.domain.User;
import com.skillstep.user.service.IUserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;

import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.request.RequestPostProcessor;

import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(CategoryController.class)
@ActiveProfiles("test")
public class CategoryControllerIT {

    @Autowired
    private MockMvc mockMvc;
    @MockitoBean
    private ICategoryService categoryService;
    @MockitoBean
    private IUserService userService;

    Category categoryMock;
    User userMock;
    CategoryResponse categoryResponseMock;
    RequestPostProcessor requestPostProcessor;

    @BeforeEach
    void setUp() {
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
        categoryResponseMock = CategoryResponse.builder()
                .id(1L)
                .name("Java")
                .build();
        requestPostProcessor = jwt().jwt(jwt -> jwt.claim("email", userMock.getEmail()));
    }
    @Test
    void shouldGetAllCategories() throws Exception {
        when(categoryService.findAllByUser(any())).thenReturn(List.of(categoryResponseMock));
        when(userService.findByEmail(userMock.getEmail()))
                .thenReturn(Optional.of(userMock));
        MockHttpServletRequestBuilder request = MockMvcRequestBuilders
                .get("/categories")
                .with(requestPostProcessor);
        mockMvc.perform(request)
                .andExpect(status().isOk());
    }
    @Test
    void shouldCreateCategory() throws Exception {
        when(categoryService.create(any(), any())).thenReturn(categoryResponseMock);
        when(userService.findByEmail(userMock.getEmail()))
                .thenReturn(Optional.of(userMock));
        MockHttpServletRequestBuilder request = MockMvcRequestBuilders
                .post("/categories")
                .with(requestPostProcessor)
                .contentType("application/json")
                .content("""
                        {
                            "name": "Java",
                            "color": "#FF5733"
                        }
                        """);
        mockMvc.perform(request)
                .andExpect(status().isCreated());
    }
    @Test
    void shouldUpdateCategory() throws Exception {
        when(categoryService.update(any(), any(), any())).thenReturn(categoryResponseMock);
        when(userService.findByEmail(userMock.getEmail()))
                .thenReturn(Optional.of(userMock));
        MockHttpServletRequestBuilder request = MockMvcRequestBuilders
                .put("/categories/1")
                .with(requestPostProcessor)
                .contentType("application/json")
                .content("""
                        {
                            "name": "Java",
                            "color": "#FF5733"
                        }
                        """);
        mockMvc.perform(request)
                .andExpect(status().isOk());
    }
    @Test
    void shouldDeleteCategory() throws Exception {
        when(userService.findByEmail(userMock.getEmail()))
                .thenReturn(Optional.of(userMock));
        MockHttpServletRequestBuilder request = MockMvcRequestBuilders
                .delete("/categories/1")
                .with(requestPostProcessor);
        mockMvc.perform(request)
                .andExpect(status().isNoContent());
    }

}
