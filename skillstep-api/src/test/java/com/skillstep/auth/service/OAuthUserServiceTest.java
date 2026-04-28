package com.skillstep.auth.service;

import com.skillstep.user.domain.User;
import com.skillstep.user.repository.UserRepository;
import com.skillstep.user.service.IUserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OAuthUserServiceTest {

    @Mock
    private IUserService userService;

    @InjectMocks
    private OAuthUserService oAuthUserService;

    private OAuth2User oAuth2User;

    @BeforeEach
    void setUp() {
        oAuth2User = mock(OAuth2User.class);

        when(oAuth2User.getAttribute("sub")).thenReturn("google-sub-123");
        when(oAuth2User.getAttribute("email")).thenReturn("alice@example.com");
        when(oAuth2User.getAttribute("given_name")).thenReturn("Alice");
        when(oAuth2User.getAttribute("family_name")).thenReturn("Martin");
        when(oAuth2User.getAttribute("picture")).thenReturn("https://avatar.url/alice.jpg");
    }

    @Test
    @DisplayName("Doit extraire les infos OAuth Google et déléguer à UserService")
    void shouldProcessOAuthUser() {
        User expectedUser = User.builder()
                .email("alice@example.com")
                .firstName("Alice")
                .lastName("Martin")
                .avatarUrl("https://avatar.url/alice.jpg")
                .provider("google")
                .providerId("google-sub-123")
                .build();

        when(userService.findOrCreate(
                "alice@example.com",
                "Alice",
                "Martin",
                "https://avatar.url/alice.jpg",
                "google",
                "google-sub-123"
        )).thenReturn(expectedUser);

        User result = oAuthUserService.processOAuthUser(oAuth2User, "google");

        assertThat(result).isNotNull();
        assertThat(result.getEmail()).isEqualTo("alice@example.com");
        assertThat(result.getFirstName()).isEqualTo("Alice");
        assertThat(result.getProvider()).isEqualTo("google");

        verify(userService).findOrCreate(
                "alice@example.com",
                "Alice",
                "Martin",
                "https://avatar.url/alice.jpg",
                "google",
                "google-sub-123"
        );
    }
}
