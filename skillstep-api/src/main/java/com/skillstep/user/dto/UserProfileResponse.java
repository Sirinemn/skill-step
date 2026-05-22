package com.skillstep.user.dto;

import lombok.*;

@Getter
@Builder
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileResponse {

    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private String avatarUrl;
    private String headline;
    private String bio;
    private String targetRole;
    private String linkedinUrl;
    private String githubUrl;
}
