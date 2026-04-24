# 🚀 Skill-Step | Ton Journal d'Apprentissage Intelligent

**Skill-Step** est un SaaS conçu pour les développeurs et apprenants qui souhaitent documenter leur progression technique au quotidien. L'application permet de transformer une veille technologique informelle en un **Rapport de Veille professionnel** exportable pour les recruteurs.

---

## 🌟 Pourquoi Skill-Step ?

En tant que développeurs, nous apprenons de nouvelles choses chaque jour. Cependant, il est difficile de quantifier cette progression lors d'un entretien. **Skill-Step** résout ce problème en permettant de :
- Noter des micro-compétences en quelques secondes.
- Visualiser sa régularité via un système de "Streaks".
- Générer un récapitulatif PDF structuré de ses acquis.

---

## 🛠 Stack Technique

Ce projet est développé avec une architecture moderne et robuste, respectant les principes **SOLID** et **Clean Code**.

| Technologie | Utilisation |
| :--- | :--- |
| **Angular 17+** | Frontend réactif avec Tailwind CSS |
| **Spring Boot 3** | Backend (API REST) |
| **Spring Security** | Sécurisation via **OAuth2 (Google Login)** |
| **PostgreSQL** | Base de données relationnelle |
| **Flyway** | Gestion des migrations de base de données |
| **Docker** | Conteneurisation pour un déploiement simplifié |
| **JUnit / Mockito** | Tests unitaires et d'intégration |

---

## 📋 Roadmap & Sprints (Méthode Agile)
Le projet est réalisé suivant un découpage strict en sprints pour garantir une livraison continue (MVP) :
## 🏗 Structure du Projet
```text
skill-step/
├── skillstep-api/   # Backend Spring Boot
└── skillstep-ui/    # Frontend Angular
```
---

## 🚀 Installation & Lancement

### Pré-requis
- **Java 17+**
- **Node.js** (v18+) & **Angular CLI**
- **Docker** & **Docker Compose**

### Lancement du Backend
```bash
cd skillstep-api
./mvnw spring-boot:run
```

### Lancement du Frontend
```bash
cd skillstep-ui
npm install
ng serve
```

## 👩‍💻 À propos de l'auteur
Sirine MNAFFAKH - Conceptrice Développeuse Full-Stack

Passionnée par l'ingénierie logicielle et le partage de connaissances. Ce projet fait partie de ma démarche de "Build in Public" pour documenter ma montée en compétence continue et partager mon aventure technique avec la communauté.

Projet sous licence MIT. Réalisé avec ❤️ pour la communauté des développeurs.
