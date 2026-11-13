// Démarrage, connexion, navigation
import * as S from './store.js';
import { VUES } from './vues.js';
import { $, $$, esc, ic, toast, fermerFenetre } from './ui.js';
import { SITE_URL } from '../firebase-config.js';

const MENU = [
  ['tableau'], ['—', 'Contenu du site'], ['textes'], ['agenda'], ['archives'], ['historique'], ['faq'],
  ['—', 'Informations'], ['coordonnees'], ['annonce'], ['parametres'],
];

function afficher(id) {
  ['ecran-chargement', 'ecran-connexion', 'ecran-app'].forEach(e => { $('#' + e).hidden = e !== id; });
}

// ---------------------------------------------------------------- Connexion
function ecranConnexion(message = '') {
  afficher('ecran-connexion');
  $('#connexion-demo').hidden = S.mode !== 'demo';
  $('#connexion-erreur').textContent = message;
  $('#connexion-erreur').hidden = !message;
  const f = $('#form-connexion');
  f.onsubmit = async e => {
    e.preventDefault();
    const b = $('button[type=submit]', f);
    b.disabled = true; b.textContent = 'Connexion…';
    $('#connexion-erreur').hidden = true;
    try { await S.connexion(f.email.value.trim(), f.mdp.value); if (S.mode === 'demo') demarrer({ email: 'demo@exemple.fr' }); }
    catch (err) { $('#connexion-erreur').textContent = S.messageErreur(err); $('#connexion-erreur').hidden = false; }
    finally { b.disabled = false; b.textContent = 'Se connecter'; }
  };
  $('#mdp-oublie').onclick = async () => {
    const email = f.email.value.trim();
    if (!email) { $('#connexion-erreur').textContent = 'Saisissez d\'abord votre adresse e-mail.'; $('#connexion-erreur').hidden = false; return; }
    try { await S.motDePasseOublie(email); toast('Si ce compte existe, un e-mail de réinitialisation a été envoyé.'); }
    catch (err) { toast(S.messageErreur(err), 'erreur'); }
  };
}

// ---------------------------------------------------------------- Application
let vueCourante = null;
function construireMenu() {
  $('#menu').innerHTML = MENU.map(([id, titre]) => id === '—'
    ? `<li class="menu-titre">${esc(titre)}</li>`
    : `<li><a href="#${id}" data-vue="${id}">${ic(VUES[id].icone)}<span>${esc(VUES[id].titre)}</span></a></li>`).join('');
  $('#lien-site').href = SITE_URL;
}

function rendreVue(force = false) {
  const id = (location.hash || '#tableau').slice(1);
  const vue = VUES[id] ? id : 'tableau';
  const el = $('#contenu');
  const nouvelle = vue !== vueCourante;
  // Écrans de saisie : ne pas effacer ce que la personne est en train d'écrire
  if (!nouvelle && !force && VUES[vue].formulaire && el.dataset.modifie === '1') return;
  vueCourante = vue;
  $('#titre-vue').textContent = VUES[vue].titre;
  document.title = VUES[vue].titre + ' · Gestion Normandy Soldiers Memory';
  $$('#menu a').forEach(a => a.classList.toggle('actif', a.dataset.vue === vue));
  const y = nouvelle ? 0 : window.scrollY;
  el.dataset.modifie = '0';
  el.onkeydown = null;
  try { VUES[vue].rendre(el); } catch (e) { console.error(e); el.innerHTML = `<div class="carte carte-alerte"><p>Erreur d'affichage : ${esc(e.message)}</p></div>`; }
  window.scrollTo(0, y);
  document.body.classList.remove('menu-ouvert');
  majBandeau();
  majPastilleTextes();
}

// Pastille sur « Textes du site » tant qu'il reste des modifications non enregistrées
function majPastilleTextes() {
  $('#menu a[data-vue="textes"]')?.classList.toggle('a-enregistrer', VUES.textes.aDesModifications());
}

function majBandeau() {
  const b = $('#bandeau-etat');
  if (S.mode === 'demo') {
    b.innerHTML = `${ic('alerte')}<span><b>Mode démonstration.</b> Les modifications restent dans ce navigateur et n'apparaissent pas sur le site. Pour relier le site, suivez le guide Firebase.</span>`;
    b.hidden = false; b.className = 'bandeau-etat demo';
  } else if (S.erreurLecture) {
    b.innerHTML = `${ic('alerte')}<span>${esc(S.messageErreur(S.erreurLecture))}</span>`;
    b.hidden = false; b.className = 'bandeau-etat erreur';
  } else b.hidden = true;
}

let demarre = false;
function demarrer(user) {
  $('#utilisateur').textContent = user.email || '';
  afficher('ecran-app');
  if (demarre) { rendreVue(true); return; }
  demarre = true;
  construireMenu();
  window.addEventListener('hashchange', () => { fermerFenetre(); rendreVue(); });
  S.surChangement(() => rendreVue());
  S.surErreur(err => toast(S.messageErreur(err), 'erreur'));
  $('#contenu').addEventListener('input', () => { $('#contenu').dataset.modifie = '1'; majPastilleTextes(); });
  window.addEventListener('beforeunload', e => { if (VUES.textes.aDesModifications()) { e.preventDefault(); e.returnValue = ''; } });
  $('#contenu').addEventListener('submit', () => { setTimeout(() => { $('#contenu').dataset.modifie = '0'; }, 0); }, true);
  $('#bouton-menu').onclick = () => document.body.classList.toggle('menu-ouvert');
  $('#voile-menu').onclick = () => document.body.classList.remove('menu-ouvert');
  $('#deconnexion').onclick = () => S.deconnexion();
  $('#fenetre').addEventListener('click', e => { if (e.target.id === 'fenetre') fermerFenetre(); });
  $('#fenetre-fermer').onclick = fermerFenetre;
  document.addEventListener('keydown', e => { if (e.key === 'Escape') fermerFenetre(); });
  rendreVue(true);
}

// ---------------------------------------------------------------- Lancement
(async () => {
  try {
    await S.initialiser();
  } catch (e) {
    console.error(e);
    afficher('ecran-connexion');
    $('#connexion-erreur').textContent = 'Impossible de charger Firebase. Vérifiez la connexion internet, puis rechargez la page.';
    $('#connexion-erreur').hidden = false;
    return;
  }
  S.surConnexion((user, message) => {
    if (user) demarrer(user);
    else { demarre && location.reload(); ecranConnexion(message); }
  });
})();
