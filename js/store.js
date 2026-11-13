// Couche de données : Firebase (Firestore + Authentication) ou mode démo (navigateur)
import { firebaseConfig, firebaseActif, FIREBASE_SDK } from '../firebase-config.js';
import { TEXTES_ORIGINE, COORD_ORIGINE, ANNONCE_ORIGINE, EVENEMENTS_ORIGINE, HISTORIQUE_ORIGINE, FAQ_ORIGINE, PHOTOS_ORIGINE } from './donnees.js';

export const COLLECTIONS = ['contenu', 'evenements', 'historique', 'faq', 'photos'];
export const mode = firebaseActif ? 'firebase' : 'demo';

// Données en mémoire : { evenements: { id: {...} }, ... }
export const db = Object.fromEntries(COLLECTIONS.map(c => [c, {}]));
const abonnes = new Set();
let notifPrevue = false;
function notifier() {
  if (notifPrevue) return;
  notifPrevue = true;
  queueMicrotask(() => { notifPrevue = false; abonnes.forEach(f => { try { f(); } catch (e) { console.error(e); } }); });
}
export function surChangement(f) { abonnes.add(f); return () => abonnes.delete(f); }

// ---------- Erreurs ----------
export let erreurLecture = null;
let gestionnaireErreur = () => {};
export function surErreur(f) { gestionnaireErreur = f; }
export function utilisateurCourant() { return fb?.auth?.currentUser?.email || (mode === 'demo' ? 'mode démo' : ''); }
export function messageErreur(err) {
  const code = err?.code || '';
  if (code.includes('permission-denied')) return `Firebase a refusé l'accès (compte : ${utilisateurCourant() || 'aucun'}). Vérifiez que les règles du fichier firestore.rules sont bien publiées dans Firebase, puis reconnectez-vous.`;
  if (code.includes('unavailable') || code.includes('network')) return 'Firebase est injoignable (pas de réseau, ou un bloqueur de publicité). Les modifications sont gardées sur l\'appareil et partiront dès que la connexion revient.';
  if (code.includes('unauthenticated')) return 'Session expirée : déconnectez-vous puis reconnectez-vous.';
  if (code.includes('invalid-credential') || code.includes('wrong-password') || code.includes('user-not-found') || code.includes('invalid-email')) return 'E-mail ou mot de passe incorrect.';
  if (code.includes('too-many-requests')) return 'Trop d\'essais. Patientez quelques minutes ou réinitialisez le mot de passe.';
  if (code.includes('user-disabled')) return 'Ce compte a été désactivé.';
  if (code.includes('resource-exhausted') || /exceeds the maximum/i.test(err?.message || '')) return 'Fichier trop lourd pour la base. Essayez une photo plus petite.';
  if (code.includes('quota') || err?.name === 'QuotaExceededError') return 'Mémoire du navigateur pleine (mode démo) : supprimez quelques photos de démonstration.';
  return 'Erreur : ' + (err?.message || code || 'inconnue');
}

// Attend la confirmation du serveur au plus 8 s ; au-delà, l'écriture reste en file
// d'attente sur l'appareil et une erreur éventuelle est signalée plus tard.
function suivre(promesse) {
  let regle = false;
  const delai = new Promise(res => setTimeout(() => { if (!regle) { regle = true; res('attente'); } }, 8000));
  const suivie = promesse.then(v => { regle = true; return v; }, e => { if (regle) gestionnaireErreur(e); regle = true; throw e; });
  suivie.catch(() => {});
  return Promise.race([suivie, delai]);
}

export function liste(col) {
  return Object.entries(db[col]).map(([id, v]) => ({ id, ...v })).sort((a, b) => (a.ordre ?? 0) - (b.ordre ?? 0));
}
export function obtenir(col, id) { const v = db[col][id]; return v ? { id, ...v } : null; }
export function textes() { return { ...TEXTES_ORIGINE, ...(db.contenu.textes || {}) }; }
export function coordonnees() { return { ...COORD_ORIGINE, ...(db.contenu.coordonnees || {}) }; }
export function annonce() { return { ...ANNONCE_ORIGINE, ...(db.contenu.annonce || {}) }; }
export function baseVide() { return !Object.keys(db.contenu).length && !Object.keys(db.photos).length && !Object.keys(db.evenements).length; }

function idAleatoire() { return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4); }
function nettoyer(obj) { return JSON.parse(JSON.stringify(obj)); }

// =====================================================================
//  MODE DÉMO
// =====================================================================
const CLE_DEMO = 'nsm-gestion-demo-v1';
const CLE_HD = 'nsm-gestion-demo-hd-v1';
function contenuOrigine() {
  const d = Object.fromEntries(COLLECTIONS.map(c => [c, {}]));
  d.contenu = { textes: { ...TEXTES_ORIGINE }, coordonnees: { ...COORD_ORIGINE }, annonce: { ...ANNONCE_ORIGINE } };
  EVENEMENTS_ORIGINE.forEach((e, i) => d.evenements['evt' + i] = { ...e });
  HISTORIQUE_ORIGINE.forEach((e, i) => d.historique['his' + i] = { ...e });
  FAQ_ORIGINE.forEach((e, i) => d.faq['faq' + i] = { ...e });
  PHOTOS_ORIGINE.forEach((e, i) => d.photos['pho' + String(i).padStart(2, '0')] = { ...e });
  return d;
}
const demo = {
  charger() {
    let d = null;
    try { d = JSON.parse(localStorage.getItem(CLE_DEMO)); } catch (e) { d = null; }
    if (!d) d = contenuOrigine();
    COLLECTIONS.forEach(c => { db[c] = d[c] || {}; });
    this.sauver();
  },
  sauver() { localStorage.setItem(CLE_DEMO, JSON.stringify(db)); },
  hd() { try { return JSON.parse(localStorage.getItem(CLE_HD)) || {}; } catch (e) { return {}; } },
  reinitialiser() { try { localStorage.removeItem(CLE_DEMO); localStorage.removeItem(CLE_HD); } catch (e) {} this.charger(); notifier(); }
};
export function reinitialiserDemo() { demo.reinitialiser(); }

// =====================================================================
//  FIREBASE
// =====================================================================
let fb = null;
async function chargerFirebase() {
  const [appMod, authMod, fsMod] = await Promise.all([
    import(`${FIREBASE_SDK}/firebase-app.js`),
    import(`${FIREBASE_SDK}/firebase-auth.js`),
    import(`${FIREBASE_SDK}/firebase-firestore.js`)
  ]);
  const app = appMod.initializeApp(firebaseConfig);
  const auth = authMod.getAuth(app);
  let fs;
  try {
    fs = fsMod.initializeFirestore(app, { localCache: fsMod.persistentLocalCache({ tabManager: fsMod.persistentMultipleTabManager() }) });
  } catch (e) {
    fs = fsMod.getFirestore(app);
  }
  fb = { auth, fs, a: authMod, f: fsMod };
}

let desabonnements = [];
let premiersChargements = new Set();
export function chargementTermine() { return mode === 'demo' || premiersChargements.size >= COLLECTIONS.length; }
function ecouterTout() {
  desabonnements.forEach(u => u());
  premiersChargements = new Set();
  desabonnements = COLLECTIONS.map(c => fb.f.onSnapshot(fb.f.collection(fb.fs, c), snap => {
    const m = {};
    snap.forEach(d => { m[d.id] = d.data(); });
    db[c] = m;
    premiersChargements.add(c);
    if (erreurLecture) erreurLecture = null;
    notifier();
  }, err => { console.error('Lecture ' + c, err); erreurLecture = err; premiersChargements.add(c); notifier(); }));
}

// =====================================================================
//  API commune
// =====================================================================
export async function initialiser() {
  if (mode === 'demo') { demo.charger(); return; }
  await chargerFirebase();
}

export function surConnexion(cb) {
  if (mode === 'demo') {
    let connecte = false;
    try { connecte = sessionStorage.getItem('nsm-demo-session') === '1'; } catch (e) {}
    cb(connecte ? { email: 'demo@exemple.fr', demo: true } : null);
    return;
  }
  fb.a.onAuthStateChanged(fb.auth, user => {
    if (user) ecouterTout(); else { desabonnements.forEach(u => u()); desabonnements = []; }
    cb(user);
  });
}

export async function connexion(email, motDePasse) {
  if (mode === 'demo') {
    try { sessionStorage.setItem('nsm-demo-session', '1'); } catch (e) {}
    return { email: 'demo@exemple.fr', demo: true };
  }
  await fb.a.setPersistence(fb.auth, fb.a.browserLocalPersistence);
  const r = await fb.a.signInWithEmailAndPassword(fb.auth, email, motDePasse);
  return r.user;
}

export async function motDePasseOublie(email) {
  if (mode === 'demo') return;
  await fb.a.sendPasswordResetEmail(fb.auth, email);
}

export async function deconnexion() {
  if (mode === 'demo') { try { sessionStorage.removeItem('nsm-demo-session'); } catch (e) {} location.reload(); return; }
  await fb.a.signOut(fb.auth);
}

export async function enregistrer(col, id, donnees) {
  const data = nettoyer(donnees);
  if (mode === 'demo') { db[col][id] = data; demo.sauver(); notifier(); return; }
  return suivre(fb.f.setDoc(fb.f.doc(fb.fs, col, id), data));
}
export async function creer(col, donnees) {
  const id = idAleatoire();
  await enregistrer(col, id, donnees);
  return id;
}
export async function modifier(col, id, champs) {
  const data = nettoyer(champs);
  if (mode === 'demo') { db[col][id] = { ...(db[col][id] || {}), ...data }; demo.sauver(); notifier(); return; }
  return suivre(fb.f.setDoc(fb.f.doc(fb.fs, col, id), data, { merge: true }));
}
export async function supprimer(col, id) {
  if (mode === 'demo') { delete db[col][id]; demo.sauver(); notifier(); return; }
  return suivre(fb.f.deleteDoc(fb.f.doc(fb.fs, col, id)));
}

// Plusieurs écritures : [{ type: 'set'|'merge'|'delete', col, id, data }]
export async function lot(operations) {
  if (mode === 'demo') {
    operations.forEach(o => {
      if (o.type === 'delete') delete db[o.col][o.id];
      else if (o.type === 'merge') db[o.col][o.id] = { ...(db[o.col][o.id] || {}), ...nettoyer(o.data) };
      else db[o.col][o.id] = nettoyer(o.data);
    });
    demo.sauver(); notifier(); return;
  }
  for (let i = 0; i < operations.length; i += 400) {
    const b = fb.f.writeBatch(fb.fs);
    operations.slice(i, i + 400).forEach(o => {
      const ref = fb.f.doc(fb.fs, o.col, o.id);
      if (o.type === 'delete') b.delete(ref);
      else if (o.type === 'merge') b.set(ref, nettoyer(o.data), { merge: true });
      else b.set(ref, nettoyer(o.data));
    });
    const r = await suivre(b.commit());
    if (r === 'attente') return 'attente';
  }
}

// ---------- Photos : aperçu dans « photos », grande version dans « photos_hd » ----------
export async function ajouterPhoto(meta, apercu, hd) {
  const id = idAleatoire();
  if (mode === 'demo') {
    // Le navigateur a peu de place : en démo on ne garde que l'aperçu
    db.photos[id] = nettoyer({ ...meta, apercu, hd: false });
    try { demo.sauver(); } catch (e) { delete db.photos[id]; throw e; }
    notifier(); return id;
  }
  await suivre(fb.f.setDoc(fb.f.doc(fb.fs, 'photos_hd', id), { data: hd }));
  await suivre(fb.f.setDoc(fb.f.doc(fb.fs, 'photos', id), nettoyer({ ...meta, apercu, hd: true })));
  return id;
}
export async function lirePhotoHd(id) {
  const p = obtenir('photos', id);
  if (!p) return '';
  if (!p.hd || mode === 'demo') return p.apercu;
  const s = await fb.f.getDoc(fb.f.doc(fb.fs, 'photos_hd', id));
  return s.exists() ? s.data().data : p.apercu;
}
export async function supprimerPhoto(id) {
  const p = obtenir('photos', id);
  await supprimer('photos', id);
  if (p?.hd && mode === 'firebase') await suivre(fb.f.deleteDoc(fb.f.doc(fb.fs, 'photos_hd', id)));
}

// ---------- Contenu d'origine ----------
export async function importerOrigine({ ecraser = false } = {}) {
  const ops = [];
  const set = (col, id, data) => ops.push({ type: 'set', col, id, data });
  if (ecraser || !db.contenu.textes) set('contenu', 'textes', TEXTES_ORIGINE);
  if (ecraser || !db.contenu.coordonnees) set('contenu', 'coordonnees', COORD_ORIGINE);
  if (ecraser || !db.contenu.annonce) set('contenu', 'annonce', ANNONCE_ORIGINE);
  if (ecraser || !Object.keys(db.evenements).length) EVENEMENTS_ORIGINE.forEach((e, i) => set('evenements', 'origine' + i, e));
  if (ecraser || !Object.keys(db.historique).length) HISTORIQUE_ORIGINE.forEach((e, i) => set('historique', 'origine' + i, e));
  if (ecraser || !Object.keys(db.faq).length) FAQ_ORIGINE.forEach((e, i) => set('faq', 'origine' + i, e));
  const deja = new Set(Object.values(db.photos).map(p => p.apercu));
  PHOTOS_ORIGINE.forEach((p, i) => { if (!deja.has(p.apercu)) set('photos', 'origine' + String(i).padStart(2, '0'), { ...p, ajouteLe: Date.now() }); });
  if (!ops.length) return 0;
  await lot(ops);
  return ops.length;
}

// ---------- Sauvegarde ----------
export function exporter() {
  return JSON.stringify({ application: 'normandy-soldiers-memory-gestion', version: 1, date: new Date().toISOString(), donnees: db }, null, 2);
}
