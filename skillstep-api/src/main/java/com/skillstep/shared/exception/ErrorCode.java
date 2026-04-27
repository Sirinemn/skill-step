package com.skillstep.shared.exception;

public final class ErrorCode {

    private ErrorCode() {} // classe utilitaire, non instanciable

    // Ressources
    public static final String USER_NOT_FOUND        = "USER_NOT_FOUND";
    public static final String RESOURCE_NOT_FOUND    = "RESOURCE_NOT_FOUND";

    // Validation
    public static final String VALIDATION_FAILED     = "VALIDATION_FAILED";

    // Sécurité
    public static final String UNAUTHORIZED          = "UNAUTHORIZED";
    public static final String FORBIDDEN             = "FORBIDDEN";

    // Serveur
    public static final String INTERNAL_ERROR        = "INTERNAL_ERROR";

    // Métier (à enrichir au fil des sprints)
    public static final String DUPLICATE_EMAIL       = "DUPLICATE_EMAIL";
}
