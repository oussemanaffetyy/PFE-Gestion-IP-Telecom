# Application de Gestion et Sécurisation d'un Réseau Telecom

Ce projet, réalisé dans le cadre d'un Projet de Fin d'Études (PFE), est une application web complète permettant la gestion et la surveillance d'un parc de sites et d'adresses IP d'un réseau de télécommunication. Il inclut un panel d'administration sécurisé et un système de détection d'anomalies.

## 🚀 Fonctionnalités

### Interface Publique

- **Vérificateur d'IP** : Une page publique permettant à n'importe quel utilisateur de vérifier si une adresse IP est autorisée ou rejetée par le système.
- **Validation d'IP** : Validation en temps réel du format de l'adresse IP saisie.

### Panel d'Administration Sécurisé

- **Authentification** : Système de connexion sécurisé par Token JWT (JSON Web Tokens).
- **Tableau de Bord** : Une vue d'ensemble avec des statistiques en temps réel sur l'état du réseau (nombre de sites, régions, IP, etc.).
- **Gestion Complète (CRUD)** :
  - Gestion des Régions
  - Gestion des Sites (avec liaisons aux régions et types)
  - Gestion des Types de Site
  - Gestion des Adresses IP (liées aux sites)
  - Gestion des VLANs (liées aux sites)
  - Gestion des Administrateurs (avec envoi d'e-mail de bienvenue)
- **Profil Administrateur** : Chaque admin peut modifier ses informations personnelles et son mot de passe, et téléverser une photo de profil.
- **Mot de Passe Oublié** : Un processus complet de réinitialisation de mot de passe par e-mail.

### Module d'Intelligence Artificielle

- **Journalisation (Logging)** : Enregistrement détaillé de chaque tentative de vérification d'IP.
- **Détection d'Anomalies** : Un système qui scanne les logs pour détecter des menaces comme les attaques par force brute.
- **Alertes Automatiques** : Envoi d'e-mails d'alerte à tous les administrateurs lorsqu'une nouvelle menace est détectée.
- **Historique des Menaces** : Un tableau de bord de sécurité pour visualiser et gérer les anomalies détectées.

## 🛠️ Technologies Utilisées

- **Frontend**: React.js, React Router, Axios, Bootstrap, `date-fns`
- **Backend**: Node.js, Express.js
- **Base de Données**: MySQL
- **Authentification**: JWT (jsonwebtoken), bcryptjs
- **Gestion des Fichiers**: Multer
- **Envoi d'E-mails**: Nodemailer
- **Tâches Automatisées**: node-cron
- **Géolocalisation IP**: geoip-lite

## 📁 Structure du Projet

Le projet est organisé en un monorepo avec deux dossiers principaux :

- **/BackEnd**: Contient le serveur Express, les routes de l'API, les contrôleurs et la logique métier.
- **/FrontEnd**: Contient l'application React, les composants, les pages et les services.

## ⚙️ Installation et Lancement

**Prérequis :** Node.js et une base de données MySQL.

### Backend

1. Naviguez vers le dossier du backend : `cd BackEnd`
2. Installez les dépendances : `npm install`
3. Créez un fichier `.env` à la racine de `BackEnd` en vous basant sur votre configuration (DB_HOST, DB_USER, etc.).
4. Démarrez le serveur : `npm start`
   Le serveur sera lancé sur `http://localhost:3001`.

### Frontend

1. Ouvrez un **nouveau terminal**.
2. Naviguez vers le dossier du frontend : `cd FrontEnd`
3. Installez les dépendances : `npm install`
4. Démarrez l'application React : `npm start`
   L'application sera accessible sur `http://localhost:3000`.

---
