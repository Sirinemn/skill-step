package com.skillstep.user.dto;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.validator.constraints.URL;

@Getter
@Setter
@NoArgsConstructor
public class UpdateProfileRequest {

    @Size(max = 255, message = "Le titre ne peut pas dépasser 255 caractères")
    private String headline;

    @Size(max = 2000, message = "La bio ne peut pas dépasser 2000 caractères")
    private String bio;

    @Size(max = 150, message = "Le poste visé ne peut pas dépasser 150 caractères")
    private String targetRole;

    @URL(message = "L'URL LinkedIn n'est pas valide")
    @Size(max = 255)
    private String linkedinUrl;

    @URL(message = "L'URL GitHub n'est pas valide")
    @Size(max = 255)
    private String githubUrl;
}
