package com.skillstep.shared.exception;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Builder;
import lombok.Getter;

import java.time.OffsetDateTime;
import java.util.List;

@Getter
@Builder
public class ApiError {

    private int status;
    private String code;
    private String message;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ssXXX")
    private OffsetDateTime timestamp;

    private List<FieldError> errors; // pour les erreurs de validation (nullable)


    @Getter
    @Builder
    public static class FieldError {
        private String field;
        private String rejectedValue;
        private String message;
    }

    //Factory metho - évite d'avoir à faire ApiError.builder()... à chaque fois
    public static ApiError of(int status, String code, String message) {
        return ApiError.builder()
                .status(status)
                .code(code)
                .message(message)
                .timestamp(OffsetDateTime.now())
                .build();
    }

     public static ApiError of(int status, String code, String message, List<FieldError> errors) {
        return ApiError.builder()
                .status(status)
                .code(code)
                .message(message)
                .timestamp(OffsetDateTime.now())
                .errors(errors)
                .build();
    }
}
