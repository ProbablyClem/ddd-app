# ddd-app
# Utilisation
Pour lancer l'application, il faut exécuter la commande suivante:
```
docker-compose up --build
```

l'application serra alors accessible a l'adresse suivante:
```
http://localhost:3002
```

Connectez-vous avec l'un des utilisateurs suivants:
- Accountant:accountant
- Management:management
- Sales:sales

# Architecture
Le front est dévelopé en utilisant Nuxt et se trouve dans le dossier `front/`.
Le back est développé en utilisant NodeJs et se trouve dans le dossier `back/`.
Nous lisons les données directement a partir des fichiers CSV dans le dossier `back/data/` et n'avons pas de base de données.