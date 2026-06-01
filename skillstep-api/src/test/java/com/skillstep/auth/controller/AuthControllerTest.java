package com.skillstep.auth.controller;


import com.skillstep.user.domain.User;
import com.skillstep.user.dto.UserProfileResponse;
import com.skillstep.user.mapper.UserMapper;
import com.skillstep.user.service.IUserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AuthController.class)          // ① Charge uniquement ce controller
@ActiveProfiles("test")
public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;               // ③ Simule les requêtes HTTP

    @MockitoBean                           // ④ Remplace @MockBean déprécié
    private IUserService userService;

    @MockitoBean
    private UserMapper userMapper;

    @Test
    void shouldReturnCurrentUserProfile() throws Exception {

        User user = new User();
        user.setEmail("test@gmail.com");

        UserProfileResponse response = new UserProfileResponse();
        response.setEmail("test@gmail.com");

        when(userService.findByEmail("test@gmail.com"))
                .thenReturn(Optional.of(user));

        when(userMapper.toProfileResponse(user))
                .thenReturn(response);

        mockMvc.perform(get("/auth/me")
                        .with(jwt().jwt(jwt ->
                                jwt.claim("email", "test@gmail.com"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("test@gmail.com"));
    }


}
