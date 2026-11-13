# Mise en service de Firebase (gratuit)

Le projet Firebase **normandysoldiersmemory** existe déjà et sa configuration est déjà dans `firebase-config.js` (dans ce dépôt et dans celui du site). Il reste à régler les points ci-dessous dans la console Firebase. Compter environ 15 minutes.

Formule utilisée : **Spark (gratuite)**. Aucune carte bancaire n'est demandée et aucun service payant n'est utilisé. Les photos sont enregistrées dans Firestore, pas dans Firebase Storage (qui demande la formule payante).

Console : <https://console.firebase.google.com/project/normandysoldiersmemory>

## 1. Activer la connexion par e-mail

1. Menu **Créer → Authentication → Commencer**.
2. Onglet **Sign-in method** → **E-mail/Mot de passe** → activer seulement la première option → **Enregistrer**.

## 2. Créer les comptes du bureau

1. Onglet **Users** → **Ajouter un utilisateur** → adresse e-mail et mot de passe.
2. Recommencer pour chaque personne qui doit gérer le site.

Chaque compte ajouté ici a **automatiquement** accès à l'espace de gestion (site et application Android). Il n'y a rien d'autre à modifier.

## 3. Bloquer l'inscription libre (important)

**Authentication → Paramètres → Actions de l'utilisateur** → **décocher « Activer la création (inscription) »** → Enregistrer.

Sans cela, n'importe qui pourrait se créer un compte et modifier le site.

## 4. Autoriser l'adresse GitHub Pages

**Authentication → Paramètres → Domaines autorisés** → **Ajouter un domaine** → `kmauger18.github.io`.

## 5. Créer la base de données

1. Menu **Créer → Firestore Database → Créer une base de données**.
2. Emplacement : **eur3 (Europe)**. Mode : **production** → **Créer**.
3. Onglet **Règles** : remplacer tout le contenu par celui du fichier [`firestore.rules`](firestore.rules) → **Publier**.

## 6. Mettre en ligne les deux sites

Dans chacun des deux dépôts (`normandy-soldiers-memory` et `normandy-soldiers-memory-Gestion`) : **Settings → Pages** → *Deploy from a branch* → branche **main**, dossier **/ (root)** → **Save**.

- Site public : <https://kmauger18.github.io/normandy-soldiers-memory/>
- Espace de gestion : <https://kmauger18.github.io/normandy-soldiers-memory-Gestion/>

## 7. Premier démarrage

1. Ouvrir l'espace de gestion et se connecter avec un des comptes de l'étape 2.
2. Le tableau de bord indique « La base est vide » : cliquer sur **Importer le contenu du site**. Les textes, l'agenda, l'historique, la FAQ, les coordonnées et les 14 photos actuelles arrivent dans la base.
3. À partir de là, toute modification enregistrée apparaît sur le site public (recharger la page du site pour la voir).

Tant que l'import n'a pas été fait, le site public continue d'afficher son contenu d'origine.

## Donner ou retirer un accès

- **Ajouter** : Authentication → Users → Ajouter un utilisateur. L'accès est immédiat.
- **Retirer** : menu **⋮** du compte → Désactiver ou Supprimer.
- **Mot de passe oublié** : lien sur l'écran de connexion, ou Paramètres → « Recevoir un e-mail pour changer de mot de passe ».

## Limites de la formule gratuite

Largement suffisantes pour l'association : 50 000 lectures et 20 000 écritures par jour, 1 Go de données. Chaque photo ajoutée est réduite automatiquement (environ 150 Ko pour la galerie, 600 Ko pour la grande version), ce qui laisse de la place pour plus d'un millier de photos.
