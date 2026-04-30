package com.skillstep.user.mapper;

import com.skillstep.user.domain.User;
import com.skillstep.user.dto.UserProfileResponse;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface UserMapper {

    UserProfileResponse toProfileResponse(User user);
}
