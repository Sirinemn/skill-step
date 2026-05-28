package com.skillstep.user.service;

import com.skillstep.user.domain.User;
import com.skillstep.user.dto.UpdateProfileRequest;

import java.util.Optional;

public interface IUserService {

    //Crée un nouvel utilisateur ou met à jour ses infos si déjà existant.
    // Pattern upsert déclenché à chaque connexion OAuth2.
    User findOrCreate(String email,
                      String firstName,
                      String lastName,
                      String avatarUrl,
                      String provider,
                      String providerId);

    //Récupère un utilisateur par son email.
    Optional<User> findByEmail(String email);

    //Récupère un utilisateur par son ID.
    User findById(Long id);

    //Met à jour les informations de profil éditables par l'utilisateur.
    // Mise à jour partielle du profil
    User updateProfile(Long userId, UpdateProfileRequest request);

    User getReferenceById(Long userId);
}
