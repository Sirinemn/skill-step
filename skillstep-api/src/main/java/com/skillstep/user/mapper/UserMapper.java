package com.skillstep.user.mapper;

import com.skillstep.user.domain.User;
import com.skillstep.user.dto.UpdateProfileRequest;
import com.skillstep.user.dto.UserProfileResponse;
import org.mapstruct.*;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface UserMapper {

    UserProfileResponse toProfileResponse(User user);

    // MapStruct mappe tous les champs y compris les nulls
    void updateUserFromRequest(UpdateProfileRequest request,
                               @MappingTarget User user);
}
