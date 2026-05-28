package com.skillstep.learninglog.mapper;

import com.skillstep.learninglog.domain.Category;
import com.skillstep.learninglog.dto.CategoryRequest;
import com.skillstep.learninglog.dto.CategoryResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface CategoryMapper {

    CategoryResponse toResponse(Category category);

    @Mapping(target = "id",        ignore = true)
    @Mapping(target = "user",      ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    Category toEntity(CategoryRequest request);
}
