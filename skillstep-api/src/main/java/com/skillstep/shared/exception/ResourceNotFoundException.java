package com.skillstep.shared.exception;

public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }

    // "User introuvable avec l'id : 42"
    public ResourceNotFoundException(String resource, Long id) {
        super(String.format("%s introuvable avec l'id : %d", resource, id));
    }

    // "User introuvable avec l'email : alice@example.com"
    public ResourceNotFoundException(String resource, String identifier) {
        super(String.format("%s introuvable : %s", resource, identifier));
    }
}
