package com.skillstep.user.mapper;

import com.skillstep.user.domain.User;
import com.skillstep.user.dto.UpdateProfileRequest;
import com.skillstep.user.dto.UserProfileResponse;
import org.mapstruct.*;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface UserMapper {

    UserProfileResponse toProfileResponse(User user);

    // UpdateProfileRequest → User (mise à jour partielle)
    // NullValuePropertyMappingStrategy.IGNORE = si un champ est null
    // dans le DTO, on ne l'écrase pas en base (PATCH sémantique)
    @BeanMapping(nullValuePropertyMappingStrategy =
            NullValuePropertyMappingStrategy.IGNORE)
    void updateUserFromRequest(UpdateProfileRequest request,
                               @MappingTarget User user);
}
