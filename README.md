# CandiTrack

![CI](https://github.com/ssoumayabenhamadi/canditrack/actions/workflows/ci.yml/badge.svg)

Application de suivi de candidatures avec analyse IA des offres d'emploi.

## Fonctionnalités

- Inscription, connexion et routes protégées (jetons Sanctum)
- Gestion des candidatures : ajout, modification, suppression
- Filtres par statut : à postuler, envoyée, entretien, offre, refus
- Rappel de relance après 7 jours sans réponse
- Chaque utilisateur n'accède qu'à ses propres candidatures (policy Laravel)

## Stack

- **Back-end** : Laravel (API REST), Sanctum
- **Front-end** : React, TypeScript, Vite, React Router, Tailwind CSS
- **Tests** : Pest (API), Cypress (end-to-end)
- **CI** : GitHub Actions (tests back et front à chaque push)

## Lancer le projet en local

### Back-end
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```
API disponible sur http://127.0.0.1:8000

### Front-end
```bash
cd frontend
npm install
npm run dev
```
Application disponible sur http://localhost:5173

## Tests

```bash
# Tests de l'API (Pest)
cd backend
php artisan test

# Tests end-to-end (Cypress)
cd frontend
npm run test:e2e
```

## Statut

🚧 En cours de développement : traduction FR / EN et analyse IA des offres à venir.