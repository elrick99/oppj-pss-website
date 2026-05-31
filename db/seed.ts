import Database from 'better-sqlite3'
import path from 'path'
import bcrypt from 'bcryptjs'

const sqlite = new Database(path.join(process.cwd(), 'oppj_database.db'))
sqlite.pragma('journal_mode = WAL')
sqlite.pragma('foreign_keys = ON')

sqlite.exec(`
CREATE TABLE IF NOT EXISTS annee_pastorale (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  libelle TEXT NOT NULL,
  theme TEXT,
  date_debut TEXT NOT NULL,
  date_fin TEXT NOT NULL,
  active INTEGER DEFAULT 0,
  description TEXT,
  couleur_accent TEXT DEFAULT '#C9A227',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS utilisateurs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nom TEXT NOT NULL,
  prenom TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  telephone TEXT,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'membre',
  photo_url TEXT,
  date_naissance TEXT,
  adresse TEXT,
  statut TEXT DEFAULT 'actif',
  annee_inscription_id INTEGER REFERENCES annee_pastorale(id),
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS membres_bureau (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nom TEXT NOT NULL,
  prenom TEXT NOT NULL,
  poste TEXT NOT NULL,
  commission TEXT,
  photo_url TEXT,
  bio TEXT,
  email TEXT,
  telephone TEXT,
  instagram TEXT,
  facebook TEXT,
  whatsapp TEXT,
  ordre_affichage INTEGER DEFAULT 0,
  annee_pastorale_id INTEGER REFERENCES annee_pastorale(id),
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS evenements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  titre TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  description_courte TEXT,
  date_debut TEXT NOT NULL,
  date_fin TEXT,
  lieu TEXT,
  adresse TEXT,
  type TEXT,
  prix INTEGER DEFAULT 0,
  capacite INTEGER,
  statut TEXT DEFAULT 'brouillon',
  cover_image_url TEXT,
  icone_emoji TEXT DEFAULT '📅',
  gradient_couleur TEXT DEFAULT 'from-royal to-royal-light',
  qr_code_url TEXT,
  qr_description_partage TEXT,
  annee_pastorale_id INTEGER REFERENCES annee_pastorale(id),
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS evenement_photos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  evenement_id INTEGER REFERENCES evenements(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  legende TEXT,
  ordre INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reservations_inscriptions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  evenement_id INTEGER REFERENCES evenements(id),
  utilisateur_id INTEGER REFERENCES utilisateurs(id),
  nom TEXT NOT NULL,
  prenom TEXT NOT NULL,
  email TEXT NOT NULL,
  telephone TEXT,
  nombre_places INTEGER DEFAULT 1,
  montant_total INTEGER DEFAULT 0,
  statut TEXT DEFAULT 'en_attente',
  code_reservation TEXT UNIQUE NOT NULL,
  annee_pastorale_id INTEGER REFERENCES annee_pastorale(id),
  commentaire TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS slides_carousel (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  badge TEXT,
  titre TEXT NOT NULL,
  titre_highlight TEXT,
  description TEXT,
  photo_url TEXT,
  cta_principal_label TEXT NOT NULL,
  cta_principal_href TEXT NOT NULL,
  cta_principal_icone TEXT DEFAULT 'CalendarDays',
  cta_secondaire_label TEXT,
  cta_secondaire_href TEXT,
  ordre INTEGER DEFAULT 0,
  actif INTEGER DEFAULT 1,
  annee_pastorale_id INTEGER REFERENCES annee_pastorale(id),
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS objectifs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  titre TEXT NOT NULL,
  description TEXT NOT NULL,
  icone TEXT DEFAULT '🎯',
  couleur_gradient TEXT DEFAULT 'from-royal to-royal-light',
  ordre INTEGER DEFAULT 0,
  annee_pastorale_id INTEGER REFERENCES annee_pastorale(id),
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS annonces (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  titre TEXT NOT NULL,
  contenu TEXT NOT NULL,
  type TEXT DEFAULT 'info',
  image_url TEXT,
  lien_url TEXT,
  lien_label TEXT,
  statut TEXT DEFAULT 'brouillon',
  date_expiration TEXT,
  annee_pastorale_id INTEGER REFERENCES annee_pastorale(id),
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS newsletter_abonnes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  nom TEXT,
  prenom TEXT,
  token_confirm TEXT UNIQUE,
  statut TEXT DEFAULT 'en_attente',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  titre TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info',
  cible TEXT DEFAULT 'tous',
  utilisateur_id INTEGER REFERENCES utilisateurs(id),
  lu INTEGER DEFAULT 0,
  annee_pastorale_id INTEGER REFERENCES annee_pastorale(id),
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
`)

const existingAnnee = sqlite.prepare('SELECT id FROM annee_pastorale LIMIT 1').get()
if (!existingAnnee) {
  const insertAnnee = sqlite.prepare(`
    INSERT INTO annee_pastorale (libelle, theme, date_debut, date_fin, active, description)
    VALUES (?, ?, ?, ?, ?, ?)
  `)
  const anneeResult = insertAnnee.run(
    '2024-2025',
    'Enracinés dans le Christ',
    '2024-09-01',
    '2025-08-31',
    1,
    "Année pastorale de l'OPPJ sous le thème de l'enracinement dans la foi catholique."
  )
  const anneeId = anneeResult.lastInsertRowid

  const passwordHash = bcrypt.hashSync('admin123', 12)
  sqlite.prepare(`
    INSERT INTO utilisateurs (nom, prenom, email, password_hash, role, statut, annee_inscription_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run('OPPJ', 'Admin', 'admin@oppj.org', passwordHash, 'admin', 'actif', anneeId)

  const membres = [
    ['Manzan', 'Jean-Koffi', 'Président', null, 0, 'jkm@oppj.org', null, 'Responsable de la direction générale du bureau.'],
    ['Laurier', 'Ange', 'Vice-Présidente', null, 1, 'al@oppj.org', null, "Assiste le président dans toutes ses fonctions."],
    ['Kouadio', 'Marie', 'Secrétaire', null, 2, 'mk@oppj.org', null, 'Gère la correspondance et les archives.'],
    ['Yao', 'Patrick', 'Trésorier', null, 3, 'py@oppj.org', null, 'Gère les finances et les cotisations.'],
    ['Koffi', 'Sophie', 'Responsable Communication', 'Commission Communication', 4, 'sk@oppj.org', null, 'Anime les réseaux sociaux et la communication externe.'],
    ['Aké', 'David', 'Responsable Liturgie', 'Commission Liturgie', 5, 'da@oppj.org', null, 'Coordonne les activités liturgiques et la chorale.'],
    ['NGuessan', 'Esther', 'Responsable Formation', 'Commission Formation', 6, 'en@oppj.org', null, 'Organise les sessions de formation et de catéchèse.'],
    ['Brou', 'Joseph', 'Responsable Action Sociale', 'Commission Action Sociale', 7, 'jb@oppj.org', null, 'Pilote les actions caritatives et de solidarité.'],
  ]
  const insertMembre = sqlite.prepare(`
    INSERT INTO membres_bureau (nom, prenom, poste, commission, ordre_affichage, email, whatsapp, bio, annee_pastorale_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)
  for (const m of membres) {
    insertMembre.run(...m, anneeId)
  }

  const insertSlide = sqlite.prepare(`
    INSERT INTO slides_carousel (badge, titre, titre_highlight, description, cta_principal_label, cta_principal_href, cta_principal_icone, cta_secondaire_label, cta_secondaire_href, ordre, actif, annee_pastorale_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)
  insertSlide.run('ÉVÉNEMENT À VENIR', 'Retraite Spirituelle', 'Jeunesse 2025', 'Trois jours de prière, de partage et de ressourcement. Un moment inoubliable avec 200+ jeunes de la paroisse. Places limitées !', 'Réserver ma place', '/evenements/retraite-spirituelle-jeunesse-2025', 'CalendarDays', 'En savoir plus', '#activites', 0, 1, anneeId)
  insertSlide.run('BIENVENUE', 'OPPJ', 'Sacrés Stigmates', "L'Office Paroissial de la Pastorale des Jeunes vous accueille. Rejoignez une communauté vibrante de jeunes catholiques engagés.", 'Nous rejoindre', '#contact', 'UserPlus', 'Découvrir', '#objectifs', 1, 1, anneeId)
  insertSlide.run('NOTRE MISSION', 'Former des', 'Leaders Chrétiens', "À travers la prière, la formation et l'action sociale, nous formons la prochaine génération de leaders au service de l'Église et de la société.", 'Nos programmes', '#activites', 'Rocket', 'Nos objectifs', '#objectifs', 2, 1, anneeId)

  const insertObjectif = sqlite.prepare(`
    INSERT INTO objectifs (titre, description, icone, couleur_gradient, ordre, annee_pastorale_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `)
  insertObjectif.run('Formation spirituelle', "Approfondir la foi catholique des jeunes à travers des retraites, enseignements et célébrations eucharistiques régulières.", '🙏', 'from-royal to-royal-light', 0, anneeId)
  insertObjectif.run('Fraternité & Communion', "Créer des liens forts entre les jeunes de la paroisse dans un esprit de service mutuel et d'amour fraternel.", '🤝', 'from-gold to-gold-light', 1, anneeId)
  insertObjectif.run('Leadership chrétien', "Former des leaders capables de témoigner de leur foi dans tous les domaines de la société avec intégrité et compétence.", '📈', 'from-royal-light to-royal', 2, anneeId)
  insertObjectif.run('Action sociale', "S'engager concrètement auprès des plus vulnérables à travers des projets caritatifs et des actions de solidarité.", '🌍', 'from-gold-light to-gold', 3, anneeId)

  const insertEvenement = sqlite.prepare(`
    INSERT INTO evenements (titre, slug, description, description_courte, date_debut, date_fin, lieu, type, prix, capacite, statut, icone_emoji, gradient_couleur, qr_description_partage, annee_pastorale_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)
  insertEvenement.run(
    'Retraite Spirituelle Jeunesse',
    'retraite-spirituelle-jeunesse-2025',
    "3 jours de prière intensive, d'enseignements bibliques et de fraternité dans un cadre naturel hors de la ville. Habillement et nourriture fournis. Un moment inoubliable pour se ressourcer et approfondir sa foi en communauté.",
    "3 jours de prière intensive, d'enseignements bibliques et de fraternité dans un cadre naturel hors de la ville.",
    '2025-08-14T08:00:00',
    '2025-08-16T18:00:00',
    'Centre de retraite La Providence, Yamoussoukro',
    'spirituel',
    5000,
    200,
    'publie',
    '⛺',
    'from-emerald-400 to-teal-500',
    "Rejoins-nous pour la Retraite Spirituelle Jeunesse 2025 ! 3 jours de prière et de fraternité. Inscris-toi maintenant :",
    anneeId
  )
  insertEvenement.run(
    'Soirée Louange & Adoration',
    'soiree-louange-adoration-2025',
    "Une nuit de louange avec nos talents musicaux de la paroisse. Concert gospel, adoration eucharistique et témoignages. Entrée libre avec donation. Venez vivre une expérience spirituelle unique en famille.",
    "Une nuit de louange avec nos talents musicaux de la paroisse. Concert gospel, adoration eucharistique et témoignages.",
    '2025-09-06T19:00:00',
    '2025-09-06T23:59:00',
    'Paroisse Sacrés Stigmates, Abidjan',
    'spirituel',
    0,
    500,
    'publie',
    '🎵',
    'from-royal to-royal-light',
    "Soirée Louange & Adoration à la Paroisse Sacrés Stigmates — Entrée libre ! Rejoins-nous :",
    anneeId
  )
  insertEvenement.run(
    'Gala Annuel OPPJ',
    'gala-annuel-oppj-2025',
    "Grande soirée de célébration et de reconnaissance. Dîner de gala, remise de prix, spectacles et tombola. Tenue de soirée exigée. Une soirée mémorable pour célébrer une année pastorale riche.",
    "Grande soirée de célébration et de reconnaissance. Dîner de gala, remise de prix, spectacles et tombola.",
    '2025-12-20T18:00:00',
    '2025-12-20T23:59:00',
    'Hôtel Tiama, Abidjan',
    'gala',
    15000,
    300,
    'publie',
    '🎭',
    'from-gold to-gold-light',
    "Gala Annuel OPPJ 2025 — Soirée de gala & célébration ! Réservez vite vos places :",
    anneeId
  )

  const insertAnnonce = sqlite.prepare(`
    INSERT INTO annonces (titre, contenu, type, statut, annee_pastorale_id)
    VALUES (?, ?, ?, ?, ?)
  `)
  insertAnnonce.run(
    'Inscriptions ouvertes — Retraite Spirituelle 2025',
    "Les inscriptions pour la Retraite Spirituelle Jeunesse 2025 sont désormais ouvertes ! Places limitées à 200 participants. Inscription obligatoire en ligne ou à la paroisse avant le 31 juillet 2025.",
    'evenement',
    'publie',
    anneeId
  )
  insertAnnonce.run(
    'Bienvenue dans la nouvelle plateforme OPPJ',
    "L'OPPJ lance sa nouvelle plateforme numérique ! Vous pouvez désormais vous inscrire aux événements en ligne, consulter le programme de l'année pastorale et rester connecté à la communauté.",
    'info',
    'publie',
    anneeId
  )

  console.log('✅ Base de données initialisée avec succès !')
  console.log(`   Compte admin : admin@oppj.org / admin123`)
} else {
  console.log('ℹ️  Base de données déjà initialisée.')
}

sqlite.close()
