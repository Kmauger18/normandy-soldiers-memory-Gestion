// ============================================================
//  Configuration Firebase — partagée par le site et l'espace de gestion
// ============================================================
//  1. Crée le projet Firebase (voir GUIDE-FIREBASE.md).
//  2. Colle ici les valeurs de « firebaseConfig » données par Firebase,
//     dans CE fichier ET dans firebase-config.js du dépôt du site.
//  3. Les comptes qui ont accès à l'espace de gestion se créent dans
//     Firebase → Authentication → Users : chaque compte ajouté y a accès
//     automatiquement (site de gestion et application Android).
//
//  Tant que apiKey est vide, le site garde son contenu actuel et
//  l'espace de gestion fonctionne en MODE DÉMO (modifications gardées
//  seulement dans le navigateur).
//  Ces valeurs ne sont pas secrètes : la sécurité vient des règles
//  Firestore (firestore.rules) et des mots de passe des comptes.
// ============================================================

export const firebaseConfig = {
  apiKey: "AIzaSyAOyGKflTsVI4RpJTKSnHM6txGzhwgttrI",
  authDomain: "normandysoldiersmemory.firebaseapp.com",
  projectId: "normandysoldiersmemory",
  storageBucket: "normandysoldiersmemory.firebasestorage.app",
  messagingSenderId: "203774897384",
  appId: "1:203774897384:web:4bd3c0a4c6866535ed6d5d"
};

export const firebaseActif = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

// Version du SDK Firebase chargée depuis le CDN officiel de Google
export const FIREBASE_SDK = "https://www.gstatic.com/firebasejs/10.12.2";

// Adresse du site public (sert aux liens « Voir le site » et aux photos d'origine)
export const SITE_URL = "https://kmauger18.github.io/normandy-soldiers-memory/";
