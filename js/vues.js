// Écrans de l'espace de gestion
import * as S from './store.js';
import { $, $$, esc, ic, toast, ouvrirFenetre, fermerFenetre, confirmer, champ, lireFormulaire, preparerPhoto, telecharger, isoJour, dateLisible } from './ui.js';
import { GROUPES_TEXTES, TEXTES_ORIGINE, CHAMPS_COORD, STATUTS_EVT, CATEGORIES } from './donnees.js';
import { SITE_URL } from '../firebase-config.js';

const erreur = e => { console.error(e); toast(S.messageErreur(e), 'erreur'); };
const okEnregistre = r => toast(r === 'attente' ? 'Enregistré sur l\'appareil, envoi dès que la connexion revient.' : 'Enregistré');
const lienSite = (page = '') => SITE_URL + page;
const vide = (titre, texte, bouton = '') => `<div class="vide">${ic('alerte')}<h3>${esc(titre)}</h3><p>${esc(texte)}</p>${bouton}</div>`;

// Remet les ordres à 1..n puis échange deux éléments voisins
async function deplacer(col, id, sens) {
  const l = S.liste(col);
  const i = l.findIndex(x => x.id === id), j = i + sens;
  if (i < 0 || j < 0 || j >= l.length) return;
  [l[i], l[j]] = [l[j], l[i]];
  await S.lot(l.map((x, k) => ({ type: 'merge', col, id: x.id, data: { ordre: k + 1 } }))).catch(erreur);
}
const prochainOrdre = col => S.liste(col).reduce((m, x) => Math.max(m, x.ordre || 0), 0) + 1;
const boutonsOrdre = (id, i, n) => `<button class="btn-icone" data-haut="${id}" ${i === 0 ? 'disabled' : ''} title="Monter" aria-label="Monter">${ic('haut')}</button><button class="btn-icone" data-bas="${id}" ${i === n - 1 ? 'disabled' : ''} title="Descendre" aria-label="Descendre">${ic('bas')}</button>`;
function brancherOrdre(racine, col) {
  $$('[data-haut]', racine).forEach(b => b.onclick = () => deplacer(col, b.dataset.haut, -1));
  $$('[data-bas]', racine).forEach(b => b.onclick = () => deplacer(col, b.dataset.bas, 1));
}
const pastilleVisible = v => v === false ? '<span class="pastille grise">Masqué</span>' : '<span class="pastille verte">En ligne</span>';

// ---------- Agenda : tri et date affichée ----------
export function evenementsTries() {
  const auj = isoJour();
  const l = S.liste('evenements');
  const passe = e => e.date && (e.dateFin || e.date) < auj;
  const avenir = l.filter(e => !passe(e)).sort((a, b) => (a.date || '9999') .localeCompare(b.date || '9999') || (a.ordre || 0) - (b.ordre || 0));
  const passes = l.filter(passe).sort((a, b) => b.date.localeCompare(a.date));
  return { avenir, passes };
}
function blocDate(e) {
  if (e.date) {
    const d = new Date(e.date + 'T12:00:00');
    return `<b>${String(d.getDate()).padStart(2, '0')}</b><span>${d.toLocaleDateString('fr-FR', { month: 'short' }).replace('.', '')}</span><small>${d.getFullYear()}</small>`;
  }
  const m = (e.libelleDate || '—').match(/^(\d{1,2})\s+(.*)$/);
  return m ? `<b>${m[1]}</b><span>${esc(m[2])}</span>` : `<b>—</b><span>${esc(e.libelleDate || 'À définir')}</span>`;
}

// =====================================================================
export const VUES = {

  // -------------------------------------------------------------- Tableau de bord
  tableau: {
    titre: 'Tableau de bord', icone: 'tableau',
    rendre(el) {
      const { avenir } = evenementsTries();
      const photos = S.liste('photos');
      const an = S.annonce();
      const vis = l => l.filter(x => x.visible !== false).length;
      el.innerHTML = `
        ${S.mode === 'firebase' && S.chargementTermine() && S.baseVide() ? `
        <div class="carte carte-alerte">
          <div><h3>La base est vide</h3><p>Le site affiche encore son contenu d'origine. Importez-le dans la base pour pouvoir le modifier d'ici.</p></div>
          <button class="btn btn-primaire" id="importer">${ic('telecharger')} Importer le contenu du site</button>
        </div>` : ''}
        <div class="tuiles">
          <a class="tuile" href="#agenda"><span>${ic('agenda')}</span><b>${vis(avenir)}</b><small>Rendez-vous à venir</small></a>
          <a class="tuile" href="#archives"><span>${ic('photos')}</span><b>${vis(photos)}</b><small>Photos en ligne</small></a>
          <a class="tuile" href="#historique"><span>${ic('historique')}</span><b>${vis(S.liste('historique'))}</b><small>Étapes de l'historique</small></a>
          <a class="tuile" href="#faq"><span>${ic('faq')}</span><b>${vis(S.liste('faq'))}</b><small>Questions fréquentes</small></a>
        </div>
        <div class="grille-2">
          <section class="carte">
            <div class="carte-tete"><h3>Prochains rendez-vous</h3><a href="#agenda" class="lien">Gérer l'agenda →</a></div>
            ${avenir.length ? `<ul class="liste-evt">${avenir.slice(0, 4).map(e => `<li><div class="date-bloc">${blocDate(e)}</div><div><b>${esc(e.titre)}</b><small>${esc(e.lieu || '')}</small></div>${e.visible === false ? '<span class="pastille grise">Masqué</span>' : ''}</li>`).join('')}</ul>` : '<p class="muet">Aucun rendez-vous à venir.</p>'}
            <button class="btn btn-sombre" id="nouvel-evt">${ic('plus')} Ajouter un rendez-vous</button>
          </section>
          <section class="carte">
            <div class="carte-tete"><h3>Dernières photos</h3><a href="#archives" class="lien">Archives du Front →</a></div>
            ${photos.length ? `<div class="mini-galerie">${[...photos].sort((a, b) => (b.ajouteLe || 0) - (a.ajouteLe || 0) || (b.ordre || 0) - (a.ordre || 0)).slice(0, 6).map(p => `<img src="${esc(p.apercu)}" alt="${esc(p.legende)}" loading="lazy">`).join('')}</div>` : '<p class="muet">Aucune photo.</p>'}
            <a href="#archives" class="btn btn-sombre">${ic('televerser')} Ajouter des photos</a>
          </section>
        </div>
        <div class="grille-2">
          <section class="carte">
            <div class="carte-tete"><h3>Bandeau d'annonce</h3><a href="#annonce" class="lien">Modifier →</a></div>
            ${an.actif && an.texte ? `<p><span class="pastille verte">Affiché</span></p><p class="annonce-apercu">${esc(an.texte)}</p>` : '<p><span class="pastille grise">Désactivé</span></p><p class="muet">Utile pour annoncer un événement ou une information urgente en haut de toutes les pages.</p>'}
          </section>
          <section class="carte">
            <div class="carte-tete"><h3>Raccourcis</h3></div>
            <div class="raccourcis">
              <a href="#textes">${ic('textes')} Modifier les textes</a>
              <a href="#coordonnees">${ic('contact')} Coordonnées</a>
              <a href="${lienSite()}" target="_blank" rel="noopener">${ic('externe')} Voir le site</a>
              <a href="${lienSite('archives.html')}" target="_blank" rel="noopener">${ic('photos')} Voir la galerie en ligne</a>
            </div>
          </section>
        </div>`;
      $('#importer', el)?.addEventListener('click', async e => {
        e.currentTarget.disabled = true;
        try { const n = await S.importerOrigine(); toast(n ? 'Contenu du site importé' : 'Rien à importer'); } catch (err) { erreur(err); }
      });
      $('#nouvel-evt', el).onclick = () => formEvenement();
    }
  },

  // -------------------------------------------------------------- Textes
  textes: {
    titre: 'Textes du site', icone: 'textes', formulaire: true,
    rendre(el) {
      const t = S.textes();
      el.innerHTML = `<p class="intro">Les modifications apparaissent sur le site dès l'enregistrement (rechargez la page du site pour les voir).</p>` +
        GROUPES_TEXTES.map((g, gi) => `
        <form class="carte" data-groupe="${gi}">
          <div class="carte-tete"><h3>${esc(g.titre)}</h3>${g.page !== null ? `<a class="lien" href="${lienSite(g.page)}" target="_blank" rel="noopener">Voir la page ${ic('externe')}</a>` : ''}</div>
          ${g.champs.map(c => `<div class="champ-texte">${champ({ ...c, type: c.multi ? 'texte' : c.type, valeur: t[c.cle] })}${t[c.cle] !== TEXTES_ORIGINE[c.cle] ? `<button type="button" class="lien petit" data-origine="${c.cle}">Remettre le texte d'origine</button>` : ''}</div>`).join('')}
          <div class="actions"><button class="btn btn-primaire" type="submit">${ic('ok')} Enregistrer « ${esc(g.titre)} »</button></div>
        </form>`).join('');
      $$('textarea', el).forEach(a => { a.rows = Math.max(2, Math.min(8, Math.ceil(a.value.length / 90))); });
      $$('form', el).forEach(f => f.onsubmit = async e => {
        e.preventDefault();
        const vals = lireFormulaire(f);
        try { okEnregistre(await S.modifier('contenu', 'textes', vals)); } catch (err) { erreur(err); }
      });
      $$('[data-origine]', el).forEach(b => b.onclick = () => {
        const z = $(`[name="${b.dataset.origine}"]`, el); z.value = TEXTES_ORIGINE[b.dataset.origine];
        toast('Texte d\'origine remis : pensez à enregistrer');
      });
    }
  },

  // -------------------------------------------------------------- Agenda
  agenda: {
    titre: 'Agenda', icone: 'agenda',
    rendre(el) {
      const { avenir, passes } = evenementsTries();
      const ligne = e => `
        <li class="ligne ${e.visible === false ? 'masque' : ''}">
          <div class="date-bloc">${blocDate(e)}</div>
          <div class="ligne-corps"><b>${esc(e.titre)}</b><small>${e.date ? esc(dateLisible(e.date)) + (e.dateFin && e.dateFin !== e.date ? ' → ' + esc(dateLisible(e.dateFin)) : '') + ' · ' : ''}${esc(e.lieu || '')}</small></div>
          <span class="pastille statut-${e.statut || 'avenir'}">${esc(STATUTS_EVT[e.statut]?.label || 'À venir')}</span>
          ${pastilleVisible(e.visible)}
          <div class="ligne-actions"><button class="btn-icone" data-modif="${e.id}" title="Modifier" aria-label="Modifier">${ic('modifier')}</button><button class="btn-icone danger" data-suppr="${e.id}" title="Supprimer" aria-label="Supprimer">${ic('supprimer')}</button></div>
        </li>`;
      el.innerHTML = `
        <div class="barre"><p class="intro">Les rendez-vous passés disparaissent automatiquement du site le lendemain de leur date.</p><button class="btn btn-primaire" id="ajout">${ic('plus')} Nouveau rendez-vous</button></div>
        <section class="carte"><div class="carte-tete"><h3>À venir</h3><a class="lien" href="${lienSite('agenda.html')}" target="_blank" rel="noopener">Voir la page ${ic('externe')}</a></div>
          ${avenir.length ? `<ul class="lignes">${avenir.map(ligne).join('')}</ul>` : vide('Aucun rendez-vous à venir', 'Ajoutez la prochaine sortie de l\'association.')}</section>
        ${passes.length ? `<section class="carte"><div class="carte-tete"><h3>Passés <span class="muet">(${passes.length})</span></h3></div><ul class="lignes passes">${passes.map(ligne).join('')}</ul></section>` : ''}`;
      $('#ajout', el).onclick = () => formEvenement();
      $$('[data-modif]', el).forEach(b => b.onclick = () => formEvenement(S.obtenir('evenements', b.dataset.modif)));
      $$('[data-suppr]', el).forEach(b => b.onclick = async () => {
        const e = S.obtenir('evenements', b.dataset.suppr);
        if (await confirmer(`Supprimer « ${e.titre} » de l'agenda ?`)) S.supprimer('evenements', e.id).then(() => toast('Rendez-vous supprimé')).catch(erreur);
      });
    }
  },

  // -------------------------------------------------------------- Archives du Front
  archives: {
    titre: 'Archives du Front', icone: 'photos',
    filtre: 'tout',
    rendre(el) {
      const toutes = S.liste('photos');
      const l = this.filtre === 'tout' ? toutes : toutes.filter(p => p.categorie === this.filtre);
      el.innerHTML = `
        <div class="barre">
          <div class="filtres">${[['tout', 'Toutes'], ...Object.entries(CATEGORIES)].map(([k, v]) => `<button class="${k === this.filtre ? 'on' : ''}" data-f="${k}">${esc(v)} <span>${k === 'tout' ? toutes.length : toutes.filter(p => p.categorie === k).length}</span></button>`).join('')}</div>
          <label class="btn btn-primaire">${ic('televerser')} Ajouter des photos<input type="file" id="fichiers" accept="image/*" multiple hidden></label>
        </div>
        <p class="intro">Les photos sont réduites automatiquement avant l'envoi. L'ordre ici est celui de la galerie du site.</p>
        ${l.length ? `<div class="galerie">${l.map((p, i) => `
          <figure class="photo ${p.visible === false ? 'masque' : ''}">
            <div class="photo-img"><img src="${esc(p.apercu)}" alt="${esc(p.legende)}" loading="lazy">${p.visible === false ? '<span class="pastille grise">Masquée</span>' : ''}</div>
            <figcaption><b>${esc(p.legende || 'Sans légende')}</b><small>${esc(CATEGORIES[p.categorie] || '')}</small></figcaption>
            <div class="photo-actions">
              ${this.filtre === 'tout' ? boutonsOrdre(p.id, i, l.length) : ''}
              <button class="btn-icone" data-vis="${p.id}" title="${p.visible === false ? 'Afficher sur le site' : 'Masquer du site'}">${ic(p.visible === false ? 'oeil' : 'oeilBarre')}</button>
              <button class="btn-icone" data-modif="${p.id}" title="Modifier">${ic('modifier')}</button>
              <button class="btn-icone danger" data-suppr="${p.id}" title="Supprimer">${ic('supprimer')}</button>
            </div>
          </figure>`).join('')}</div>` : vide('Aucune photo', 'Ajoutez les photos de vos sorties : elles apparaîtront dans la page Archives du Front.')}`;
      $$('[data-f]', el).forEach(b => b.onclick = () => { this.filtre = b.dataset.f; this.rendre(el); });
      $('#fichiers', el).onchange = e => { const f = [...e.target.files]; e.target.value = ''; if (f.length) formTeleversement(f); };
      brancherOrdre(el, 'photos');
      $$('[data-vis]', el).forEach(b => b.onclick = () => { const p = S.obtenir('photos', b.dataset.vis); S.modifier('photos', p.id, { visible: p.visible === false }).catch(erreur); });
      $$('[data-modif]', el).forEach(b => b.onclick = () => formPhoto(S.obtenir('photos', b.dataset.modif)));
      $$('[data-suppr]', el).forEach(b => b.onclick = async () => {
        const p = S.obtenir('photos', b.dataset.suppr);
        if (await confirmer(`Supprimer la photo « ${p.legende || 'sans légende'} » ?`)) S.supprimerPhoto(p.id).then(() => toast('Photo supprimée')).catch(erreur);
      });
    }
  },

  // -------------------------------------------------------------- Historique
  historique: {
    titre: 'Historique', icone: 'historique',
    rendre(el) {
      const l = S.liste('historique');
      el.innerHTML = `
        <div class="barre"><p class="intro">Les étapes s'affichent dans cet ordre sur la page Historique.</p><button class="btn btn-primaire" id="ajout">${ic('plus')} Nouvelle étape</button></div>
        <section class="carte">${l.length ? `<ul class="lignes">${l.map((h, i) => `
          <li class="ligne ${h.visible === false ? 'masque' : ''}">
            <div class="date-bloc annee"><b>${esc(h.annee)}</b><span>${esc(h.sousTitre || '')}</span></div>
            <div class="ligne-corps"><b>${esc(h.titre)}</b><small>${esc(h.lieu || '')}</small></div>
            ${pastilleVisible(h.visible)}
            <div class="ligne-actions">${boutonsOrdre(h.id, i, l.length)}<button class="btn-icone" data-modif="${h.id}" title="Modifier">${ic('modifier')}</button><button class="btn-icone danger" data-suppr="${h.id}" title="Supprimer">${ic('supprimer')}</button></div>
          </li>`).join('')}</ul>` : vide('Aucune étape', 'Ajoutez les grandes dates de l\'association.')}</section>`;
      $('#ajout', el).onclick = () => formHistorique();
      brancherOrdre(el, 'historique');
      $$('[data-modif]', el).forEach(b => b.onclick = () => formHistorique(S.obtenir('historique', b.dataset.modif)));
      $$('[data-suppr]', el).forEach(b => b.onclick = async () => {
        const h = S.obtenir('historique', b.dataset.suppr);
        if (await confirmer(`Supprimer l'étape « ${h.titre} » ?`)) S.supprimer('historique', h.id).then(() => toast('Étape supprimée')).catch(erreur);
      });
    }
  },

  // -------------------------------------------------------------- FAQ
  faq: {
    titre: 'Questions fréquentes', icone: 'faq',
    rendre(el) {
      const l = S.liste('faq');
      el.innerHTML = `
        <div class="barre"><p class="intro">Affichées sur la page « Nous rejoindre ».</p><button class="btn btn-primaire" id="ajout">${ic('plus')} Nouvelle question</button></div>
        <section class="carte">${l.length ? `<ul class="lignes">${l.map((q, i) => `
          <li class="ligne ${q.visible === false ? 'masque' : ''}">
            <div class="ligne-corps"><b>${esc(q.question)}</b><small>${esc(q.reponse)}</small></div>
            ${pastilleVisible(q.visible)}
            <div class="ligne-actions">${boutonsOrdre(q.id, i, l.length)}<button class="btn-icone" data-modif="${q.id}" title="Modifier">${ic('modifier')}</button><button class="btn-icone danger" data-suppr="${q.id}" title="Supprimer">${ic('supprimer')}</button></div>
          </li>`).join('')}</ul>` : vide('Aucune question', 'Ajoutez les questions que posent les futurs membres.')}</section>`;
      $('#ajout', el).onclick = () => formFaq();
      brancherOrdre(el, 'faq');
      $$('[data-modif]', el).forEach(b => b.onclick = () => formFaq(S.obtenir('faq', b.dataset.modif)));
      $$('[data-suppr]', el).forEach(b => b.onclick = async () => {
        const q = S.obtenir('faq', b.dataset.suppr);
        if (await confirmer(`Supprimer la question « ${q.question} » ?`)) S.supprimer('faq', q.id).then(() => toast('Question supprimée')).catch(erreur);
      });
    }
  },

  // -------------------------------------------------------------- Coordonnées
  coordonnees: {
    titre: 'Coordonnées & liens', icone: 'contact', formulaire: true,
    rendre(el) {
      const c = S.coordonnees();
      el.innerHTML = `
        <form class="carte" id="f">
          <div class="carte-tete"><h3>Affichées sur la page Contact et en bas de chaque page</h3></div>
          <div class="grille-champs">${CHAMPS_COORD.map(ch => champ({ ...ch, valeur: c[ch.cle] })).join('')}</div>
          <div class="actions"><button class="btn btn-primaire" type="submit">${ic('ok')} Enregistrer</button></div>
        </form>`;
      $('#f', el).onsubmit = async e => {
        e.preventDefault();
        const v = lireFormulaire(e.target);
        if (v.telephone && v.telephone.replace(/\D/g, '').length < 9) return toast('Numéro de téléphone incomplet', 'erreur');
        try { okEnregistre(await S.enregistrer('contenu', 'coordonnees', v)); } catch (err) { erreur(err); }
      };
    }
  },

  // -------------------------------------------------------------- Annonce
  annonce: {
    titre: "Bandeau d'annonce", icone: 'annonce', formulaire: true,
    rendre(el) {
      const a = S.annonce();
      el.innerHTML = `
        <form class="carte" id="f">
          <div class="carte-tete"><h3>Message affiché en haut de toutes les pages du site</h3></div>
          ${champ({ cle: 'actif', label: 'Afficher le bandeau sur le site', type: 'case', valeur: a.actif })}
          ${champ({ cle: 'texte', label: 'Message', type: 'ligne', valeur: a.texte, placeholder: 'Ex. : Retrouvez-nous ce week-end au camp d\'Hermanville-sur-Mer !' })}
          <div class="grille-champs">
            ${champ({ cle: 'lien', label: 'Lien (facultatif)', type: 'ligne', valeur: a.lien, placeholder: 'agenda.html ou https://…', aide: 'Une page du site (agenda.html, contact.html…) ou une adresse complète.' })}
            ${champ({ cle: 'libelleLien', label: 'Texte du lien', type: 'ligne', valeur: a.libelleLien })}
          </div>
          <p class="aide">Aperçu :</p>
          <div class="annonce-bandeau" id="apercu"></div>
          <div class="actions"><button class="btn btn-primaire" type="submit">${ic('ok')} Enregistrer</button></div>
        </form>`;
      const f = $('#f', el), maj = () => {
        const v = lireFormulaire(f);
        $('#apercu', el).innerHTML = v.texte ? `<span>${esc(v.texte)}</span>${v.lien ? ` <u>${esc(v.libelleLien || 'En savoir plus')} →</u>` : ''}` : '<span class="muet">Écrivez un message…</span>';
        $('#apercu', el).style.opacity = v.actif ? 1 : .45;
      };
      f.oninput = maj; maj();
      f.onsubmit = async e => {
        e.preventDefault();
        const v = lireFormulaire(f);
        if (v.actif && !v.texte) return toast('Écrivez un message avant d\'activer le bandeau', 'erreur');
        try { okEnregistre(await S.enregistrer('contenu', 'annonce', v)); } catch (err) { erreur(err); }
      };
    }
  },

  // -------------------------------------------------------------- Paramètres
  parametres: {
    titre: 'Paramètres', icone: 'parametres',
    rendre(el) {
      const email = S.utilisateurCourant();
      el.innerHTML = `
        <div class="grille-2">
          <section class="carte">
            <div class="carte-tete"><h3>Mon compte</h3></div>
            <p class="compte">${ic('utilisateur')} <b>${esc(email)}</b></p>
            ${S.mode === 'firebase' ? `<button class="btn btn-clair" id="mdp">${ic('cle')} Recevoir un e-mail pour changer de mot de passe</button>` : ''}
            <button class="btn btn-clair" id="deco">${ic('sortie')} Se déconnecter</button>
          </section>
          <section class="carte">
            <div class="carte-tete"><h3>Comptes ayant accès</h3></div>
            <p>Les comptes se gèrent dans <b>Firebase → Authentication → Users</b>. Chaque compte ajouté a accès automatiquement à l'espace de gestion (site et application), sans rien modifier d'autre.</p>
            <p class="muet">Pour retirer un accès : menu ⋮ du compte → Désactiver ou Supprimer.</p>
            <a class="lien" href="https://console.firebase.google.com/" target="_blank" rel="noopener">Ouvrir la console Firebase ${ic('externe')}</a>
          </section>
        </div>
        <div class="grille-2">
          <section class="carte">
            <div class="carte-tete"><h3>Contenu d'origine du site</h3></div>
            <p>Ajoute dans la base les textes, l'agenda, l'historique, la FAQ et les photos du site tels qu'ils ont été créés. Ce qui existe déjà est conservé.</p>
            <button class="btn btn-sombre" id="importer">${ic('telecharger')} Importer ce qui manque</button>
            <button class="btn btn-clair danger" id="ecraser">Tout remettre comme à l'origine</button>
          </section>
          <section class="carte">
            <div class="carte-tete"><h3>Sauvegarde</h3></div>
            <p>Télécharge tout le contenu (sauf les grandes versions des photos) dans un fichier, à garder en lieu sûr.</p>
            <button class="btn btn-sombre" id="export">${ic('telecharger')} Télécharger une sauvegarde</button>
            ${S.mode === 'demo' ? `<button class="btn btn-clair danger" id="reset">Réinitialiser les données de démonstration</button>` : ''}
          </section>
        </div>
        <section class="carte">
          <div class="carte-tete"><h3>État</h3></div>
          <ul class="etat">
            <li><span>Mode</span><b>${S.mode === 'firebase' ? 'Connecté à Firebase' : 'Démonstration (rien n\'est envoyé sur le site)'}</b></li>
            <li><span>Site public</span><a class="lien" href="${SITE_URL}" target="_blank" rel="noopener">${esc(SITE_URL)}</a></li>
          </ul>
        </section>`;
      $('#deco', el).onclick = () => S.deconnexion();
      $('#mdp', el)?.addEventListener('click', async () => {
        try { await S.motDePasseOublie(email); toast('E-mail envoyé à ' + email); } catch (err) { erreur(err); }
      });
      $('#importer', el).onclick = async () => { try { const n = await S.importerOrigine(); toast(n ? 'Contenu importé' : 'Tout est déjà dans la base'); } catch (err) { erreur(err); } };
      $('#ecraser', el).onclick = async () => {
        if (!await confirmer('Remettre les textes, coordonnées, agenda, historique et FAQ d\'origine ? Vos modifications sur ces éléments seront remplacées. Les photos ajoutées sont conservées.', { libelle: 'Tout remettre' })) return;
        try { await S.importerOrigine({ ecraser: true }); toast('Contenu d\'origine remis'); } catch (err) { erreur(err); }
      };
      $('#export', el).onclick = () => telecharger(S.exporter(), `sauvegarde-nsm-${isoJour()}.json`);
      $('#reset', el)?.addEventListener('click', async () => { if (await confirmer('Effacer les modifications de démonstration ?', { libelle: 'Réinitialiser' })) { S.reinitialiserDemo(); toast('Démo réinitialisée'); } });
    }
  },
};

// =====================================================================
//  Formulaires
// =====================================================================
function formEvenement(e = null) {
  const v = e || { titre: '', date: '', dateFin: '', libelleDate: '', lieu: '', description: '', statut: 'avenir', visible: true };
  ouvrirFenetre({
    titre: e ? 'Modifier le rendez-vous' : 'Nouveau rendez-vous',
    contenu: `<form id="fe">
      ${champ({ cle: 'titre', label: 'Titre', valeur: v.titre, requis: true, placeholder: 'Ex. : Camp de reconstitution « Dans les pas des Alliés »' })}
      <div class="grille-champs">
        ${champ({ cle: 'date', label: 'Date', type: 'date', valeur: v.date })}
        ${champ({ cle: 'dateFin', label: 'Jusqu\'au (facultatif)', type: 'date', valeur: v.dateFin })}
      </div>
      ${champ({ cle: 'libelleDate', label: 'Date approximative', valeur: v.libelleDate, placeholder: 'Ex. : Été, Mai, 06 Juin', aide: 'Seulement si la date exacte n\'est pas encore connue (utilisé quand le champ Date est vide).' })}
      ${champ({ cle: 'lieu', label: 'Lieu', valeur: v.lieu, placeholder: 'Ex. : Parc municipal, Hermanville-sur-Mer' })}
      ${champ({ cle: 'description', label: 'Description (facultatif)', type: 'texte', valeur: v.description })}
      <div class="grille-champs">
        ${champ({ cle: 'statut', label: 'Statut', type: 'select', valeur: v.statut, options: Object.fromEntries(Object.entries(STATUTS_EVT).map(([k, s]) => [k, s.label])) })}
        <div class="champ champ-case">${champ({ cle: 'visible', label: 'Afficher sur le site', type: 'case', valeur: v.visible !== false })}</div>
      </div>
    </form>`,
    pied: `<button type="button" class="btn btn-clair" data-annuler>Annuler</button><button type="submit" form="fe" class="btn btn-primaire">${ic('ok')} Enregistrer</button>`,
    onOuvert(corps, pied) {
      $('[data-annuler]', pied).onclick = fermerFenetre;
      $('#fe', corps).onsubmit = async ev => {
        ev.preventDefault();
        const d = lireFormulaire(ev.target);
        if (!d.titre) return toast('Le titre est obligatoire', 'erreur');
        if (d.dateFin && d.date && d.dateFin < d.date) return toast('La date de fin est avant la date de début', 'erreur');
        if (!d.date) d.dateFin = '';
        try {
          if (e) await S.modifier('evenements', e.id, d);
          else await S.creer('evenements', { ...d, ordre: prochainOrdre('evenements') });
          fermerFenetre(); toast(e ? 'Rendez-vous modifié' : 'Rendez-vous ajouté');
        } catch (err) { erreur(err); }
      };
    }
  });
}

function formHistorique(h = null) {
  const v = h || { annee: '', sousTitre: '', titre: '', texte: '', lieu: '', visible: true };
  ouvrirFenetre({
    titre: h ? 'Modifier l\'étape' : 'Nouvelle étape',
    contenu: `<form id="fh">
      <div class="grille-champs">
        ${champ({ cle: 'annee', label: 'Année (ou « Demain »)', valeur: v.annee, requis: true })}
        ${champ({ cle: 'sousTitre', label: 'Précision de date', valeur: v.sousTitre, placeholder: 'Ex. : 14 – 15 mai' })}
      </div>
      ${champ({ cle: 'titre', label: 'Titre', valeur: v.titre, requis: true })}
      ${champ({ cle: 'texte', label: 'Texte', type: 'texte', valeur: v.texte })}
      ${champ({ cle: 'lieu', label: 'Lieu', valeur: v.lieu })}
      ${champ({ cle: 'visible', label: 'Afficher sur le site', type: 'case', valeur: v.visible !== false })}
    </form>`,
    pied: `<button type="button" class="btn btn-clair" data-annuler>Annuler</button><button type="submit" form="fh" class="btn btn-primaire">${ic('ok')} Enregistrer</button>`,
    onOuvert(corps, pied) {
      $('[data-annuler]', pied).onclick = fermerFenetre;
      $('#fh', corps).onsubmit = async ev => {
        ev.preventDefault();
        const d = lireFormulaire(ev.target);
        if (!d.annee || !d.titre) return toast('Année et titre sont obligatoires', 'erreur');
        try {
          if (h) await S.modifier('historique', h.id, d);
          else await S.creer('historique', { ...d, ordre: prochainOrdre('historique') });
          fermerFenetre(); toast('Étape enregistrée');
        } catch (err) { erreur(err); }
      };
    }
  });
}

function formFaq(q = null) {
  const v = q || { question: '', reponse: '', visible: true };
  ouvrirFenetre({
    titre: q ? 'Modifier la question' : 'Nouvelle question',
    contenu: `<form id="fq">
      ${champ({ cle: 'question', label: 'Question', valeur: v.question, requis: true })}
      ${champ({ cle: 'reponse', label: 'Réponse', type: 'texte', valeur: v.reponse, requis: true })}
      ${champ({ cle: 'visible', label: 'Afficher sur le site', type: 'case', valeur: v.visible !== false })}
    </form>`,
    pied: `<button type="button" class="btn btn-clair" data-annuler>Annuler</button><button type="submit" form="fq" class="btn btn-primaire">${ic('ok')} Enregistrer</button>`,
    onOuvert(corps, pied) {
      $('[data-annuler]', pied).onclick = fermerFenetre;
      $('#fq', corps).onsubmit = async ev => {
        ev.preventDefault();
        const d = lireFormulaire(ev.target);
        if (!d.question || !d.reponse) return toast('Question et réponse sont obligatoires', 'erreur');
        try {
          if (q) await S.modifier('faq', q.id, d);
          else await S.creer('faq', { ...d, ordre: prochainOrdre('faq') });
          fermerFenetre(); toast('Question enregistrée');
        } catch (err) { erreur(err); }
      };
    }
  });
}

const optionsCategories = CATEGORIES;
function formPhoto(p) {
  ouvrirFenetre({
    titre: 'Modifier la photo',
    contenu: `<form id="fp"><img class="photo-grande" src="${esc(p.apercu)}" alt="">
      ${champ({ cle: 'legende', label: 'Légende', valeur: p.legende })}
      <div class="grille-champs">
        ${champ({ cle: 'categorie', label: 'Catégorie', type: 'select', valeur: p.categorie, options: optionsCategories })}
        <div class="champ champ-case">${champ({ cle: 'visible', label: 'Afficher sur le site', type: 'case', valeur: p.visible !== false })}</div>
      </div></form>`,
    pied: `<button type="button" class="btn btn-clair" data-annuler>Annuler</button><button type="submit" form="fp" class="btn btn-primaire">${ic('ok')} Enregistrer</button>`,
    onOuvert(corps, pied) {
      $('[data-annuler]', pied).onclick = fermerFenetre;
      $('#fp', corps).onsubmit = async ev => {
        ev.preventDefault();
        try { await S.modifier('photos', p.id, lireFormulaire(ev.target)); fermerFenetre(); toast('Photo modifiée'); } catch (err) { erreur(err); }
      };
    }
  });
}

function formTeleversement(fichiers) {
  const nom = f => f.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').replace(/^(img|dsc|pxl|photo)\s*\d*/i, '').trim();
  let enCours = false;
  const envoyes = new Set();
  ouvrirFenetre({
    titre: fichiers.length > 1 ? `Ajouter ${fichiers.length} photos` : 'Ajouter une photo',
    large: true,
    contenu: `<form id="ft">
      <div class="grille-champs">
        ${champ({ cle: 'categorie', label: 'Catégorie', type: 'select', valeur: 'camps', options: optionsCategories })}
        <div class="champ champ-case">${champ({ cle: 'visible', label: 'Afficher tout de suite sur le site', type: 'case', valeur: true })}</div>
      </div>
      <ul class="televersement">${fichiers.map((f, i) => `<li><img data-i="${i}" alt=""><input name="leg${i}" value="${esc(nom(f))}" placeholder="Légende de la photo"><span class="etat-envoi" data-etat="${i}"></span></li>`).join('')}</ul>
    </form>`,
    pied: `<button type="button" class="btn btn-clair" data-annuler>Annuler</button><button type="submit" form="ft" class="btn btn-primaire" id="envoyer">${ic('televerser')} Envoyer</button>`,
    onOuvert(corps, pied) {
      fichiers.forEach((f, i) => { const u = URL.createObjectURL(f); const im = $(`img[data-i="${i}"]`, corps); im.onload = () => URL.revokeObjectURL(u); im.src = u; });
      $('[data-annuler]', pied).onclick = () => { if (!enCours) fermerFenetre(); };
      $('#ft', corps).onsubmit = async ev => {
        ev.preventDefault();
        if (enCours) return;
        enCours = true; $('#envoyer', pied).disabled = true;
        const f = ev.target, categorie = f.categorie.value, visible = f.visible.checked;
        let ordre = prochainOrdre('photos'), ok = 0;
        for (let i = 0; i < fichiers.length; i++) {
          if (envoyes.has(i)) continue;
          const etat = $(`[data-etat="${i}"]`, corps);
          etat.textContent = 'Envoi…'; etat.className = 'etat-envoi';
          try {
            const { apercu, hd } = await preparerPhoto(fichiers[i]);
            await S.ajouterPhoto({ legende: f['leg' + i].value.trim(), categorie, visible, ordre: ordre++, ajouteLe: Date.now() }, apercu, hd);
            etat.textContent = 'Envoyée'; etat.classList.add('ok'); ok++; envoyes.add(i);
          } catch (err) {
            console.error(err); etat.textContent = S.messageErreur(err); etat.classList.add('ko');
          }
        }
        enCours = false;
        toast(`${ok} photo${ok > 1 ? 's' : ''} ajoutée${ok > 1 ? 's' : ''}`, ok ? 'ok' : 'erreur');
        if (envoyes.size === fichiers.length) fermerFenetre(); else $('#envoyer', pied).disabled = false;
      };
    }
  });
}
