import { sqliteTable, integer, text, real } from 'drizzle-orm/sqlite-core'
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
  adresse: text('adresse'),
  statut: text('statut').default('actif'),
  tokenActivation: text('token_activation'),
  tokenActivationExpiry: text('token_activation_expiry'),
  tokenReset: text('token_reset'),
  tokenResetExpiry: text('token_reset_expiry'),
  anneeInscriptionId: integer('annee_inscription_id').references(() => anneePastorale.id),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
})

export const membresBureau = sqliteTable('membres_bureau', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  nom: text('nom').notNull(),
  prenom: text('prenom').notNull(),
  poste: text('poste').notNull(),
  commission: text('commission'),
  photoUrl: text('photo_url'),
  bio: text('bio'),
  email: text('email'),
  telephone: text('telephone'),
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
