package com.skillstep.auth.controller;

import com.skillstep.auth.service.OAuthUserService;
import com.skillstep.shared.exception.ResourceNotFoundException;
import com.skillstep.user.dto.UserProfileResponse;
import com.skillstep.user.mapper.UserMapper;
import com.skillstep.user.service.IUserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name="Authentication", description = "Authentification et profil courant")
public class AuthController {

    private final OAuthUserService oAuthUserService;
    private final IUserService userService;
    private final UserMapper userMapper;

    @GetMapping("/me")
    @Operation(
            summary = "Retourne le profil de l'utilisateur connecté",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    public ResponseEntity<UserProfileResponse> me(@AuthenticationPrincipal Jwt jwt) {
        // Le "sub" du JWT Google = providerId stocké en base
        String email = jwt.getClaimAsString("email");

        return userService.findByEmail(email)
                .map(userMapper::toProfileResponse)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Utilisateur introuvable pour l'email : " + email));
    }
}
