# 🚀 Skill-Step | Ton Journal d'Apprentissage Intelligent

> **MVP Full-Stack** — Angular 17+ / Spring Boot 3 / PostgreSQL

**Skill-Step** est un SaaS conçu pour les développeurs et apprenants qui souhaitent documenter leur progression technique au quotidien. L'application permet de transformer une veille technologique informelle en un **Rapport de Veille professionnel** exportable pour les recruteurs.

---

## 🌟 Pourquoi Skill-Step ?

En tant que développeurs, nous apprenons de nouvelles choses chaque
jour. Skill-Step résout le problème de quantification lors d'un
entretien en permettant de :

- 📝 Noter des micro-compétences en quelques secondes
- 📊 Visualiser sa régularité via un système de "Streaks"
- 📄 Générer un rapport PDF structuré pour les recruteurs
- 🏷️ Organiser ses apprentissages par catégories libres

---

## 🛠 Stack Technique

Ce projet est développé avec une architecture moderne et robuste, respectant les principes **SOLID** et **Clean Code**.

| Technologie | Utilisation |
| :--- | :--- |
| **Angular 17+** | Frontend avec signals, lazy loading, Tailwind CSS |
| **Spring Boot 3** | API REST domain-driven (SOLID, Clean Architecture) |
| **Spring Security** | OAuth2 Google + JWT Resource Server |
| **PostgreSQL** | Base de données relationnelle |
| **Flyway** | Gestion des migrations de base de données |
| **MapStruct** | Mapping entités ↔ DTOs à la compilation |
| **Thymeleaf + Flying Saucer** | Génération PDF côté serveur |
| **Docker** | Multi-stage build (JRE Alpine + Nginx) |
| **GitLab CI** | Pipeline build + test automatisé (Maven + Jest)  |
| **JUnit / Mockito** | Tests unitaires et d'intégration |

---

## 📋 Roadmap & Sprints (Méthode Agile)
Le projet est réalisé suivant un découpage strict en sprints pour garantir une livraison continue (MVP) :
## 🏗 Structure du Projet
```text
skill-step/
├── skillstep-api/          # Backend Spring Boot
│   ├── auth/               # OAuth2 + JWT
│   ├── user/               # Profil utilisateur
│   ├── learninglog/        # CRUD logs + catégories
│   ├── dashboard/          # Stats agrégées
│   ├── report/             # Génération PDF
│   └── shared/             # Exceptions, config transversale
└── skillstep-ui/           # Frontend Angular
├── core/               # Services, guards, intercepteurs
├── features/           # Pages par domaine métier
├── shared/             # Composants réutilisables
└── layouts/            # MainLayout + PublicLayout
```
---

**Principes appliqués :**
- **DIP** : interfaces systématiques (IUserService, ICategoryService...)
- **Dependency Inversion** : aucun repository injecté hors de son service
- **Lazy loading** : chaque feature chargée à la demande
- **Signals** : état réactif Angular 17+ sans BehaviorSubject

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

L'application est accessible sur `http://localhost:4200`

## 📋 Sprints réalisés

| Sprint | Thème | Statut |
|---|---|---|
| Sprint 0 | Cadrage & Design (Figma) | ✅ |
| Sprint 1 | Setup & Auth Google OAuth2 | ✅ |
| Sprint 2 | Landing Page & Dashboard | ✅ |
| Sprint 3 | CRUD Learning Logs & Catégories | ✅ |
| Sprint 4 | Dashboard Stats & UX | ✅ |
| Sprint 5 | Export PDF Recruteur | ✅ |
| Sprint 6 | Stabilisation & Déploiement | 🔵 |

---

## 👩‍💻 À propos de l'auteur

**Sirine MNAFFAKH** — Conceptrice Développeuse Full-Stack

Passionnée par l'ingénierie logicielle. Ce projet illustre
une montée en compétence complète sur une stack moderne
avec une approche Clean Architecture et SOLID.

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Sirine_Mnaffakh-blue)](
https://linkedin.com/in/sirine-mnaffakh-5563b4264)

---

Projet sous licence MIT · Réalisé avec ❤️
