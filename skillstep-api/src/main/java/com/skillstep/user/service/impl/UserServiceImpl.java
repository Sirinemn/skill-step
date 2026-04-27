package com.skillstep.user.service.impl;

import com.skillstep.user.domain.User;
import com.skillstep.user.repository.UserRepository;
import com.skillstep.user.service.IUserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements IUserService {

    private final UserRepository userRepository;

    @Override
    @Transactional
    public User findOrCreate(String email, String firstName, String lastName,
                             String avatarUrl, String provider, String providerId) {

        return userRepository
                .findByProviderAndProviderId(provider, providerId)
                .map(existing -> syncGoogleFields(existing, firstName, lastName, avatarUrl))
                .orElseGet(() -> createUser(email, firstName, lastName, avatarUrl, provider, providerId));
    }
    @Override
    @Transactional(readOnly = true)
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    @Transactional(readOnly = true)
    public User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", id));
    }
    @Override
    @Transactional
    public User updateProfile(Long userId, String headline, String bio,
                              String targetRole, String linkedinUrl, String githubUrl) {
        User user = findById(userId);
        user.setHeadline(headline);
        user.setBio(bio);
        user.setTargetRole(targetRole);
        user.setLinkedinUrl(linkedinUrl);
        user.setGithubUrl(githubUrl);
        // Pas besoin d'appeler save() explicitement :
        // l'entité est "managed" dans le contexte JPA, les changements
        // sont flushés automatiquement en fin de transaction (@Transactional)
        return user;
    }

    // --- méthodes privées ---
    private User syncGoogleFields(User user, String firstName, String lastName, String avatarUrl) {
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setAvatarUrl(avatarUrl);
        log.debug("Utilisateur synchronisé depuis Google : {}", user.getEmail());
        return userRepository.save(user);
    }

    private User createUser(String email, String firstName, String lastName,
                            String avatarUrl, String provider, String providerId) {
        User newUser = User.builder()
                .email(email)
                .firstName(firstName)
                .lastName(lastName)
                .avatarUrl(avatarUrl)
                .provider(provider)
                .providerId(providerId)
                .build();
        log.info("Nouvel utilisateur créé via {} : {}", provider, email);
        return userRepository.save(newUser);
    }
}
