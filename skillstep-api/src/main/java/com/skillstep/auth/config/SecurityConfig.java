package com.skillstep.auth.config;

import com.skillstep.auth.service.OAuthUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final OAuthUserService oAuthUserService;
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
            .oauth2Login(oauth2 -> oauth2.successHandler(oAuth2AuthenticationSuccessHandler())
                    // Après une authentification réussie, on laisse le succès se faire normalement
                    // Le JwtAuthenticationConverter s'occupera de créer un JWT pour l'utilisateur
                )
            // Validation des JWT Google
            .oauth2ResourceServer(oauth2 -> oauth2.jwt(jwt -> {})
            );

        return http.build();
    }
    @Bean
    public AuthenticationSuccessHandler oAuth2AuthenticationSuccessHandler() {
        return (request, response, authentication) -> {
            OAuth2AuthenticationToken token = (OAuth2AuthenticationToken) authentication;
            // Spring appelle OAuthUserService ici → upsert en base
            oAuthUserService.processOAuthUser(
                    token.getPrincipal(),
                    token.getAuthorizedClientRegistrationId()
            );
            // Redirige Angular avec le token Google dans l'URL
            String idToken = ((OidcUser) token.getPrincipal())
                    .getIdToken().getTokenValue();
            response.sendRedirect(
                    "http://localhost:4200/auth/callback?token=" + idToken
            );
        };
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
