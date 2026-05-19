package com.skillstep.user.controller;

import com.skillstep.user.domain.User;
import com.skillstep.user.dto.UpdateProfileRequest;
import com.skillstep.user.dto.UserProfileResponse;
import com.skillstep.user.mapper.UserMapper;
import com.skillstep.user.service.IUserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@Tag(name = "Users", description = "Gestion du profil utilisateur")
public class UserController {

    private final IUserService userService;
    private final UserMapper userMapper;

    @GetMapping("/me")
    @Operation(
            summary  = "Récupère le profil de l'utilisateur connecté",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    public ResponseEntity<UserProfileResponse> getMyProfile(
            @AuthenticationPrincipal Jwt jwt) {

        String email = jwt.getClaimAsString("email");

        return userService.findByEmail(email)
                .map(userMapper::toProfileResponse)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    @PatchMapping("/me")
    @Operation(
            summary  = "Met à jour le profil de l'utilisateur connecté",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    public ResponseEntity<UserProfileResponse> updateMyProfile(
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody UpdateProfileRequest request) {

        // On récupère l'utilisateur par email depuis le JWT
        String email = jwt.getClaimAsString("email");
        Long userId  = userService.findByEmail(email)
                .orElseThrow()
                .getId();

        User updated = userService.updateProfile(userId, request);
        return ResponseEntity.ok(userMapper.toProfileResponse(updated));
    }
}
