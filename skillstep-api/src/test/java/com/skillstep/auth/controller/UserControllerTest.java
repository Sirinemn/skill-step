package com.skillstep.auth.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.skillstep.user.controller.UserController;
import com.skillstep.user.domain.User;
import com.skillstep.user.dto.UpdateProfileRequest;
import com.skillstep.user.dto.UserProfileResponse;
import com.skillstep.user.mapper.UserMapper;
import com.skillstep.user.service.IUserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;

import java.util.Optional;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(UserController.class)
@ActiveProfiles("test")
public class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private IUserService userService;

    @MockitoBean
    private UserMapper userMapper;
    User user;
    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        user = User.builder()
                .id(1L)
                .email("john@test.fr")
                .firstName("John")
                .lastName("Doe")
                .build();

    }

    @Test
    @DisplayName("Test de récupération du profil utilisateur")
    void shouldReturnCurrentUserProfile() throws Exception {
        UserProfileResponse response = UserProfileResponse.builder()
                        .email(user.getEmail())
                        .firstName(user.getFirstName())
                        .lastName(user.getLastName())
                        .build();
        when(userService.findByEmail(user.getEmail()))
                .thenReturn(Optional.of(user));
        when(userMapper.toProfileResponse(user))
                .thenReturn(response);
        MockHttpServletRequestBuilder request = get("/users/me")
                .with(jwt().jwt(jwt -> jwt.claim("email", user.getEmail())));

        mockMvc.perform(request)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value(user.getEmail()));
    }
    @Test
    @DisplayName("Test de récupération du profil utilisateur non trouvé")
    void shouldReturnNotFoundWhenUserProfileNotFound() throws Exception {
        when(userService.findByEmail(user.getEmail()))
                .thenReturn(Optional.empty());
        MockHttpServletRequestBuilder request = get("/users/me")
                .with(jwt().jwt(jwt -> jwt.claim("email", user.getEmail())));

        mockMvc.perform(request)
                .andExpect(status().isNotFound());
    }
    @Test
    @DisplayName("Test mise à jour du profil utilisateur")
    void shouldUpdateUser() throws Exception {
        UserProfileResponse response = UserProfileResponse.builder()
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .build();
        when(userService.findByEmail(user.getEmail()))
                .thenReturn(Optional.of(user));
        UpdateProfileRequest updateRequest = new UpdateProfileRequest();
        updateRequest.setHeadline("Nouveau titre");
        when(userService.updateProfile(eq(user.getId()), any(UpdateProfileRequest.class)))
                .thenReturn(user);
        when(userMapper.toProfileResponse(user))
                .thenReturn(response);

        MockHttpServletRequestBuilder request = patch("/users/me")
                .with(jwt().jwt(jwt -> jwt.claim("email", user.getEmail())))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateRequest));
        mockMvc.perform(request)
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value(user.getEmail()));
    }

}
