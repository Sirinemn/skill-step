# ════════════════════
# Étape 1 — BUILD
# Image Maven pour compiler et packager le JAR
# ════════════════════
FROM maven:3.9-eclipse-temurin-17 AS builder

WORKDIR /app

# Copie le pom.xml en premier — Docker cache cette couche
# si les dépendances n'ont pas changé
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copie le code source et compile
COPY src ./src
RUN mvn package -DskipTests -B

# ════════════════════
# Étape 2 — RUN
# Image JRE légère — pas besoin du JDK complet en prod
# eclipse-temurin:17-jre pèse ~200MB vs ~500MB pour le JDK
# ════════════════════
FROM eclipse-temurin:17-jre-alpine AS runtime

WORKDIR /app

# Crée un utilisateur non-root — bonne pratique de sécurité
# Ne jamais faire tourner une app en production en tant que root
RUN addgroup -S skillstep && adduser -S skillstep -G skillstep
USER skillstep

# Copie uniquement le JAR depuis l'étape builder
COPY --from=builder /app/target/*.jar app.jar

# Port exposé (documentation — Railway utilise $PORT)
EXPOSE 8080

# Variables d'environnement avec valeurs par défaut
ENV SPRING_PROFILES_ACTIVE=prod
ENV PORT=8080

# Démarre Spring Boot
ENTRYPOINT ["java", \
  "-Djava.security.egd=file:/dev/./urandom", \
  "-Dserver.port=${PORT}", \
  "-jar", "app.jar"]