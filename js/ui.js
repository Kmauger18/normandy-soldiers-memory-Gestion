// Petits outils d'interface partagés par tous les écrans
export const $ = (sel, racine = document) => racine.querySelector(sel);
export const $$ = (sel, racine = document) => [...racine.querySelectorAll(sel)];

export function esc(t) {
  return String(t ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// ---------- Icônes (traits, 24×24) ----------
const P = {
  tableau: '<path d="M3 13h8V3H3zM13 21h8V11h-8zM3 21h8v-6H3zM13 3v6h8V3z"/>',
  textes: '<path d="M4 6h16M4 12h10M4 18h7"/><path d="M17 15l3 3-3 3"/>',
  agenda: '<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18M8 2v4M16 2v4"/>',
  photos: '<rect x="3" y="5" width="18" height="15" rx="2"/><circle cx="9" cy="11" r="2"/><path d="M21 17l-5-5-9 8"/>',
  historique: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  faq: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .9-1 1.7M12 17h.01"/>',
  contact: '<path d="M4 4h16v16H4z"/><path d="M4 7l8 6 8-6"/>',
  annonce: '<path d="M3 11v2a1 1 0 0 0 1 1h2l5 4V6L6 10H4a1 1 0 0 0-1 1z"/><path d="M16 8a5 5 0 0 1 0 8M19 5a9 9 0 0 1 0 14"/>',
  parametres: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  modifier: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
  supprimer: '<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/>',
  haut: '<path d="M12 19V5M5 12l7-7 7 7"/>',
  bas: '<path d="M12 5v14M19 12l-7 7-7-7"/>',
  oeil: '<path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/>',
  oeilBarre: '<path d="M17.9 17.9A10.8 10.8 0 0 1 12 19C5 19 1 12 1 12a19.8 19.8 0 0 1 5.1-5.9M9.9 4.2A10 10 0 0 1 12 4c7 0 11 8 11 8a19.6 19.6 0 0 1-2.2 3.2M1 1l22 22"/><path d="M14.1 14.1a3 3 0 1 1-4.2-4.2"/>',
  externe: '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/>',
  sortie: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
  menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
  fermer: '<path d="M18 6L6 18M6 6l12 12"/>',
  ok: '<path d="M20 6L9 17l-5-5"/>',
  alerte: '<circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16h.01"/>',
  televerser: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>',
  telecharger: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>',
  lieu: '<path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
  utilisateur: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',
  cle: '<circle cx="7.5" cy="15.5" r="4.5"/><path d="M10.7 12.3L21 2M17 6l3 3M15 8l2 2"/>',
};
export function ic(nom, cls = '') {
  return `<svg class="ic ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[nom] || ''}</svg>`;
}

// ---------- Notifications ----------
let minuteurToast;
export function toast(message, type = 'ok') {
  const el = $('#toast');
  el.innerHTML = ic(type === 'erreur' ? 'alerte' : 'ok') + `<span>${esc(message)}</span>`;
  el.className = 'toast visible ' + (type === 'erreur' ? 'erreur' : '');
  clearTimeout(minuteurToast);
  minuteurToast = setTimeout(() => el.classList.remove('visible'), type === 'erreur' ? 9000 : 2800);
}

// ---------- Fenêtre (formulaires) ----------
let fermetureCourante = null;
export function ouvrirFenetre({ titre, contenu, pied = '', large = false, onOuvert, onFerme }) {
  const f = $('#fenetre');
  $('#fenetre-titre').textContent = titre;
  $('#fenetre-corps').innerHTML = contenu;
  $('#fenetre-pied').innerHTML = pied;
  $('#fenetre-pied').hidden = !pied;
  f.querySelector('.fenetre-boite').classList.toggle('large', large);
  f.hidden = false;
  document.body.classList.add('bloque');
  requestAnimationFrame(() => f.classList.add('ouverte'));
  fermetureCourante = onFerme || null;
  if (onOuvert) onOuvert($('#fenetre-corps'), $('#fenetre-pied'));
  setTimeout(() => { const c = $('#fenetre-corps input:not([type=hidden]):not([type=file]):not([type=checkbox]), #fenetre-corps textarea'); if (c && matchMedia('(min-width: 760px)').matches) c.focus(); }, 60);
}
export function fermerFenetre() {
  const f = $('#fenetre');
  if (f.hidden) return;
  f.classList.remove('ouverte');
  document.body.classList.remove('bloque');
  setTimeout(() => { f.hidden = true; }, 180);
  if (fermetureCourante) { const c = fermetureCourante; fermetureCourante = null; c(); }
}

export function confirmer(message, { libelle = 'Supprimer', danger = true } = {}) {
  return new Promise(resolve => {
    let reponse = false;
    ouvrirFenetre({
      titre: 'Confirmation',
      contenu: `<p class="confirm-texte">${esc(message)}</p>`,
      pied: `<button type="button" class="btn btn-clair" data-r="0">Annuler</button><button type="button" class="btn ${danger ? 'btn-danger' : 'btn-primaire'}" data-r="1">${esc(libelle)}</button>`,
      onOuvert: (corps, pied) => pied.querySelectorAll('[data-r]').forEach(b => b.onclick = () => { reponse = b.dataset.r === '1'; fermerFenetre(); }),
      onFerme: () => resolve(reponse),
    });
  });
}

// ---------- Champs de formulaire ----------
export function champ({ cle, label, type = 'ligne', valeur = '', aide = '', requis = false, options = null, placeholder = '' }) {
  const id = 'c_' + cle;
  let entree;
  if (type === 'texte') entree = `<textarea id="${id}" name="${cle}" rows="4" ${requis ? 'required' : ''} placeholder="${esc(placeholder)}">${esc(valeur)}</textarea>`;
  else if (type === 'select') entree = `<select id="${id}" name="${cle}">${Object.entries(options).map(([k, v]) => `<option value="${esc(k)}" ${k === valeur ? 'selected' : ''}>${esc(v)}</option>`).join('')}</select>`;
  else if (type === 'case') return `<label class="case"><input type="checkbox" id="${id}" name="${cle}" ${valeur ? 'checked' : ''}><span>${esc(label)}</span></label>${aide ? `<p class="aide">${esc(aide)}</p>` : ''}`;
  else {
    const t = { ligne: 'text', email: 'email', url: 'url', date: 'date', nombre: 'number' }[type] || 'text';
    entree = `<input type="${t}" id="${id}" name="${cle}" value="${esc(valeur)}" ${requis ? 'required' : ''} placeholder="${esc(placeholder)}">`;
  }
  return `<div class="champ"><label for="${id}">${esc(label)}${requis ? ' <b>*</b>' : ''}</label>${entree}${aide ? `<p class="aide">${esc(aide)}</p>` : ''}</div>`;
}
export function lireFormulaire(form) {
  const o = {};
  $$('input, textarea, select', form).forEach(e => {
    if (!e.name) return;
    o[e.name] = e.type === 'checkbox' ? e.checked : e.value.trim();
  });
  return o;
}

// ---------- Images ----------
function chargerImage(fichier) {
  return new Promise((resolve, reject) => {
    const lecteur = new FileReader();
    lecteur.onerror = () => reject(new Error('Lecture de la photo impossible.'));
    lecteur.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Ce fichier n\'est pas une image lisible.'));
      img.onload = () => resolve(img);
      img.src = lecteur.result;
    };
    lecteur.readAsDataURL(fichier);
  });
}
function redimensionner(img, largeurMax, qualite, plafond) {
  const ratio = Math.min(1, largeurMax / Math.max(img.width, img.height));
  const c = document.createElement('canvas');
  c.width = Math.round(img.width * ratio); c.height = Math.round(img.height * ratio);
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height);
  ctx.drawImage(img, 0, 0, c.width, c.height);
  let q = qualite, url = c.toDataURL('image/jpeg', q);
  while (url.length > plafond && q > 0.4) { q -= 0.07; url = c.toDataURL('image/jpeg', q); }
  return url;
}
// Aperçu (galerie du site) + grande version (visionneuse), assez légers pour Firestore gratuit
export async function preparerPhoto(fichier) {
  const img = await chargerImage(fichier);
  return {
    apercu: redimensionner(img, 900, 0.78, 180000),
    hd: redimensionner(img, 1800, 0.82, 850000),
  };
}

export function telecharger(texte, nomFichier, type = 'application/json') {
  const url = URL.createObjectURL(new Blob([texte], { type }));
  const a = document.createElement('a');
  a.href = url; a.download = nomFichier;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

// ---------- Dates ----------
export function isoJour(d = new Date()) {
  const z = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`;
}
export function dateLisible(iso) {
  if (!iso) return '';
  return new Date(iso + 'T12:00:00').toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' });
}
