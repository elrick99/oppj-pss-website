CREATE TABLE `annee_pastorale` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`libelle` text NOT NULL,
	`theme` text,
	`date_debut` text NOT NULL,
	`date_fin` text NOT NULL,
	`active` integer DEFAULT false,
	`description` text,
	`couleur_accent` text DEFAULT '#C9A227',
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `annonces` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`titre` text NOT NULL,
	`contenu` text NOT NULL,
	`type` text DEFAULT 'info',
	`image_url` text,
	`lien_url` text,
	`lien_label` text,
	`statut` text DEFAULT 'brouillon',
	`date_expiration` text,
	`annee_pastorale_id` integer,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`annee_pastorale_id`) REFERENCES `annee_pastorale`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `categories_points` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nom` text NOT NULL,
	`description` text,
	`icone` text DEFAULT '📋',
	`ordre` integer DEFAULT 0,
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `evenement_photos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`evenement_id` integer,
	`photo_url` text NOT NULL,
	`legende` text,
	`ordre` integer DEFAULT 0,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`evenement_id`) REFERENCES `evenements`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `evenements` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`titre` text NOT NULL,
	`slug` text NOT NULL,
	`description` text,
	`description_courte` text,
	`date_debut` text NOT NULL,
	`date_fin` text,
	`lieu` text,
	`adresse` text,
	`type` text,
	`prix` integer DEFAULT 0,
	`capacite` integer,
	`statut` text DEFAULT 'brouillon',
	`cover_image_url` text,
	`icone_emoji` text DEFAULT '📅',
	`gradient_couleur` text DEFAULT 'from-royal to-royal-light',
	`qr_code_url` text,
	`qr_description_partage` text,
	`annee_pastorale_id` integer,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`annee_pastorale_id`) REFERENCES `annee_pastorale`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `evenements_slug_unique` ON `evenements` (`slug`);--> statement-breakpoint
CREATE TABLE `grades` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nom` text NOT NULL,
	`description` text,
	`points_min` integer DEFAULT 0 NOT NULL,
	`couleur` text DEFAULT '#1A3A8F',
	`icone` text DEFAULT '⭐',
	`ordre` integer DEFAULT 0,
	`actif` integer DEFAULT true,
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `historique_points` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`utilisateur_id` integer NOT NULL,
	`regle_id` integer,
	`regle_libelle` text NOT NULL,
	`points` integer NOT NULL,
	`reference_type` text,
	`reference_id` integer,
	`note` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateurs`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`regle_id`) REFERENCES `regles_points`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `membres_bureau` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`utilisateur_id` integer NOT NULL,
	`poste` text NOT NULL,
	`commission` text,
	`photo_url` text,
	`bio` text,
	`instagram` text,
	`facebook` text,
	`whatsapp` text,
	`ordre_affichage` integer DEFAULT 0,
	`annee_pastorale_id` integer,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateurs`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`annee_pastorale_id`) REFERENCES `annee_pastorale`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `mouvements` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nom` text NOT NULL,
	`slogan` text,
	`description` text,
	`logo_url` text,
	`couleur` text DEFAULT '#1B3A7A',
	`telephone` text,
	`email` text,
	`site_web` text,
	`heures_reunion` text,
	`jours_reunion` text,
	`responsable` text,
	`ordre_affichage` integer DEFAULT 0,
	`actif` integer DEFAULT true,
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `newsletter_abonnes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`nom` text,
	`prenom` text,
	`token_confirm` text,
	`statut` text DEFAULT 'en_attente',
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE UNIQUE INDEX `newsletter_abonnes_email_unique` ON `newsletter_abonnes` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `newsletter_abonnes_token_confirm_unique` ON `newsletter_abonnes` (`token_confirm`);--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`titre` text NOT NULL,
	`message` text NOT NULL,
	`type` text DEFAULT 'info',
	`cible` text DEFAULT 'tous',
	`utilisateur_id` integer,
	`lu` integer DEFAULT false,
	`annee_pastorale_id` integer,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateurs`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`annee_pastorale_id`) REFERENCES `annee_pastorale`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `objectifs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`titre` text NOT NULL,
	`description` text NOT NULL,
	`icone` text DEFAULT '🎯',
	`couleur_gradient` text DEFAULT 'from-royal to-royal-light',
	`ordre` integer DEFAULT 0,
	`annee_pastorale_id` integer,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`annee_pastorale_id`) REFERENCES `annee_pastorale`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `parametres` (
	`cle` text PRIMARY KEY NOT NULL,
	`valeur` text DEFAULT '' NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `regles_points` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`categorie_id` integer,
	`libelle` text NOT NULL,
	`description` text,
	`points` integer DEFAULT 0 NOT NULL,
	`type` text DEFAULT 'manuel' NOT NULL,
	`actif` integer DEFAULT true,
	`ordre` integer DEFAULT 0,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`categorie_id`) REFERENCES `categories_points`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `reservations_inscriptions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`evenement_id` integer,
	`utilisateur_id` integer,
	`nom` text NOT NULL,
	`prenom` text NOT NULL,
	`email` text NOT NULL,
	`telephone` text,
	`sexe` text,
	`nombre_places` integer DEFAULT 1,
	`montant_total` integer DEFAULT 0,
	`statut` text DEFAULT 'en_attente',
	`code_reservation` text NOT NULL,
	`annee_pastorale_id` integer,
	`commentaire` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`evenement_id`) REFERENCES `evenements`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateurs`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`annee_pastorale_id`) REFERENCES `annee_pastorale`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `reservations_inscriptions_code_reservation_unique` ON `reservations_inscriptions` (`code_reservation`);--> statement-breakpoint
CREATE TABLE `slides_carousel` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`badge` text,
	`titre` text NOT NULL,
	`titre_highlight` text,
	`description` text,
	`photo_url` text,
	`cta_principal_label` text NOT NULL,
	`cta_principal_href` text NOT NULL,
	`cta_principal_icone` text DEFAULT 'CalendarDays',
	`cta_secondaire_label` text,
	`cta_secondaire_href` text,
	`ordre` integer DEFAULT 0,
	`actif` integer DEFAULT true,
	`annee_pastorale_id` integer,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`annee_pastorale_id`) REFERENCES `annee_pastorale`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `sondage_options` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`question_id` integer NOT NULL,
	`texte` text NOT NULL,
	`ordre` integer DEFAULT 0,
	FOREIGN KEY (`question_id`) REFERENCES `sondage_questions`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `sondage_questions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`sondage_id` integer NOT NULL,
	`texte` text NOT NULL,
	`ordre` integer DEFAULT 0,
	FOREIGN KEY (`sondage_id`) REFERENCES `sondages`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `sondage_votes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`sondage_id` integer NOT NULL,
	`question_id` integer NOT NULL,
	`option_id` integer NOT NULL,
	`utilisateur_id` integer NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`sondage_id`) REFERENCES `sondages`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`question_id`) REFERENCES `sondage_questions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`option_id`) REFERENCES `sondage_options`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateurs`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `sondage_votes_question_utilisateur_unique` ON `sondage_votes` (`question_id`,`utilisateur_id`);--> statement-breakpoint
CREATE TABLE `sondages` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`titre` text NOT NULL,
	`description` text,
	`slug` text NOT NULL,
	`date_debut` text NOT NULL,
	`date_fin` text NOT NULL,
	`statut` text DEFAULT 'brouillon',
	`qr_code_url` text,
	`annee_pastorale_id` integer,
	`created_by` integer,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`annee_pastorale_id`) REFERENCES `annee_pastorale`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`created_by`) REFERENCES `utilisateurs`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `sondages_slug_unique` ON `sondages` (`slug`);--> statement-breakpoint
CREATE TABLE `utilisateurs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nom` text NOT NULL,
	`prenom` text NOT NULL,
	`email` text NOT NULL,
	`telephone` text,
	`password_hash` text NOT NULL,
	`role` text DEFAULT 'membre',
	`photo_url` text,
	`date_naissance` text,
	`sexe` text,
	`adresse` text,
	`statut` text DEFAULT 'actif',
	`token_activation` text,
	`token_activation_expiry` text,
	`token_reset` text,
	`token_reset_expiry` text,
	`annee_inscription_id` integer,
	`mouvement_id` integer,
	`points_total` integer DEFAULT 0,
	`grade_id` integer,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`annee_inscription_id`) REFERENCES `annee_pastorale`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`mouvement_id`) REFERENCES `mouvements`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`grade_id`) REFERENCES `grades`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `utilisateurs_email_unique` ON `utilisateurs` (`email`);