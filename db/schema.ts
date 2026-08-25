import { sqliteTable, integer, text, real, uniqueIndex } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'

export const anneePastorale = sqliteTable('annee_pastorale', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  libelle: text('libelle').notNull(),
  theme: text('theme'),
  dateDebut: text('date_debut').notNull(),
  dateFin: text('date_fin').notNull(),
  active: integer('active', { mode: 'boolean' }).default(false),
  description: text('description'),
  couleurAccent: text('couleur_accent').default('#C9A227'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
})

export const utilisateurs = sqliteTable('utilisateurs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  nom: text('nom').notNull(),
  prenom: text('prenom').notNull(),
  email: text('email').unique().notNull(),
  telephone: text('telephone'),
  passwordHash: text('password_hash').notNull(),
  role: text('role').default('membre'),
  photoUrl: text('photo_url'),
  dateNaissance: text('date_naissance'),
  sexe: text('sexe'),
  adresse: text('adresse'),
  statut: text('statut').default('actif'),
  tokenActivation: text('token_activation'),
  tokenActivationExpiry: text('token_activation_expiry'),
  tokenReset: text('token_reset'),
  tokenResetExpiry: text('token_reset_expiry'),
  anneeInscriptionId: integer('annee_inscription_id').references(() => anneePastorale.id),
  mouvementId: integer('mouvement_id').references(() => mouvements.id, { onDelete: 'set null' }),
  pointsTotal: integer('points_total').default(0),
  gradeId: integer('grade_id').references(() => grades.id, { onDelete: 'set null' }),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
})

export const membresBureau = sqliteTable('membres_bureau', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  utilisateurId: integer('utilisateur_id').notNull().references(() => utilisateurs.id, { onDelete: 'cascade' }),
  poste: text('poste').notNull(),
  commission: text('commission'),
  photoUrl: text('photo_url'),
  bio: text('bio'),
  instagram: text('instagram'),
  facebook: text('facebook'),
  whatsapp: text('whatsapp'),
  ordreAffichage: integer('ordre_affichage').default(0),
  anneePastoraleId: integer('annee_pastorale_id').references(() => anneePastorale.id),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
})

export const evenements = sqliteTable('evenements', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  titre: text('titre').notNull(),
  slug: text('slug').unique().notNull(),
  description: text('description'),
  descriptionCourte: text('description_courte'),
  dateDebut: text('date_debut').notNull(),
  dateFin: text('date_fin'),
  lieu: text('lieu'),
  adresse: text('adresse'),
  type: text('type'),
  prix: integer('prix').default(0),
  capacite: integer('capacite'),
  statut: text('statut').default('brouillon'),
  coverImageUrl: text('cover_image_url'),
  iconeEmoji: text('icone_emoji').default('📅'),
  gradientCouleur: text('gradient_couleur').default('from-royal to-royal-light'),
  qrCodeUrl: text('qr_code_url'),
  qrDescriptionPartage: text('qr_description_partage'),
  anneePastoraleId: integer('annee_pastorale_id').references(() => anneePastorale.id),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
})

export const evenementPhotos = sqliteTable('evenement_photos', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  evenementId: integer('evenement_id').references(() => evenements.id, { onDelete: 'cascade' }),
  photoUrl: text('photo_url').notNull(),
  legende: text('legende'),
  ordre: integer('ordre').default(0),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
})

export const reservationsInscriptions = sqliteTable('reservations_inscriptions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  evenementId: integer('evenement_id').references(() => evenements.id),
  utilisateurId: integer('utilisateur_id').references(() => utilisateurs.id),
  nom: text('nom').notNull(),
  prenom: text('prenom').notNull(),
  email: text('email').notNull(),
  telephone: text('telephone'),
  sexe: text('sexe'),
  nombrePlaces: integer('nombre_places').default(1),
  montantTotal: integer('montant_total').default(0),
  statut: text('statut').default('en_attente'),
  codeReservation: text('code_reservation').unique().notNull(),
  anneePastoraleId: integer('annee_pastorale_id').references(() => anneePastorale.id),
  commentaire: text('commentaire'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
})

export const slidesCarousel = sqliteTable('slides_carousel', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  badge: text('badge'),
  titre: text('titre').notNull(),
  titreHighlight: text('titre_highlight'),
  description: text('description'),
  photoUrl: text('photo_url'),
  ctaPrincipalLabel: text('cta_principal_label').notNull(),
  ctaPrincipalHref: text('cta_principal_href').notNull(),
  ctaPrincipalIcone: text('cta_principal_icone').default('CalendarDays'),
  ctaSecondaireLabel: text('cta_secondaire_label'),
  ctaSecondaireHref: text('cta_secondaire_href'),
  ordre: integer('ordre').default(0),
  actif: integer('actif', { mode: 'boolean' }).default(true),
  anneePastoraleId: integer('annee_pastorale_id').references(() => anneePastorale.id),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
})

export const objectifs = sqliteTable('objectifs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  titre: text('titre').notNull(),
  description: text('description').notNull(),
  icone: text('icone').default('🎯'),
  couleurGradient: text('couleur_gradient').default('from-royal to-royal-light'),
  ordre: integer('ordre').default(0),
  anneePastoraleId: integer('annee_pastorale_id').references(() => anneePastorale.id),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
})

export const annonces = sqliteTable('annonces', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  titre: text('titre').notNull(),
  contenu: text('contenu').notNull(),
  type: text('type').default('info'),
  imageUrl: text('image_url'),
  lienUrl: text('lien_url'),
  lienLabel: text('lien_label'),
  statut: text('statut').default('brouillon'),
  dateExpiration: text('date_expiration'),
  anneePastoraleId: integer('annee_pastorale_id').references(() => anneePastorale.id),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
})

export const newsletterAbonnes = sqliteTable('newsletter_abonnes', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').unique().notNull(),
  nom: text('nom'),
  prenom: text('prenom'),
  tokenConfirm: text('token_confirm').unique(),
  statut: text('statut').default('en_attente'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
})

export const notifications = sqliteTable('notifications', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  titre: text('titre').notNull(),
  message: text('message').notNull(),
  type: text('type').default('info'),
  cible: text('cible').default('tous'),
  utilisateurId: integer('utilisateur_id').references(() => utilisateurs.id),
  lu: integer('lu', { mode: 'boolean' }).default(false),
  anneePastoraleId: integer('annee_pastorale_id').references(() => anneePastorale.id),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
})

export const parametres = sqliteTable('parametres', {
  cle: text('cle').primaryKey(),
  valeur: text('valeur').notNull().default(''),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
})

export const mouvements = sqliteTable('mouvements', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  nom: text('nom').notNull(),
  slogan: text('slogan'),
  description: text('description'),
  logoUrl: text('logo_url'),
  couleur: text('couleur').default('#1B3A7A'),
  telephone: text('telephone'),
  email: text('email'),
  siteWeb: text('site_web'),
  heuresReunion: text('heures_reunion'),
  joursReunion: text('jours_reunion'),
  responsable: text('responsable'),
  ordreAffichage: integer('ordre_affichage').default(0),
  actif: integer('actif', { mode: 'boolean' }).default(true),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
})

export const grades = sqliteTable('grades', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  nom: text('nom').notNull(),
  description: text('description'),
  pointsMin: integer('points_min').notNull().default(0),
  couleur: text('couleur').default('#1A3A8F'),
  icone: text('icone').default('⭐'),
  ordre: integer('ordre').default(0),
  actif: integer('actif', { mode: 'boolean' }).default(true),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
})

export const categoriesPoints = sqliteTable('categories_points', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  nom: text('nom').notNull(),
  description: text('description'),
  icone: text('icone').default('📋'),
  ordre: integer('ordre').default(0),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
})

export const reglesPoints = sqliteTable('regles_points', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  categorieId: integer('categorie_id').references(() => categoriesPoints.id, { onDelete: 'cascade' }),
  libelle: text('libelle').notNull(),
  description: text('description'),
  points: integer('points').notNull().default(0),
  type: text('type').notNull().default('manuel'),
  actif: integer('actif', { mode: 'boolean' }).default(true),
  ordre: integer('ordre').default(0),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
})

export const historiquePoints = sqliteTable('historique_points', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  utilisateurId: integer('utilisateur_id').notNull().references(() => utilisateurs.id, { onDelete: 'cascade' }),
  regleId: integer('regle_id').references(() => reglesPoints.id, { onDelete: 'set null' }),
  regleLibelle: text('regle_libelle').notNull(),
  points: integer('points').notNull(),
  referenceType: text('reference_type'),
  referenceId: integer('reference_id'),
  note: text('note'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
})

export const sondages = sqliteTable('sondages', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  titre: text('titre').notNull(),
  description: text('description'),
  slug: text('slug').unique().notNull(),
  dateDebut: text('date_debut').notNull(),
  dateFin: text('date_fin').notNull(),
  statut: text('statut').default('brouillon'), // 'brouillon' | 'actif' | 'ferme'
  qrCodeUrl: text('qr_code_url'),
  anneePastoraleId: integer('annee_pastorale_id').references(() => anneePastorale.id),
  createdBy: integer('created_by').references(() => utilisateurs.id),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
})

export const sondageQuestions = sqliteTable('sondage_questions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  sondageId: integer('sondage_id').notNull().references(() => sondages.id, { onDelete: 'cascade' }),
  texte: text('texte').notNull(),
  ordre: integer('ordre').default(0),
})

export const sondageOptions = sqliteTable('sondage_options', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  questionId: integer('question_id').notNull().references(() => sondageQuestions.id, { onDelete: 'cascade' }),
  texte: text('texte').notNull(),
  ordre: integer('ordre').default(0),
})

export const sondageVotes = sqliteTable('sondage_votes', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  sondageId: integer('sondage_id').notNull().references(() => sondages.id, { onDelete: 'cascade' }),
  questionId: integer('question_id').notNull().references(() => sondageQuestions.id, { onDelete: 'cascade' }),
  optionId: integer('option_id').notNull().references(() => sondageOptions.id, { onDelete: 'cascade' }),
  utilisateurId: integer('utilisateur_id').notNull().references(() => utilisateurs.id, { onDelete: 'cascade' }),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
  uneVoixParQuestion: uniqueIndex('sondage_votes_question_utilisateur_unique').on(table.questionId, table.utilisateurId),
}))

export type AnneePastorale = typeof anneePastorale.$inferSelect
export type Utilisateur = typeof utilisateurs.$inferSelect
export type MembreBureau = typeof membresBureau.$inferSelect
export type Evenement = typeof evenements.$inferSelect
export type EvenementPhoto = typeof evenementPhotos.$inferSelect
export type ReservationInscription = typeof reservationsInscriptions.$inferSelect
export type SlideCarousel = typeof slidesCarousel.$inferSelect
export type Objectif = typeof objectifs.$inferSelect
export type Annonce = typeof annonces.$inferSelect
export type NewsletterAbonne = typeof newsletterAbonnes.$inferSelect
export type Notification = typeof notifications.$inferSelect
export type Parametre = typeof parametres.$inferSelect
export type Mouvement = typeof mouvements.$inferSelect
export type Grade = typeof grades.$inferSelect
export type CategoriePoints = typeof categoriesPoints.$inferSelect
export type ReglePoints = typeof reglesPoints.$inferSelect
export type HistoriquePoints = typeof historiquePoints.$inferSelect
export type Sondage = typeof sondages.$inferSelect
export type SondageQuestion = typeof sondageQuestions.$inferSelect
export type SondageOption = typeof sondageOptions.$inferSelect
export type SondageVote = typeof sondageVotes.$inferSelect
