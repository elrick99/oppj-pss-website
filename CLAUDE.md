# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
pnpm dev               # Start Next.js dev server
pnpm build             # Production build
pnpm lint              # ESLint check
pnpm lint:fix          # ESLint auto-fix
pnpm type-check        # TypeScript check (no emit)

# Database
pnpm drizzle-kit generate   # Generate migration from schema changes
pnpm drizzle-kit migrate    # Apply pending migrations to oppj_database.db
pnpm db:seed                # Seed the database (tsx db/seed.ts)
pnpm db:studio              # Open Drizzle Studio (visual DB browser)
```

There are no automated tests in this project.

## Environment Variables

Required in `.env.local`:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
JWT_SECRET=...
JWT_EXPIRES_IN=7d
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=...
MAIL_PASSWORD=...
MAIL_FROM_NAME=OPPJ Sacrés Stigmates
MAIL_FROM_ADDRESS=noreply@oppj.ci
UPLOAD_MAX_SIZE_MB=5
```

## Architecture

**OPPJ Jeunesse** — plateforme fullstack de l'Office Paroissial de la Pastorale des Jeunes, Paroisse Sacrés Stigmates d'Abidjan. Stack: Next.js 16 App Router · SQLite (`better-sqlite3`) · Drizzle ORM · JWT auth · Tailwind CSS · shadcn/ui.

### Route Groups

```
app/
├── (auth)/               # Connexion, inscription, reset mot de passe (public, no layout)
├── admin/(dashboard)/    # Dashboard admin protégé (role: admin)
│   └── [annee-pastorale|evenements|bureau|slides|objectifs|annonces|reservations|membres|mouvements|newsletter|notifications|statistiques|parametres]/
├── membre/(dashboard)/   # Espace membre protégé (role: membre)
│   └── [activites|carte|profil]/
├── carte/[memberId]/     # Page publique de vérification de carte membre (sans auth)
├── evenements/[slug]/    # Pages publiques événements
├── reservation/          # Formulaire réservation public
└── api/                  # Route Handlers (voir section API)
```

**Absence de middleware.ts** : la protection des routes est faite manuellement dans chaque Route Handler via `requireAuth(req)` ou `requireAdmin(req)` depuis `lib/auth.ts`. Les pages admin/membre font leur propre redirection côté client.

### Authentification

`lib/auth.ts` expose :
- `requireAuth(req)` → `JwtPayload | null` (userId, email, role) — utilisé dans tous les Route Handlers protégés
- `requireAdmin(req)` → idem mais vérifie `role === 'admin'`
- `getSession()` → pour les Server Components (lit le cookie via `next/headers`)

Le token JWT est stocké dans un cookie httpOnly `oppj-token`. L'état côté client est géré par `lib/auth-context.tsx` (`useAuth()` hook, `AuthProvider` dans `components/layout/providers.tsx`).

### Base de données

- Fichier SQLite : `oppj_database.db` à la racine du projet
- Connexion : `db/index.ts` → `export const db` (Drizzle instance, WAL mode activé)
- Schéma : `db/schema.ts` — toutes les tables et leurs types exportés
- Import pattern : `import { db } from '@/db'` + `import { tableName } from '@/db/schema'`

**Table pivot** : `annee_pastorale` — presque toutes les autres tables ont une FK `annee_pastorale_id`. Une seule année a `active = true` à la fois. Les filtres admin sont généralement scopés à l'année active.

**Valeurs de `statut` pour `utilisateurs`** : `'actif'` | `'inactif'` | `'suspendu'` | `'en_attente'`
**Valeurs de `statut` pour `evenements`** : `'brouillon'` | `'publie'` | `'annule'` | `'passe'`
**Valeurs de `statut` pour `reservations_inscriptions`** : `'en_attente'` | `'confirme'` | `'annule'` | `'rembourse'`

### API Routes

Toutes sous `app/api/`. Pattern standard d'un Route Handler :

```ts
import { requireAuth } from '@/lib/auth'  // ou requireAdmin
import { db } from '@/db'
import { maTable } from '@/db/schema'

export async function GET(req: NextRequest) {
  const auth = requireAuth(req)
  if (!auth) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  // ...
}
```

Routes publiques notables :
- `GET /api/public/membre/[memberId]` — info publique d'un membre par son ID `OPPJ-YYYY-XXXX`
- `GET /api/membre/carte-qr` — génère le QR code de la carte membre (auth requise)

### Utilitaires (`lib/`)

| Fichier | Rôle |
|---|---|
| `auth.ts` | JWT sign/verify, hash bcrypt, requireAuth/requireAdmin |
| `auth-context.tsx` | AuthProvider + useAuth() hook client |
| `upload.ts` | `saveUploadedFile(file, folder)` → compresse en WebP via sharp, sauvegarde dans `public/uploads/[folder]/` |
| `email.ts` | Nodemailer — fonctions d'envoi typées (confirmation réservation, reset mdp, etc.) |
| `qrcode.ts` | `genererQRCode(evenementId, slug)` → génère PNG dans `public/uploads/qrcodes/` |
| `rate-limit.ts` | `rateLimit(key, {windowMs, max})` — store in-memory Map, pour protéger les API publiques |
| `csrf.ts` | `validateOrigin(req)` — compare Origin/Referer à `NEXT_PUBLIC_APP_URL` (bypassed en dev) |
| `format.ts` | `formatInitials(prenom, nom)` et autres helpers de formatage |

### Uploads de fichiers

- Dossier : `public/uploads/[evenements|bureau|slides|qrcodes|mouvements]/`
- Toutes les images sont converties en WebP (quality 85, max 1200×1200) à l'upload
- Les noms de fichiers sont des UUID : `{uuid}.webp`
- Route d'upload : `POST /api/upload` avec `multipart/form-data`, champ `file` + param `?folder=`

### Tailwind — Couleurs personnalisées

```
royal          #1A3A8F  (bleu OPPJ principal)
royal-dark     #0F2260
royal-light    #2451B8
royal-pale     rgba(26, 58, 143, 0.06)
gold           #D4A520
gold-light     #F0C84A
off-white      #F8F7F3
footer         #080F2A
```

Polices : `font-sans` (DM Sans) · `font-serif` (Playfair Display)

### ID Membre

Format : `OPPJ-{ANNÉE}-{userId padStart(4, '0')}` — ex: `OPPJ-2026-0001`.
Généré dynamiquement (pas stocké en DB). La page publique `/carte/[memberId]` parse ce format pour retrouver l'utilisateur.

### Notifications temps réel

SSE (Server-Sent Events) sur `GET /api/notifications/stream`. Le panneau `components/layout/notifications-panel.tsx` s'y connecte côté client.
