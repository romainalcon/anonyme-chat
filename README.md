# Anonyme Chat

Anonyme Chat est un chat en ligne anonymisé sans sauvegarde. Fonctionnant sur une base de NodeJS avec Socket.io, le chat est instantané.

![version](https://img.shields.io/badge/version-1.0.1-green)
![version](https://img.shields.io/badge/NodeJS-14.x-yellow)
![version](https://img.shields.io/badge/express-4.17.1-brightgreen)
![version](https://img.shields.io/badge/faker-5.3.1-red)
![version](https://img.shields.io/badge/socket.io-3.1.1-orange)

## Installation

Pour installer le chat en ligne, il vous suffit d'un serveur ayant NodeJS installé en version 14.x.

```
// Récupérer les fichiers
git clone git@github.com:romainalcon/anonyme-chat.git

// Acceder au nouveau répertoire
cd anonyme-chat

// Installer les packages
npm install

// Lancer le serveur
npm start
```

Un serveur se lance sur votre ordinateur au lien suivant : [http://localhost:5000](http://localhost:5000)

__Le dépôt GitHub contient déjà de quoi déployer sur [Heroku](https://www.heroku.com/)__

## Fonctionnalités

*[F] En place* __|__ *[C] En cours* __|__ *[P] Prévue*
* [F] Message en direct
* [F] Identifiant avec nombre aléatoire
* [F] Liste des utilisateurs
* [F] Message de connexion des utilisateurs
* [F] Message de déconnexion des utilisateurs
* [P] Anti-Flood des messages
* [P] Texte : *XXXXX est en train d'écrire*
* [P] Ajout de message privé

__*Pourcentage de progression : 62.5%*__ 
