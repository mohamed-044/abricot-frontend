# Abricot - Frontend

Frontend de l’application Abricot, construit avec Next.js 16 et React 19.

Cette application permet de gérer des projets, des tâches et des collaborateurs via une interface connectée à une API backend.

## Structure

- `src/app/` : pages et routes du router App
- `src/components/` : composants UI réutilisables
- `src/context/` : contexte d’authentification et état global
- `src/services/` : appels API vers le backend
- `src/lib/` : configuration Axios et React Query

## Prérequis

- Node.js 20+
- npm
- Backend `dev-react-P10` en cours d’exécution sur `http://localhost:8000`

## Installation

```bash
cd abricot-frontend
npm install
```

## Lancer l’application

```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## Principales fonctionnalités

- authentification JWT
- profil utilisateur avec modification du nom, de l’email et du mot de passe
- gestion des projets et des collaborateurs
- affichage des tâches au format liste et kanban
- actions de création, mise à jour et suppression pour projets et tâches
- notifications via `sonner`

## Scripts disponibles

- `npm run dev` : lance le frontend en développement
- `npm run build` : construit l’application pour la production
- `npm run start` : démarre l’application en production
- `npm run lint` : lance ESLint

## Configuration

- La configuration Next.js se trouve dans `next.config.mjs`
- Les appels API sont centralisés dans `src/lib/api.js`
- Le backend doit être démarré séparément dans `dev-react-P10`

## Notes

- Le frontend utilise React Query pour la gestion des requêtes et du cache
- La validation des formulaires est gérée avec `react-hook-form` et `zod`
- Les routes client sont définies dans le dossier `src/app`

## Backend associé

Le frontend doit communiquer avec le backend `dev-react-P10` :

- authentification : `/auth/login`, `/auth/register`, `/auth/profile`, `/auth/password`
- projets : `/projects`
- tâches : `/tasks`
- commentaires : `/comments`

---

Ce README décrit le frontend seulement. Pour démarrer l’ensemble du projet, lancez d’abord le backend `dev-react-P10` puis le frontend `abricot-frontend`.

## Exemple de fichier `.env`

Créez un fichier `.env.local` à la racine de `abricot-frontend/` adaptez les valeurs si nécessaire :

```env
# JWT_SECRET="jwtsecret"
```

Redémarrez le serveur frontend après avoir modifié les variables d'environnement.
