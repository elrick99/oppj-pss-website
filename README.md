# OPPJ — Plateforme Dynamique
### Office Paroissial de la Pastorale des Jeunes — Paroisse Sacrés Stigmates

---

## Vue d'ensemble

Transformation de la plateforme OPPJ d'une interface statique vers une application **fullstack dynamique** pilotée par une base de données SQLite (`oppj_database.db`), avec un dashboard d'administration complet et une expérience utilisateur enrichie.

---

## Stack Technique

| Couche | Technologie |
|--------|-------------|
| Framework | Next.js 16 (App Router) |
| Base de données | SQLite via `better-sqlite3` |
| ORM | Drizzle ORM |
| Authentification | JWT + bcryptjs |
| Upload fichiers | Stockage local `/public/uploads/` + `sharp` (compression) |
| QR Code | `qrcode` (npm) |
| Email | Nodemailer |
| Temps réel | Server-Sent Events (SSE) |
| Validation | Zod (déjà installé) |
| UI | Tailwind CSS + shadcn/ui (déjà en place) |

---

## Architecture de la Base de Données

### Schéma Complet — `oppj_database.db`

```
annee_pastorale (centrale — liée à tout)
│
├── slides_carousel
├── objectifs
├── evenements
│   ├── evenement_photos
│   └── reservations_inscriptions
├── membres_bureau
├── utilisateurs
│   └── reservations_inscriptions
├── annonces
└── notifications
    
newsletter_abonnes (indépendant — couvre toutes les années)
```

---

### Détail des Tables

#### `annee_pastorale`
```sql
id              INTEGER PRIMARY KEY
libelle         TEXT NOT NULL          -- ex: "2024-2025"
theme           TEXT                   -- ex: "Enracinés dans le Christ"
date_debut      DATE NOT NULL
date_fin        DATE NOT NULL
active          BOOLEAN DEFAULT false  -- une seule active à la fois
description     TEXT
couleur_accent  TEXT DEFAULT '#C9A227' -- personnalisation visuelle
created_at      DATETIME DEFAULT CURRENT_TIMESTAMP
```

#### `utilisateurs`
```sql
id                  INTEGER PRIMARY KEY
nom                 TEXT NOT NULL
prenom              TEXT NOT NULL
email               TEXT UNIQUE NOT NULL
telephone           TEXT
password_hash       TEXT NOT NULL
role                TEXT DEFAULT 'membre'  -- admin | membre | visiteur
photo_url           TEXT
date_naissance      DATE
adresse             TEXT
statut              TEXT DEFAULT 'actif'   -- actif | inactif | suspendu
annee_inscription_id INTEGER REFERENCES annee_pastorale(id)
created_at          DATETIME DEFAULT CURRENT_TIMESTAMP
updated_at          DATETIME DEFAULT CURRENT_TIMESTAMP
```

#### `membres_bureau`
```sql
id                  INTEGER PRIMARY KEY
nom                 TEXT NOT NULL
prenom              TEXT NOT NULL
poste               TEXT NOT NULL          -- Président, Secrétaire, etc.
commission          TEXT                   -- Commission à laquelle il appartient
photo_url           TEXT
bio                 TEXT
email               TEXT
telephone           TEXT
instagram           TEXT
facebook            TEXT
whatsapp            TEXT
ordre_affichage     INTEGER DEFAULT 0
annee_pastorale_id  INTEGER REFERENCES annee_pastorale(id)
created_at          DATETIME DEFAULT CURRENT_TIMESTAMP
```

#### `evenements`
```sql
id                      INTEGER PRIMARY KEY
titre                   TEXT NOT NULL
slug                    TEXT UNIQUE NOT NULL      -- URL: /evenements/retraite-2025
description             TEXT
description_courte      TEXT
date_debut              DATETIME NOT NULL
date_fin                DATETIME
lieu                    TEXT
adresse                 TEXT
type                    TEXT                      -- spirituel|formation|social|culturel|gala|autre
prix                    INTEGER DEFAULT 0          -- en FCFA, 0 = gratuit
capacite                INTEGER
statut                  TEXT DEFAULT 'brouillon'  -- brouillon|publie|annule|passe
cover_image_url         TEXT
icone_emoji             TEXT DEFAULT '📅'
gradient_couleur        TEXT DEFAULT 'from-royal to-royal-light'
qr_code_url             TEXT                      -- chemin vers l'image QR générée
qr_description_partage  TEXT                      -- texte personnalisé pour le partage WhatsApp/IG/FB
annee_pastorale_id      INTEGER REFERENCES annee_pastorale(id)
created_at              DATETIME DEFAULT CURRENT_TIMESTAMP
updated_at              DATETIME DEFAULT CURRENT_TIMESTAMP
```

#### `evenement_photos`
```sql
id              INTEGER PRIMARY KEY
evenement_id    INTEGER REFERENCES evenements(id) ON DELETE CASCADE
photo_url       TEXT NOT NULL
legende         TEXT
ordre           INTEGER DEFAULT 0
created_at      DATETIME DEFAULT CURRENT_TIMESTAMP
```

#### `reservations_inscriptions`
```sql
id                  INTEGER PRIMARY KEY
evenement_id        INTEGER REFERENCES evenements(id)
utilisateur_id      INTEGER REFERENCES utilisateurs(id)   -- nullable si non-membre
nom                 TEXT NOT NULL
prenom              TEXT NOT NULL
email               TEXT NOT NULL
telephone           TEXT
nombre_places       INTEGER DEFAULT 1
montant_total       INTEGER DEFAULT 0
statut              TEXT DEFAULT 'en_attente'  -- en_attente|confirme|annule|rembourse
code_reservation    TEXT UNIQUE NOT NULL        -- ex: OPPJ-2025-A7K3
annee_pastorale_id  INTEGER REFERENCES annee_pastorale(id)
commentaire         TEXT
created_at          DATETIME DEFAULT CURRENT_TIMESTAMP
```

#### `slides_carousel`
```sql
id                      INTEGER PRIMARY KEY
badge                   TEXT                   -- ex: "ÉVÉNEMENT À VENIR"
titre                   TEXT NOT NULL
titre_highlight         TEXT                   -- partie colorée du titre
description             TEXT
photo_url               TEXT                   -- image de fond optionnelle
cta_principal_label     TEXT NOT NULL
cta_principal_href      TEXT NOT NULL
cta_principal_icone     TEXT DEFAULT 'CalendarDays'  -- nom de l'icône Lucide
cta_secondaire_label    TEXT
cta_secondaire_href     TEXT
ordre                   INTEGER DEFAULT 0
actif                   BOOLEAN DEFAULT true
annee_pastorale_id      INTEGER REFERENCES annee_pastorale(id)
created_at              DATETIME DEFAULT CURRENT_TIMESTAMP
```

#### `objectifs`
```sql
id                  INTEGER PRIMARY KEY
titre               TEXT NOT NULL
description         TEXT NOT NULL
icone               TEXT DEFAULT '🎯'
couleur_gradient    TEXT DEFAULT 'from-royal to-royal-light'
ordre               INTEGER DEFAULT 0
annee_pastorale_id  INTEGER REFERENCES annee_pastorale(id)
created_at          DATETIME DEFAULT CURRENT_TIMESTAMP
```

#### `annonces`
```sql
id                  INTEGER PRIMARY KEY
titre               TEXT NOT NULL
contenu             TEXT NOT NULL
type                TEXT DEFAULT 'info'    -- urgent|info|evenement|communaute
image_url           TEXT
lien_url            TEXT
lien_label          TEXT
statut              TEXT DEFAULT 'brouillon'  -- brouillon|publie|archive
date_expiration     DATETIME
annee_pastorale_id  INTEGER REFERENCES annee_pastorale(id)
created_at          DATETIME DEFAULT CURRENT_TIMESTAMP
updated_at          DATETIME DEFAULT CURRENT_TIMESTAMP
```

#### `newsletter_abonnes`
```sql
id              INTEGER PRIMARY KEY
email           TEXT UNIQUE NOT NULL
nom             TEXT
prenom          TEXT
token_confirm   TEXT UNIQUE              -- pour double opt-in
statut          TEXT DEFAULT 'en_attente'  -- en_attente|abonne|desabonne
created_at      DATETIME DEFAULT CURRENT_TIMESTAMP
```

#### `notifications`
```sql
id                  INTEGER PRIMARY KEY
titre               TEXT NOT NULL
message             TEXT NOT NULL
type                TEXT DEFAULT 'info'   -- info|succes|alerte|erreur
cible               TEXT DEFAULT 'tous'   -- tous|membres|admin|utilisateur
utilisateur_id      INTEGER REFERENCES utilisateurs(id)  -- si cible = utilisateur
lu                  BOOLEAN DEFAULT false
annee_pastorale_id  INTEGER REFERENCES annee_pastorale(id)
created_at          DATETIME DEFAULT CURRENT_TIMESTAMP
```

---

## Étapes de Réalisation

---

### PHASE 1 — Infrastructure & Base de Données
**Durée estimée : 2–3 jours**

#### 1.1 — Installation des dépendances

```bash
pnpm add better-sqlite3 drizzle-orm drizzle-kit
pnpm add bcryptjs jsonwebtoken
pnpm add qrcode sharp
pnpm add nodemailer
pnpm add @types/better-sqlite3 @types/bcryptjs @types/jsonwebtoken @types/qrcode @types/nodemailer -D
```

#### 1.2 — Structure des dossiers à créer

```
oppj/
├── db/
│   ├── index.ts           ← connexion SQLite
│   ├── schema.ts          ← schéma Drizzle ORM
│   └── migrations/        ← fichiers de migration auto-générés
├── lib/
│   ├── auth.ts            ← logique JWT
│   ├── qrcode.ts          ← génération QR
│   ├── upload.ts          ← gestion fichiers
│   ├── email.ts           ← envoi email
│   └── utils.ts           ← (existant)
├── app/
│   └── api/
│       ├── auth/
│       │   ├── login/route.ts
│       │   ├── register/route.ts
│       │   └── logout/route.ts
│       ├── annee-pastorale/route.ts
│       ├── evenements/
│       │   ├── route.ts
│       │   └── [id]/
│       │       ├── route.ts
│       │       ├── photos/route.ts
│       │       └── qrcode/route.ts
│       ├── slides/route.ts
│       ├── bureau/route.ts
│       ├── objectifs/route.ts
│       ├── reservations/route.ts
│       ├── annonces/route.ts
│       ├── newsletter/route.ts
│       ├── notifications/route.ts
│       ├── upload/route.ts
│       └── stats/route.ts
└── public/
    └── uploads/
        ├── evenements/
        ├── bureau/
        ├── slides/
        └── qrcodes/
```

#### 1.3 — Connexion à la base de données (`db/index.ts`)

```typescript
import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import * as schema from './schema'
import path from 'path'

const sqlite = new Database(
  path.join(process.cwd(), 'oppj_database.db')
)
sqlite.pragma('journal_mode = WAL')
sqlite.pragma('foreign_keys = ON')

export const db = drizzle(sqlite, { schema })
```

#### 1.4 — Configuration Drizzle (`drizzle.config.ts`)

```typescript
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './db/schema.ts',
  out: './db/migrations',
  dialect: 'sqlite',
  dbCredentials: { url: './oppj_database.db' },
})
```

#### 1.5 — Commandes de migration

```bash
# Générer la migration depuis le schéma
pnpm drizzle-kit generate

# Appliquer les migrations
pnpm drizzle-kit migrate

# Explorer la DB via interface visuelle (développement)
pnpm drizzle-kit studio
```

---

### PHASE 2 — Authentification & Sécurité
**Durée estimée : 2 jours**

#### 2.1 — JWT Auth (`lib/auth.ts`)
- Génération de token JWT signé (accès + refresh token)
- Middleware Next.js pour protéger les routes `/admin/*` et `/membre/*`
- Cookie httpOnly sécurisé pour stocker le token
- Hash des mots de passe avec bcryptjs (salt rounds: 12)

#### 2.2 — Pages à connecter à la DB
- [app/(auth)/connexion/page.tsx](app/(auth)/connexion/page.tsx) → `POST /api/auth/login`
- [app/(auth)/inscription/page.tsx](app/(auth)/inscription/page.tsx) → `POST /api/auth/register`
- [app/admin/connexion/page.tsx](app/admin/connexion/page.tsx) → `POST /api/auth/login` (rôle admin requis)

#### 2.3 — Middleware de protection (`middleware.ts`)

```typescript
// Protège /admin/* et /membre/* selon le rôle JWT
export const config = {
  matcher: ['/admin/:path*', '/membre/:path*']
}
```

---

### PHASE 3 — Module Année Pastorale
**Durée estimée : 1–2 jours**
*Ce module est le pivot de toute l'application.*

#### 3.1 — API Routes
- `GET /api/annee-pastorale` — liste toutes les années
- `GET /api/annee-pastorale/active` — retourne l'année active
- `POST /api/annee-pastorale` — créer une nouvelle année (admin)
- `PUT /api/annee-pastorale/[id]/activer` — activer une année (désactive l'ancienne automatiquement)
- `PUT /api/annee-pastorale/[id]` — modifier (thème, dates, etc.)

#### 3.2 — Page Dashboard Admin — Année Pastorale
**Fichier à créer :** `app/admin/(dashboard)/annee-pastorale/page.tsx`

Fonctionnalités :
- Créer une nouvelle année pastorale (libellé, thème, dates)
- Bouton "Activer cette année" avec confirmation
- Historique de toutes les années avec leurs statistiques
- Saisie du thème et des objectifs liés à l'année

#### 3.3 — Sélecteur d'année dans le dashboard
Ajouter dans `app/admin/(dashboard)/layout.tsx` un sélecteur global d'année pastorale qui filtre toutes les vues du dashboard (événements, membres du bureau, slides, etc.)

---

### PHASE 4 — Hero Carousel Dynamique
**Durée estimée : 1 jour**

#### 4.1 — API
- `GET /api/slides` — slides actifs de l'année pastorale courante (ou filtrée)
- `POST /api/slides` — créer un slide (admin)
- `PUT /api/slides/[id]` — modifier
- `DELETE /api/slides/[id]` — supprimer
- `PUT /api/slides/reorder` — réordonner (drag & drop)

#### 4.2 — Page Admin — Slides
**Fichier à créer :** `app/admin/(dashboard)/slides/page.tsx`

Fonctionnalités :
- Formulaire : badge, titre, partie colorée du titre, description, photo de fond
- Deux CTA configurables (label + lien + icône Lucide)
- Activation/désactivation par slide
- Aperçu en temps réel du slide

#### 4.3 — Modification du composant [hero-carousel.tsx](components/home/hero-carousel.tsx)
Transformer en **Server Component** qui fetch les slides depuis la DB :

```typescript
// Fetch server-side pour SEO optimal
const slides = await fetch('/api/slides?active=true&annee=courante').then(r => r.json())
```

---

### PHASE 5 — Événements Dynamiques
**Durée estimée : 3–4 jours**

#### 5.1 — API Events
- `GET /api/evenements` — liste avec filtres (type, statut, annee_pastorale_id, date)
- `GET /api/evenements/[slug]` — détail public d'un événement
- `POST /api/evenements` — créer (admin)
- `PUT /api/evenements/[id]` — modifier
- `DELETE /api/evenements/[id]` — supprimer
- `POST /api/evenements/[id]/photos` — ajouter des photos (multipart/form-data)
- `DELETE /api/evenements/[id]/photos/[photoId]` — supprimer une photo
- `GET /api/evenements/[id]/qrcode` — obtenir/régénérer le QR code

#### 5.2 — Page de détail public
**Fichier à créer :** `app/evenements/[slug]/page.tsx`

Contenu :
- Photos en galerie
- Description complète
- Date, lieu, prix
- Bouton réservation / inscription
- Bouton partage (WhatsApp, Facebook, Instagram, copier le lien)
- QR Code affiché en bas de page
- Événements similaires suggérés

#### 5.3 — Formulaire de création/modification Admin
**Fichier à créer :** `app/admin/(dashboard)/evenements/nouveau/page.tsx`
**Fichier à créer :** `app/admin/(dashboard)/evenements/[id]/modifier/page.tsx`

Champs :
- Titre, slug auto-généré (modifiable), type, statut
- Description courte + description longue (éditeur riche simple)
- Date début / Date fin, lieu, adresse
- Prix (0 = gratuit), capacité
- Upload image de couverture
- Upload multiple de photos (galerie)
- Emoji icône + gradient de couleur
- Description de partage QR Code
- Année pastorale associée

#### 5.4 — Filtres avancés [activities-section.tsx](components/home/activities-section.tsx)
Nouveau système de filtres :
- **Par statut** : À venir / Passés / Tous
- **Par type** : Spirituel / Formation / Social / Culturel / Gala
- **Par mois** : Sélecteur mensuel
- **Par année pastorale** : Dropdown
- Filtres persistés dans l'URL (`?type=spirituel&annee=2024-2025`) pour partage

---

### PHASE 6 — QR Code par Événement
**Durée estimée : 1 jour**

#### 6.1 — Génération automatique (`lib/qrcode.ts`)

```typescript
import QRCode from 'qrcode'

export async function genererQRCode(evenementId: number, slug: string): Promise<string> {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/evenements/${slug}`
  const outputPath = `public/uploads/qrcodes/event-${evenementId}.png`
  await QRCode.toFile(outputPath, url, {
    width: 400,
    margin: 2,
    color: { dark: '#1a2a6c', light: '#ffffff' }
  })
  return `/uploads/qrcodes/event-${evenementId}.png`
}
```

QR Code généré automatiquement à la **publication** d'un événement.

#### 6.2 — Partage social depuis le Dashboard Admin
Dans la fiche événement admin, bouton "Partager" qui ouvre une modal avec :
- Aperçu du QR Code (téléchargeable en PNG)
- Texte de partage personnalisable (champ `qr_description_partage`)
- Boutons de partage pré-formatés :
  - **WhatsApp** : `https://wa.me/?text=[description]%0A[lien]`
  - **Facebook** : `https://www.facebook.com/sharer/sharer.php?u=[lien]`
  - **Instagram** : copie dans le presse-papier (Instagram Stories ne supporte pas les liens directs)
  - **Copier le lien** : avec confirmation visuelle

#### 6.3 — Redirection QR Code
Quand on scanne le QR, on atterrit sur `/evenements/[slug]` qui est une page publique avec tous les détails + bouton d'inscription.

---

### PHASE 7 — Bureau Dynamique
**Durée estimée : 1–2 jours**

#### 7.1 — API
- `GET /api/bureau` — membres du bureau actifs de l'année en cours
- `GET /api/bureau?annee=[id]` — membres d'une année spécifique
- `POST /api/bureau` — ajouter un membre (admin)
- `PUT /api/bureau/[id]` — modifier
- `DELETE /api/bureau/[id]` — retirer
- `PUT /api/bureau/reorder` — réordonner l'affichage

#### 7.2 — Page Admin
**Fichier à créer :** `app/admin/(dashboard)/bureau/page.tsx`

Fonctionnalités :
- Formulaire complet : nom, prénom, poste, commission, photo, bio
- Contacts : email, téléphone, WhatsApp, Instagram, Facebook
- Réorganisation par drag & drop (ordre d'affichage)
- Filtre par année pastorale pour voir l'historique des bureaux

#### 7.3 — Mise à jour [bureau-section.tsx](components/home/bureau-section.tsx)
Server Component fetchant depuis `/api/bureau?actif=true`

---

### PHASE 8 — Objectifs & Thème Dynamiques
**Durée estimée : 1 jour**

#### 8.1 — API
- `GET /api/objectifs` — objectifs de l'année courante
- `POST /api/objectifs` — créer (admin)
- `PUT /api/objectifs/[id]` — modifier
- `DELETE /api/objectifs/[id]` — supprimer
- `PUT /api/objectifs/reorder` — réordonner

#### 8.2 — Mise à jour [objectives-section.tsx](components/home/objectives-section.tsx)
- Affichage dynamique des objectifs depuis la DB
- Affichage du **thème de l'année pastorale** en sous-titre de la section

---

### PHASE 9 — Réservations & Inscriptions
**Durée estimée : 2 jours**

#### 9.1 — API
- `POST /api/reservations` — créer une réservation
- `GET /api/reservations` — liste (admin, filtrable)
- `PUT /api/reservations/[id]/confirmer` — confirmer
- `PUT /api/reservations/[id]/annuler` — annuler
- `GET /api/reservations/[code]` — vérifier par code

#### 9.2 — Logique métier
- Génération code unique : `OPPJ-[ANNEE]-[6 chars aléatoires]` ex: `OPPJ-2025-X7K3M2`
- Vérification de la capacité avant confirmation
- Email automatique de confirmation avec le code
- Décrémentation automatique des places disponibles

#### 9.3 — Page Réservation publique
Mettre à jour [app/reservation/[id]/page.tsx](app/reservation/[id]/page.tsx) :
- Fetch les détails de l'événement
- Formulaire d'inscription (membres = pré-rempli, visiteurs = formulaire complet)
- Affichage du prix, des places restantes
- Confirmation avec affichage du code de réservation

---

### PHASE 10 — Annonces
**Durée estimée : 1–2 jours**

#### 10.1 — API
- `GET /api/annonces` — annonces publiées, non expirées
- `POST /api/annonces` — créer (admin)
- `PUT /api/annonces/[id]` — modifier
- `DELETE /api/annonces/[id]` — supprimer/archiver

#### 10.2 — Page Admin
**Fichier à créer :** `app/admin/(dashboard)/annonces/page.tsx`

Formulaire :
- Titre, contenu, type (urgent/info/événement/communauté)
- Image optionnelle + lien d'action optionnel
- Date d'expiration (après laquelle l'annonce disparaît automatiquement)
- Statut : brouillon / publiée

#### 10.3 — Section Annonces sur le site public

**Option A — Bannière en haut du site**
Ticker défilant discret sous le header pour les annonces `urgentes`.

**Option B — Section dédiée**
**Fichier à créer :** `components/home/annonces-section.tsx`

Cards d'annonces avec badge de type coloré, description, lien CTA optionnel.
Intégrer dans [app/page.tsx](app/page.tsx) entre `StatsBand` et `ObjectivesSection`.

---

### PHASE 11 — Newsletter
**Durée estimée : 1–2 jours**

#### 11.1 — API
- `POST /api/newsletter/subscribe` — inscription avec double opt-in
- `GET /api/newsletter/confirm/[token]` — confirmation email
- `DELETE /api/newsletter/unsubscribe/[token]` — désinscription
- `GET /api/newsletter/abonnes` — liste (admin)
- `POST /api/newsletter/envoyer` — envoyer une newsletter (admin)

#### 11.2 — Double opt-in
1. L'utilisateur soumet son email dans le formulaire
2. Un email de confirmation est envoyé avec un lien unique (`/api/newsletter/confirm/[token]`)
3. Il clique, son statut passe de `en_attente` à `abonne`
4. Email de bienvenue envoyé

#### 11.3 — Envoi de newsletter (Admin)
**Fichier à créer :** `app/admin/(dashboard)/newsletter/page.tsx`

Fonctionnalités :
- Composer un email (titre + corps HTML simplifié)
- Prévisualisation
- Envoi aux abonnés confirmés
- Statistiques (nombre d'abonnés actifs)

#### 11.4 — Formulaire dans le footer
Intégrer un champ d'abonnement dans [components/layout/footer.tsx](components/layout/footer.tsx)

---

### PHASE 12 — Notifications
**Durée estimée : 1–2 jours**

#### 12.1 — API
- `GET /api/notifications` — notifications de l'utilisateur connecté
- `PUT /api/notifications/[id]/lire` — marquer comme lue
- `PUT /api/notifications/lire-tout` — marquer tout comme lu
- `POST /api/notifications` — créer (admin)
- `GET /api/notifications/stream` — Server-Sent Events (temps réel)

#### 12.2 — Déclencheurs automatiques

| Action | Notification générée |
|--------|---------------------|
| Réservation créée | "Votre réservation OPPJ-2025-X7K3M2 est en attente" |
| Réservation confirmée | "Votre place pour [Événement] est confirmée !" |
| Nouvel événement publié | "Nouvel événement : [Titre]" → tous les membres |
| Annonce urgente créée | "Annonce importante de l'OPPJ" → tous |
| Nouvelle annonce pastorale | "L'année [libellé] a commencé !" |

#### 12.3 — Cloche de notifications dans le header
Icône cloche dans `Header` (membres connectés) et dans le sidebar admin avec compteur de non-lues.

---

### PHASE 13 — Stats Band Dynamique
**Durée estimée : 0.5 jour**

Remplacer les valeurs statiques de [stats-band.tsx](components/home/stats-band.tsx) par des valeurs calculées depuis la DB :

- **Membres actifs** → `COUNT(*) FROM utilisateurs WHERE statut = 'actif'`
- **Événements par an** → `COUNT(*) FROM evenements WHERE annee_pastorale_id = [active]`
- **Ans d'existence** → calculé depuis la date de fondation
- **Commissions** → valeur configurable dans les paramètres

---

### PHASE 14 — Navigation du Dashboard Admin
**Durée estimée : 0.5 jour**

Mettre à jour [app/admin/(dashboard)/layout.tsx](app/admin/(dashboard)/layout.tsx) avec les nouveaux items de navigation :

```typescript
const navItems = [
  { href: "/admin",                    label: "Tableau de bord",   icon: LayoutDashboard },
  { href: "/admin/annee-pastorale",    label: "Année Pastorale",   icon: BookOpen },
  { href: "/admin/evenements",         label: "Événements",        icon: Calendar },
  { href: "/admin/bureau",             label: "Bureau",            icon: Users },
  { href: "/admin/slides",             label: "Slides Accueil",    icon: ImageIcon },
  { href: "/admin/objectifs",          label: "Objectifs",         icon: Target },
  { href: "/admin/annonces",           label: "Annonces",          icon: Megaphone },
  { href: "/admin/reservations",       label: "Réservations",      icon: Ticket },
  { href: "/admin/membres",            label: "Membres",           icon: UserCheck },
  { href: "/admin/newsletter",         label: "Newsletter",        icon: Mail },
  { href: "/admin/notifications",      label: "Notifications",     icon: Bell },
  { href: "/admin/parametres",         label: "Paramètres",        icon: Settings },
]
```

---

## Ordre de Développement Recommandé

```
Semaine 1
├── Phase 1  — Infrastructure & DB
├── Phase 2  — Authentification
└── Phase 3  — Année Pastorale

Semaine 2
├── Phase 5  — Événements (core)
├── Phase 6  — QR Code
└── Phase 9  — Réservations

Semaine 3
├── Phase 4  — Slides Carousel
├── Phase 7  — Bureau
└── Phase 8  — Objectifs

Semaine 4
├── Phase 10 — Annonces
├── Phase 11 — Newsletter
└── Phase 12 — Notifications

Semaine 5
├── Phase 13 — Stats Dynamiques
├── Phase 14 — Navigation Admin
└── Tests, QA, Déploiement
```

---

## Variables d'Environnement (`.env.local`)

```env
# Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# JWT
JWT_SECRET=votre_secret_jwt_tres_long_et_aleatoire
JWT_EXPIRES_IN=7d

# Email (Nodemailer — Gmail ou SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=oppj.sacresstgmates@gmail.com
SMTP_PASS=votre_app_password_gmail
EMAIL_FROM="OPPJ Sacrés Stigmates <oppj.sacresstgmates@gmail.com>"

# Upload
UPLOAD_MAX_SIZE_MB=5
```

---

## Points d'Attention & Bonnes Pratiques

### Sécurité
- Ne jamais exposer `JWT_SECRET` côté client
- Valider **toutes** les entrées avec Zod dans les API Routes
- Vérifier le rôle dans chaque API Route admin (`requireAdmin()`)
- Sanitiser les slugs d'événements (supprimer les caractères spéciaux)
- Limiter la taille des uploads (max 5MB par image)

### Performance
- Utiliser les **Server Components** pour les sections publiques (SEO + cache)
- Mettre en cache les données statiques (slides, objectifs) avec `next/cache`
- Comprimer les images à l'upload avec `sharp` (WebP, max 1200px)
- Indexer les colonnes fréquemment filtrées : `annee_pastorale_id`, `statut`, `slug`

### UX Mobile
- Formulaires admin responsives (les admins peuvent saisir depuis mobile)
- QR Code partageable via l'API Web Share native sur mobile
- Galerie photos en swipe sur mobile

### Gestion des Fichiers
- Nommer les fichiers uploadés avec UUID pour éviter les conflits
- Supprimer les anciennes images lors du remplacement (ne pas laisser de fichiers orphelins)
- Créer les dossiers `public/uploads/` au premier démarrage si inexistants

---

## Améliorations Apportées aux Idées Originales

| Idée originale | Amélioration proposée |
|----------------|----------------------|
| QR Code simple | QR Code stylisé aux couleurs OPPJ + description de partage personnalisable par événement + Web Share API pour mobile |
| Newsletter basique | Double opt-in (confirmation email) pour éviter les faux abonnés |
| Notifications simples | Server-Sent Events pour les notifications temps réel sans rechargement |
| Annonces dans le dashboard | Deux modes : bannière ticker pour les urgentes + section cards pour les autres |
| Filtres d'activités | Filtres persistés dans l'URL pour permettre le partage de listes filtrées |
| Photos événements | Upload multiple avec compression automatique, galerie ordonnée |
| Stats dynamiques | Calculées automatiquement depuis la DB, pas de saisie manuelle |
| Bureau avec photos | Ajout des réseaux sociaux (Instagram, WhatsApp, Facebook) par membre |
| Réservations | Code de réservation unique + email de confirmation automatique |
| Année pastorale | Une seule "active" à la fois + archivage automatique + sélecteur global dans le dashboard |

---

*Projet OPPJ — Paroisse Sacrés Stigmates, Abidjan, Côte d'Ivoire*
*Stack : Next.js 16 · Drizzle ORM · SQLite · Tailwind CSS · shadcn/ui*
