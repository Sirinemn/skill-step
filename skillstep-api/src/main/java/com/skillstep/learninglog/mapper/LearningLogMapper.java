package com.skillstep.learninglog.mapper;

import com.skillstep.learninglog.domain.LearningLog;
import com.skillstep.learninglog.dto.LearningLogRequest;
import com.skillstep.learninglog.dto.LearningLogResponse;
import org.mapstruct.*;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface LearningLogMapper {

    // LearningLog → LearningLogResponse
    LearningLogResponse toResponse(LearningLog log);

    // LearningLogRequest → LearningLog (création)
    // On ignore user, id et timestamps — gérés par le service
    @Mapping(target = "id",        ignore = true)
    @Mapping(target = "user",      ignore = true)
    @Mapping(target = "category",  ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    LearningLog toEntity(LearningLogRequest request);

    // Mise à jour partielle — null = on ne touche pas au champ
    @BeanMapping(nullValuePropertyMappingStrategy =
            NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id",        ignore = true)
    @Mapping(target = "user",      ignore = true)
    @Mapping(target = "category",  ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateFromRequest(LearningLogRequest request,
                           @MappingTarget LearningLog log);
}
