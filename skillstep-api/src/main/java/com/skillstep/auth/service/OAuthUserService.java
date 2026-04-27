package com.skillstep.auth.service;

import com.skillstep.user.domain.User;
import com.skillstep.user.service.IUserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class OAuthUserService {

    private final IUserService userService;

    public User processOAuthUser(OAuth2User oAuth2User, String provider) {
        return userService.findOrCreate(
                oAuth2User.getAttribute("email"),
                oAuth2User.getAttribute("given_name"),
                oAuth2User.getAttribute("family_name"),
                oAuth2User.getAttribute("picture"),
                provider,
                oAuth2User.getAttribute("sub") // "sub" = identifiant unique Google
        );
    }
}
