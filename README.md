# Simple Posts Management

## Description
Une API REST simple permettant la gestion de publications (posts). Ce projet est une base pour apprendre à manipuler des routes API en Node.js et Express.

## Fonctionnalités
✅ Ajouter un post
✅ Récupérer tous les posts
✅ Mettre à jour un post
✅ Supprimer un post

## Technologies utilisées
- Node.js
- Express.js
- MongoDB comme base de donnée

## Installation

1. **Cloner le projet**
```bash
git clone https://github.com/StyvenManaja/simple-posts-management.git
cd simple-posts-management
```
2. **Installer les dépendances**
```bash
npm install
```
3. **Lancer le serveur**
```bash
node server.js
```
L’API sera accessible sur `http://localhost:3000`.

## Routes API

### ➤ Créer un post
- **Méthode** : `POST`
- **URL** : `/posts`
- **Corps (JSON)** :
```json
{
  "title": "Mon premier post",
  "content": "Ceci est un exemple de publication."
}
```

### ➤ Récupérer tous les posts
- **Méthode** : `GET`
- **URL** : `/posts`

### ➤ Mettre à jour un post
- **Méthode** : `PUT`
- **URL** : `/posts/:id`
- **Corps (JSON)** :
```json
{
  "title": "Titre mis à jour",
  "content": "Contenu mis à jour."
}
```

### ➤ Supprimer un post
- **Méthode** : `DELETE`
- **URL** : `/posts/:id`

## Auteur
👤 **Styven Manaja**

Si vous aimez ce projet, n’hésitez pas à laisser une ⭐ sur [GitHub](https://github.com/StyvenManaja/simple-posts-management)! 😃

