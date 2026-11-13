# Gestion · Normandy Soldiers Memory

Espace de gestion du site de l'association [Normandy Soldiers Memory](https://github.com/Kmauger18/normandy-soldiers-memory), réservé aux comptes créés dans Firebase.

En ligne (une fois GitHub Pages activé) : <https://kmauger18.github.io/normandy-soldiers-memory-Gestion/>

**Mise en service : suivre [GUIDE-FIREBASE.md](GUIDE-FIREBASE.md).**

## Ce qu'on peut faire

| Écran | Rôle |
|---|---|
| **Tableau de bord** | Chiffres clés, prochains rendez-vous, dernières photos, état du bandeau, raccourcis |
| **Textes du site** | Tous les textes principaux des pages (accueil, association, activités, bandeaux de chaque page, nous rejoindre…), avec retour au texte d'origine |
| **Agenda** | Rendez-vous avec date exacte ou approximative (« Été »), lieu, description, statut (à venir, confirmé, complet, reporté, annulé). Les rendez-vous passés disparaissent seuls du site |
| **Archives du Front** | Ajout de photos (plusieurs à la fois, depuis l'ordinateur ou le téléphone), légende, catégorie, ordre, masquer ou supprimer |
| **Historique** | Étapes de la page Historique, dans l'ordre choisi |
| **Questions fréquentes** | FAQ de la page « Nous rejoindre » |
| **Coordonnées & liens** | Adresse, téléphone, e-mail, liens Facebook et HelloAsso, mis à jour sur toutes les pages |
| **Bandeau d'annonce** | Message affiché en haut de toutes les pages du site, avec lien |
| **Paramètres** | Compte, changement de mot de passe, import du contenu d'origine, sauvegarde |

## Sécurité

- Connexion par e-mail et mot de passe (Firebase Authentication), inscription désactivée.
- Règles Firestore ([`firestore.rules`](firestore.rules)) : seuls les comptes créés dans Firebase Authentication peuvent modifier le contenu, et tout compte ajouté y a accès automatiquement. Les visiteurs du site lisent seulement ce qui est marqué visible.
- La page n'est pas référencée par les moteurs de recherche.

## Mode démonstration

Si `apiKey` est vide dans `firebase-config.js`, l'espace fonctionne en mode démo : on se connecte sans mot de passe et les modifications restent dans le navigateur, sans toucher au site.

## Fichiers

| Fichier | Rôle |
|---|---|
| `index.html` | Structure de l'application |
| `firebase-config.js` | Configuration Firebase (même contenu que dans le dépôt du site) |
| `js/app.js` | Démarrage, connexion, navigation |
| `js/store.js` | Lecture et écriture des données (Firebase ou démo) |
| `js/vues.js` | Les écrans et formulaires |
| `js/donnees.js` | Contenu d'origine du site et liste des textes modifiables |
| `js/ui.js` | Outils d'interface (icônes, fenêtres, réduction des photos) |
| `css/gestion.css` | Styles |

Aucune étape de compilation : les fichiers sont servis tels quels.

## Structure de la base

| Emplacement | Contenu |
|---|---|
| `contenu/textes`, `contenu/coordonnees`, `contenu/annonce` | Textes, coordonnées, bandeau |
| `evenements` | Agenda |
| `historique` | Étapes de l'historique |
| `faq` | Questions fréquentes |
| `photos` | Photos de la galerie (version réduite + légende, catégorie, ordre) |
| `photos_hd` | Grande version de chaque photo ajoutée, ouverte dans la visionneuse |
