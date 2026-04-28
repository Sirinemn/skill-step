package com.skillstep.user.service;

import com.skillstep.shared.exception.ResourceNotFoundException;
import com.skillstep.user.domain.User;
import com.skillstep.user.repository.UserRepository;
import com.skillstep.user.service.impl.UserServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class UserServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserServiceImpl userService;

    User userMock;

    @BeforeEach
    void Setup() {
         userMock = User.builder()
                .email("john@doe.fr")
                .firstName("John")
                .lastName("Doe")
                .provider("google")
                .providerId("123456789")
                .build();
    }

    @Test
    @DisplayName("findOrCreate — doit créer un utilisateur si inconnu")
    void findOrCreate_shouldCreateUser_whenNotFound() {
        when(userRepository.findByProviderAndProviderId("google", "123456789"))
                .thenReturn(Optional.empty());
        when(userRepository.save(any(User.class)))
                .thenAnswer(invocation -> invocation.getArgument(0)); // retourne l'utilisateur passé en argument.

        User result = userService.findOrCreate(userMock.getEmail(), userMock.getFirstName(), userMock.getLastName(),
                userMock.getAvatarUrl(), userMock.getProvider(), userMock.getProviderId());

        assertEquals(result.getEmail(),userMock.getEmail());
        assertEquals(result.getProvider(),userMock.getProvider());
        verify(userRepository).save(any(User.class));
    }

    @Test
    @DisplayName("findOrCreate — doit retourner l'utilisateur existant si trouvé")
    void findOrcreate_shouldSyncGoogleFields_whenUserExists() {
        when(userRepository.findByProviderAndProviderId("google", "123456789"))
                .thenReturn(Optional.of(userMock));
        when(userRepository.save(any(User.class)))
                .thenAnswer(invocation -> invocation.getArgument(0)); // retourne l'utilisateur passé en argument.

        User result = userService.findOrCreate(userMock.getEmail(), userMock.getFirstName(), userMock.getLastName(),
                userMock.getAvatarUrl(), userMock.getProvider(), userMock.getProviderId());

        assertEquals(result.getEmail(),userMock.getEmail());
        verify(userRepository).save(userMock);
    }

    @Test
    @DisplayName("findByEmail — doit retourner un utilisateur existant")
    void findByEmail () {
        when(userRepository.findByEmail(userMock.getEmail())).thenReturn(Optional.of(userMock));

        Optional<User> result = userService.findByEmail(userMock.getEmail());

        verify(userRepository).findByEmail(userMock.getEmail());

    }
    @Test
    @DisplayName("findById — doit lever ResourceNotFoundException si ID inconnu")
    void findById_shouldThrow_whenUserNotFound() {
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.findById(99L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("99");
    }
}
