package com.skillstep.shared.exception;

// Levée si un utilisateur tente d'accéder à la ressource d'un autre
public class ForbiddenException extends RuntimeException{
    public ForbiddenException(String message) {
        super(message);
    }
}
