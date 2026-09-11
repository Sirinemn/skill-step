package com.skillstep.user.mapper;

import com.skillstep.user.domain.User;
import com.skillstep.user.dto.UpdateProfileRequest;
import com.skillstep.user.dto.UserProfileResponse;
import org.mapstruct.*;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface UserMapper {

    UserProfileResponse toProfileResponse(User user);

    // MapStruct mappe tous les champs y compris les nulls
    @Mapping(target = "id",         ignore = true)
    @Mapping(target = "email",      ignore = true)
    @Mapping(target = "firstName",  ignore = true)
    @Mapping(target = "lastName",   ignore = true)
    @Mapping(target = "provider",   ignore = true)
    @Mapping(target = "providerId", ignore = true)
    @Mapping(target = "avatarUrl",  ignore = true)
    @Mapping(target = "createdAt",  ignore = true)
    @Mapping(target = "updatedAt",  ignore = true)
    void updateUserFromRequest(UpdateProfileRequest request,
                               @MappingTarget User user);
}
