package com.skillstep.auth.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

    http
            .sessionManagement(session ->
                    // Pas de session côté serveur — chaque requête est autonome
                    session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            // CSRF inutile en mode stateless (pas de cookie de session)
            .csrf(csrf -> csrf.disable())

            // Configuration CORS pour autoriser Angular (localhost:4200 en dev)
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))

            //Règles d'accès
            .authorizeHttpRequests(auth -> auth
                    // Endpoints publics
                    .requestMatchers("/actuator/health").permitAll()
                    .requestMatchers("/swagger-ui/**", "/api-docs/**").permitAll()
                    .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll() // preflight CORS
                    // Tout le reste nécessite un JWT valide
                    .anyRequest().authenticated()

            )

            // Validation des JWT Google
            .oauth2ResourceServer(oauth2 ->
                    oauth2.jwt(jwt -> {})
            );
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of(
                "http://localhost:4200"   // Angular dev
        ));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
