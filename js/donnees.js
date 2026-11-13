// Contenu d'origine du site et définition des champs modifiables.
// Sert au mode démo et au bouton « Importer le contenu actuel du site ».
import { SITE_URL } from '../firebase-config.js';

// ---------------------------------------------------------------- Textes
// Chaque champ correspond à un emplacement [data-cms="cle"] du site public.
// Organisation : une page du site → des zones (dans l'ordre où on les voit) → des champs.
export const PAGES_TEXTES = [
  { id: 'accueil', titre: 'Accueil', page: '', apercu: 'accueil', zones: [
    { titre: 'Grand bandeau en haut de page', champs: [
      { cle: 'accueil_hero_titre', label: 'Grand titre — partie blanche', type: 'titre', max: 40, aide: 'Entrée pour aller à la ligne.' },
      { cle: 'accueil_hero_accent', label: 'Grand titre — partie dorée', type: 'ligne', max: 30 },
      { cle: 'accueil_hero_texte', label: 'Texte de présentation', type: 'texte', max: 260 },
    ]},
    { titre: 'Section « Bienvenue »', champs: [
      { cle: 'accueil_bienvenue_titre', label: 'Titre', type: 'ligne', max: 70 },
      { cle: 'accueil_bienvenue_texte', label: 'Texte', type: 'texte', max: 450 },
    ]},
    { titre: 'Citation sous le bleuet', champs: [
      { cle: 'citation', label: 'Citation', type: 'texte', max: 160 },
    ]},
  ]},
  { id: 'association', titre: "L'association", page: 'association.html', apercu: 'bandeau', zones: [
    { titre: 'Bandeau en haut de page', champs: [
      { cle: 'asso_titre', label: 'Titre de la page', type: 'ligne', max: 40 },
      { cle: 'asso_intro', label: 'Texte sous le titre', type: 'texte', max: 200 },
    ]},
    { titre: 'Section « Notre histoire »', champs: [
      { cle: 'asso_histoire_titre', label: 'Titre', type: 'ligne', max: 70 },
      { cle: 'asso_histoire_texte', label: 'Texte', type: 'texte', max: 450 },
      { cle: 'asso_citation', label: 'Phrase mise en avant (en italique)', type: 'texte', max: 220 },
    ]},
    { titre: 'Section « Nos valeurs »', champs: [
      { cle: 'asso_valeurs_titre', label: 'Titre', type: 'ligne', max: 70 },
      { cle: 'asso_valeurs_texte', label: 'Texte', type: 'texte', max: 450 },
    ]},
  ]},
  { id: 'activites', titre: 'Activités', page: 'activites.html', apercu: 'bandeau', zones: [
    { titre: 'Bandeau en haut de page', champs: [
      { cle: 'act_titre', label: 'Titre de la page', type: 'ligne', max: 40 },
      { cle: 'act_intro', label: 'Texte sous le titre', type: 'texte', max: 200 },
    ]},
    { titre: 'Bloc 1 — Militaire', champs: [
      { cle: 'act_camps_titre', label: 'Titre', type: 'ligne', max: 50 },
      { cle: 'act_camps_texte', label: 'Texte', type: 'texte', max: 400 },
    ]},
    { titre: 'Bloc 2 — Civil', champs: [
      { cle: 'act_civil_titre', label: 'Titre', type: 'ligne', max: 50 },
      { cle: 'act_civil_texte', label: 'Texte', type: 'texte', max: 400 },
    ]},
    { titre: 'Bloc 3 — Mémoire', champs: [
      { cle: 'act_memoire_titre', label: 'Titre', type: 'ligne', max: 50 },
      { cle: 'act_memoire_texte', label: 'Texte', type: 'texte', max: 400 },
    ]},
    { titre: 'Bloc 4 — Partenaires', champs: [
      { cle: 'act_partenaires_titre', label: 'Titre', type: 'ligne', max: 50 },
      { cle: 'act_partenaires_texte', label: 'Texte', type: 'texte', max: 400 },
    ]},
  ]},
  { id: 'historique', titre: 'Historique', page: 'historique.html', apercu: 'bandeau', note: 'Les étapes elles-mêmes se modifient dans l\'onglet Historique.', lienNote: '#historique', zones: [
    { titre: 'Bandeau en haut de page', champs: [
      { cle: 'historique_titre', label: 'Titre de la page', type: 'ligne', max: 40 },
      { cle: 'historique_intro', label: 'Texte sous le titre', type: 'texte', max: 200 },
    ]},
  ]},
  { id: 'archives', titre: 'Archives du Front', page: 'archives.html', apercu: 'bandeau', note: 'Les photos se gèrent dans l\'onglet Archives du Front.', lienNote: '#archives', zones: [
    { titre: 'Bandeau en haut de page', champs: [
      { cle: 'archives_titre', label: 'Titre de la page', type: 'ligne', max: 40 },
      { cle: 'archives_intro', label: 'Texte sous le titre', type: 'texte', max: 200 },
    ]},
  ]},
  { id: 'agenda', titre: 'Agenda', page: 'agenda.html', apercu: 'bandeau', note: 'Les rendez-vous se gèrent dans l\'onglet Agenda.', lienNote: '#agenda', zones: [
    { titre: 'Bandeau en haut de page', champs: [
      { cle: 'agenda_titre', label: 'Titre de la page', type: 'ligne', max: 40 },
      { cle: 'agenda_intro', label: 'Texte sous le titre', type: 'texte', max: 200 },
    ]},
  ]},
  { id: 'rejoindre', titre: 'Nous rejoindre', page: 'rejoindre.html', apercu: 'bandeau', note: 'Les questions fréquentes se gèrent dans l\'onglet Questions fréquentes.', lienNote: '#faq', zones: [
    { titre: 'Bandeau en haut de page', champs: [
      { cle: 'rejoindre_titre', label: 'Titre de la page', type: 'ligne', max: 40 },
      { cle: 'rejoindre_intro', label: 'Texte sous le titre', type: 'texte', max: 200 },
    ]},
    { titre: 'Les trois cartes', champs: [
      { cle: 'rejoindre_membre', label: 'Carte « Devenir membre »', type: 'texte', max: 220 },
      { cle: 'rejoindre_don', label: 'Carte « Faire un don »', type: 'texte', max: 220 },
      { cle: 'rejoindre_inviter', label: 'Carte « Nous inviter »', type: 'texte', max: 220 },
    ]},
  ]},
  { id: 'contact', titre: 'Contact', page: 'contact.html', apercu: 'bandeau', note: 'L\'adresse, le téléphone et les liens se modifient dans l\'onglet Coordonnées & liens.', lienNote: '#coordonnees', zones: [
    { titre: 'Bandeau en haut de page', champs: [
      { cle: 'contact_titre', label: 'Titre de la page', type: 'ligne', max: 40 },
      { cle: 'contact_intro', label: 'Texte sous le titre', type: 'texte', max: 200 },
    ]},
  ]},
];

export const TEXTES_ORIGINE = {
  accueil_hero_titre: "Pour que leur\nmémoire ne",
  accueil_hero_accent: "s'efface jamais.",
  accueil_hero_texte: "Normandy Soldiers Memory fait revivre le quotidien civil et militaire de la Seconde Guerre mondiale pour transmettre l'histoire de la Libération et honorer, dans un esprit résolument pacifique, toutes ses victimes.",
  accueil_bienvenue_titre: "Des passionnés d'histoire au service de la mémoire",
  accueil_bienvenue_texte: "Depuis 2020, nos bénévoles revêtent uniformes et tenues civiles d'époque pour recréer la vie des soldats alliés et des familles normandes pendant la bataille de Normandie. Camps reconstitués, véhicules d'époque, cérémonies du souvenir : nous allons à la rencontre du public pour que cette histoire reste vivante.",
  citation: "Se souvenir de ceux qui sont tombés, civils comme militaires, c'est faire le choix de la paix.",
  asso_titre: "Qui sommes-nous",
  act_titre: "Faire revivre 1944",
  historique_titre: "Nos grandes étapes",
  archives_titre: "Archives du Front",
  agenda_titre: "Prochains rendez-vous",
  rejoindre_titre: "Rejoignez le devoir de mémoire",
  contact_titre: "Prendre contact",
  act_camps_titre: "Camps de reconstitution",
  act_civil_titre: "Reconstitutions civiles",
  act_memoire_titre: "Commémorations & hommages",
  act_partenaires_titre: "Animations sur mesure",
  asso_intro: "Une association de bénévoles passionnés, née à Ifs, aux portes de Caen, pour perpétuer le devoir de mémoire.",
  asso_histoire_titre: "Faire vivre l'histoire, pas la guerre",
  asso_histoire_texte: "Créée en février 2020, Normandy Soldiers Memory réunit des passionnés de la période 1939-1945. En uniformes et tenues civiles d'époque, avec du matériel authentique ou fidèlement reproduit, nous recréons la vie des soldats alliés et des civils pendant la bataille de Normandie.",
  asso_citation: "Reconstituer, ce n'est pas glorifier la guerre : c'est rendre visible ce qu'ont vécu ceux qui l'ont traversée, pour que les générations futures s'en souviennent.",
  asso_valeurs_titre: "Respect, rigueur, transmission",
  asso_valeurs_texte: "Nous attachons une grande importance à l'exactitude historique des tenues et du matériel, au respect dû aux anciens combattants et aux familles, et à un esprit résolument pacifique. Chaque sortie est l'occasion d'échanger avec le public et de partager ce que nous avons appris.",
  act_intro: "Nous créons nos propres événements et participons à ceux de nos partenaires, partout en Normandie.",
  act_camps_texte: "Nous installons des camps militaires tels qu'il en existait en Normandie en 1944 : tentes, matériel, véhicules d'époque. Nos membres en uniforme répondent aux questions des visiteurs. Ces camps sont ouverts gratuitement au public.",
  act_civil_texte: "La guerre ne s'est pas vécue qu'au front. Nous faisons revivre le quotidien des Normands sous l'Occupation et à la Libération : le café du village, les tenues, les objets du quotidien.",
  act_memoire_texte: "Nous participons aux cérémonies du souvenir aux côtés des autorités, des anciens combattants et des délégations alliées : dépôts de gerbes, marches du souvenir, haies d'honneur.",
  act_partenaires_texte: "Mairies, musées, écoles, comités des fêtes : nous intervenons pour animer une commémoration, une exposition ou une journée historique, seuls ou avec d'autres associations.",
  historique_intro: "De la création de l'association au 80ᵉ anniversaire du Débarquement : un parcours au service de la mémoire.",
  archives_intro: "Camps, convois, cérémonies et scènes de vie : nos sorties racontées en images, comme les pages d'un album de campagne.",
  agenda_intro: "Retrouvez-nous lors de nos prochaines sorties. Le programme est mis à jour au fil de la saison.",
  rejoindre_intro: "Que vous soyez reconstituteur confirmé, simple curieux ou collectivité, il existe une place pour vous à nos côtés.",
  rejoindre_membre: "Participez à nos camps et reconstitutions. Débutants bienvenus : nous vous accompagnons dans le choix de votre tenue et de votre rôle historique.",
  rejoindre_don: "Notre association fonctionne grâce à ses bénévoles et à la générosité de chacun. Chaque don nous aide à faire vivre nos actions de mémoire.",
  rejoindre_inviter: "Mairies, musées, écoles, comités des fêtes : faites appel à nous pour animer une commémoration, une exposition ou une journée historique.",
  contact_intro: "Une question, une demande d'intervention ou l'envie de nous rejoindre ? Nous vous répondrons avec plaisir.",
};

// ---------------------------------------------------------------- Coordonnées
export const CHAMPS_COORD = [
  { cle: 'adresse1', label: 'Adresse (ligne 1)', type: 'ligne' },
  { cle: 'adresse2', label: 'Adresse (ligne 2)', type: 'ligne' },
  { cle: 'telephone', label: 'Téléphone', type: 'ligne', aide: 'Format affiché sur le site, ex. 06 69 54 33 62.' },
  { cle: 'email', label: 'E-mail (facultatif)', type: 'email', aide: 'Laisser vide pour ne pas afficher d\'e-mail.' },
  { cle: 'facebook', label: 'Page Facebook', type: 'url' },
  { cle: 'helloasso', label: 'Page HelloAsso (dons)', type: 'url' },
];
export const COORD_ORIGINE = {
  adresse1: '7 rue Jean Cocteau',
  adresse2: '14123 Ifs — Calvados',
  telephone: '06 69 54 33 62',
  email: '',
  facebook: 'https://www.facebook.com/NormandySoldiersMemory/',
  helloasso: 'https://www.helloasso.com/associations/normandy-soldiers-memory',
};

export const ANNONCE_ORIGINE = { actif: false, texte: '', lien: '', libelleLien: 'En savoir plus' };

// ---------------------------------------------------------------- Agenda
export const STATUTS_EVT = {
  avenir: { label: 'À venir' },
  confirme: { label: 'Confirmé' },
  complet: { label: 'Complet' },
  reporte: { label: 'Reporté' },
  annule: { label: 'Annulé' },
};
export const EVENEMENTS_ORIGINE = [
  { titre: 'Camp de reconstitution de printemps', lieu: 'Lieu et dates communiqués prochainement', date: '', dateFin: '', libelleDate: 'Mai', statut: 'avenir', description: '', visible: true, ordre: 1 },
  { titre: 'Commémorations du Débarquement', lieu: 'Programme des cérémonies du 6 juin — Calvados', date: '', dateFin: '', libelleDate: '06 Juin', statut: 'avenir', description: '', visible: true, ordre: 2 },
  { titre: 'Fêtes de la Libération', lieu: 'Participation aux événements des communes partenaires', date: '', dateFin: '', libelleDate: 'Été', statut: 'avenir', description: '', visible: true, ordre: 3 },
  { titre: "Cérémonies de l'Armistice", lieu: 'Hommage aux combattants des deux guerres mondiales', date: '', dateFin: '', libelleDate: '11 Nov.', statut: 'avenir', description: '', visible: true, ordre: 4 },
];

// ---------------------------------------------------------------- Historique
export const HISTORIQUE_ORIGINE = [
  { annee: '1944', sousTitre: '6 juin', titre: 'Le Débarquement', texte: "Les forces alliées débarquent sur les plages de Normandie — Utah, Omaha, Gold, Juno, Sword. Commence alors la bataille de Normandie, qui coûtera la vie à des milliers de soldats et de civils. C'est leur mémoire que nous honorons.", lieu: 'Côtes du Calvados et de la Manche', visible: true, ordre: 1 },
  { annee: '2020', sousTitre: 'Février', titre: "Naissance de l'association", texte: "Normandy Soldiers Memory est officiellement déclarée en préfecture du Calvados, avec pour but de créer et de participer à des événements liés au Débarquement et à la Libération, et de perpétuer le devoir de mémoire.", lieu: 'Ifs, Calvados', visible: true, ordre: 2 },
  { annee: '2022', sousTitre: '14 – 15 mai', titre: 'Camp militaire de 1944 à Caen', texte: "Aux côtés de l'association En scène à Caen, nous reconstituons un camp militaire de la Seconde Guerre mondiale. Nos membres en costumes d'époque échangent avec les visiteurs sous les tentes.", lieu: 'Quartier Beaulieu, Caen', visible: true, ordre: 3 },
  { annee: '2024', sousTitre: '7 – 9 mai', titre: '« Dans les pas des Alliés » — 80e anniversaire', texte: "Pour le 80e anniversaire du Débarquement, nous organisons avec Résistance Alliés Déportation un camp de reconstitution complet : hôpital, cantine, poste de commandement. Entrée libre.", lieu: 'Parc municipal, Hermanville-sur-Mer', visible: true, ordre: 4 },
];

// ---------------------------------------------------------------- FAQ
export const FAQ_ORIGINE = [
  { question: 'Faut-il déjà posséder une tenue ?', reponse: 'Non. Nous vous conseillons pour constituer progressivement une tenue fidèle à la période et au rôle choisi.', visible: true, ordre: 1 },
  { question: "Faut-il être expert en histoire ?", reponse: "Pas du tout. La curiosité et l'envie d'apprendre suffisent : les échanges au sein de l'association font le reste.", visible: true, ordre: 2 },
  { question: 'Peut-on incarner un rôle civil ?', reponse: 'Oui. Les reconstitutions civiles sont essentielles pour montrer le quotidien des Normands pendant la guerre.', visible: true, ordre: 3 },
  { question: 'Comment adhérer ?', reponse: "Contactez-nous par téléphone ou via Facebook : nous vous présenterons l'association et les modalités d'adhésion.", visible: true, ordre: 4 },
];

// ---------------------------------------------------------------- Photos
export const CATEGORIES = {
  camps: 'Camps & véhicules',
  civil: 'Vie civile',
  commemorations: 'Commémorations',
  hommages: 'Hommages',
};
const P = (fichier, legende, categorie) => ({ fichier, legende, categorie });
const PHOTOS_SITE = [
  P('jeep-camp', 'Le camp Normandy Soldiers Memory', 'camps'),
  P('convoi-utah', 'Convoi de véhicules d’époque à Utah Beach', 'camps'),
  P('groupe-camion', 'Nos membres réunis devant un camion d’époque', 'camps'),
  P('cornemuse', 'Marche du souvenir au son de la cornemuse', 'hommages'),
  P('drapeaux', 'Porte-drapeaux lors d’une cérémonie', 'commemorations'),
  P('bistrot-serveuse', 'Scène de vie civile au café', 'civil'),
  P('hommage-horsa', 'Recueillement au mémorial de Horsa Bridge', 'hommages'),
  P('jeep-plage', 'Tenues civiles et RAF face à la mer', 'civil'),
  P('royal-marines', 'Rencontre avec les Royal Marines', 'commemorations'),
  P('bistrot-patron', 'Le patron du café, 1944', 'civil'),
  P('jeep-canada', 'Jeep et Red Ensign canadien dans la plaine', 'camps'),
  P('para-horsa', 'Récit historique devant la stèle de Horsa Bridge', 'hommages'),
  P('ceremonie-canadiens', 'Cérémonie au monument des régiments canadiens', 'commemorations'),
  P('paras-pegasus', 'Parachutistes au Mémorial Pegasus', 'hommages'),
];
// Les photos d'origine restent hébergées avec le site : on ne garde que leur adresse.
export const PHOTOS_ORIGINE = PHOTOS_SITE.map((p, i) => ({
  legende: p.legende, categorie: p.categorie, apercu: SITE_URL + 'photos/' + p.fichier + '.jpg',
  hd: false, visible: true, ordre: i + 1, ajouteLe: 0,
}));
