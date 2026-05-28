package com.skillstep.learninglog.domain;

import com.skillstep.user.domain.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.OffsetDateTime;

@Entity
@Table(
        name = "categories",
        uniqueConstraints = {
                // Reflète exactement la contrainte SQL : nom unique par utilisateur
                @UniqueConstraint(
                        name       = "uq_category_name_user",
                        columnNames = {"name", "user_id"}
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    // Couleur HEX — ex: "#6C63FF"
    @Column(nullable = false, length = 7)
    private String color;

    // Relation Many-to-One vers User
    // On stocke seulement user_id en base — pas besoin de charger
    // l'objet User complet à chaque fois → FetchType.LAZY
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = OffsetDateTime.now();
    }
}
