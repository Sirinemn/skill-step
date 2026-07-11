package com.skillstep.auth.config;

import com.skillstep.auth.service.OAuthUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final OAuthUserService oAuthUserService;

    // ════════════════════════════════════════════════════════
    // CHAÎNE 1 — API REST (stateless, JWT, retourne 401)
    // Intercepte toutes les routes API avant la chaîne OAuth2
    // ════════════════════════════════════════════════════════
    @Bean
    @Order(1)
    public SecurityFilterChain apiFilterChain(HttpSecurity http)
            throws Exception {

        http
                // Matche uniquement les URLs d'API
                // Toute URL qui commence par ces préfixes passe par cette chaîne
                .securityMatcher(
                        "/auth/**",
                        "/users/**",
                        "/categories/**",
                        "/learning-logs/**",
                        "/dashboard/**",
                        "/reports/**",
                        "/actuator/**"
                )

                // Pas de session côté serveur — chaque requête porte son JWT
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // CSRF inutile en mode stateless
                .csrf(csrf -> csrf.disable())

                // CORS — autorise Angular
                .cors(cors ->
                        cors.configurationSource(corsConfigurationSource()))

                // Règles d'accès
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/actuator/health").permitAll()
                        .requestMatchers("/actuator/info").permitAll()
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .anyRequest().authenticated()
                )

                // Validation des JWT Google
                // Si pas de JWT ou JWT invalide → 401 (pas de redirect)
                .oauth2ResourceServer(oauth2 ->
                        oauth2.jwt(Customizer.withDefaults())
                                // ← Retourne 401 au lieu de rediriger vers Google
                                .authenticationEntryPoint(
                                        new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)
                                )
                );

        return http.build();
    }
    // ════════════════════════════════════════════════════════
    // CHAÎNE 2 — Flux OAuth2 Login (pour le navigateur)
    // Gère la redirection Google et le callback
    // ════════════════════════════════════════════════════════
    @Bean
    @Order(2)
    public SecurityFilterChain oauthFilterChain(HttpSecurity http)
            throws Exception {

        http
                // Swagger — accessible sans auth
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/swagger-ui/**",
                                "/api-docs/**",
                                "/swagger-ui.html"
                        ).permitAll()
                        .requestMatchers("/oauth2/**", "/login/**").permitAll()
                        .anyRequest().permitAll()
                )

                // Flux OAuth2 Google avec notre successHandler
                .oauth2Login(oauth2 ->
                        oauth2.successHandler(oAuth2AuthenticationSuccessHandler())
                );

        return http.build();
    }

    // ════════════════════════════════════════════════════════
    // SUCCESS HANDLER — appelé après connexion Google réussie
    // ════════════════════════════════════════════════════════
    @Bean
    public AuthenticationSuccessHandler oAuth2AuthenticationSuccessHandler() {
        return (request, response, authentication) -> {
            var token = (org.springframework.security.oauth2
                    .client.authentication.OAuth2AuthenticationToken)
                    authentication;

            oAuthUserService.processOAuthUser(
                    token.getPrincipal(),
                    token.getAuthorizedClientRegistrationId()
            );

            String idToken = ((OidcUser) token.getPrincipal())
                    .getIdToken()
                    .getTokenValue();

            response.sendRedirect(
                    "http://localhost:4200/auth/callback?token=" + idToken
            );
        };
    }
    // ════════════════════════════════════════════════════════
    // CORS — partagé entre les deux chaînes
    // ════════════════════════════════════════════════════════
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of(
                "http://localhost:4200"
        ));
        config.setAllowedMethods(List.of(
                "GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"
        ));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
