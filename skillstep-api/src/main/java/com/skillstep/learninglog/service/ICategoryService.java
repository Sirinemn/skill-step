package com.skillstep.learninglog.service;

import com.skillstep.learninglog.dto.CategoryRequest;
import com.skillstep.learninglog.dto.CategoryResponse;

import java.util.List;

public interface ICategoryService {
    List<CategoryResponse> findAllByUser(Long userId);
    CategoryResponse       create(Long userId, CategoryRequest request);
    CategoryResponse       update(Long categoryId, Long userId, CategoryRequest request);
    void                   delete(Long categoryId, Long userId);
}
