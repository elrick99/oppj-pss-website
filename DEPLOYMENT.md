# Déploiement — OPPJ Jeunesse (VPS)

Déploiement manuel sur VPS via PM2 + Nginx, sur le modèle du pattern `releases/` +
`current` déjà utilisé pour Codershap. Domaine cible : `oppj-pss.codershap.com`.

## Différences importantes par rapport à Codershap

Codershap utilise Supabase (base externe) : `cp -r repo/. releases/$TIMESTAMP/`
suffit, rien à préserver entre releases à part `.env`.

OPPJ utilise **SQLite en fichier local** (`better-sqlite3`) et des **uploads sur
disque** (`public/uploads/`). Ces deux éléments doivent vivre dans `shared/` et
être **symlinkés dans chaque release** (pas seulement dans `current/`) — sinon
chaque nouveau déploiement écraserait la base de données et les fichiers
uploadés avec le contenu du repo Git.

> Le code (`db/index.ts`, `drizzle.config.ts`) résout toujours le chemin de la
> base comme `<cwd>/oppj_database.db`, et Node résout `process.cwd()` en chemin
> réel (pas le chemin du symlink `current`). Le symlink doit donc être créé à
> l'intérieur de `releases/$TIMESTAMP/`, pas seulement pointé depuis `current`.

Le repo a été nettoyé pour ce déploiement :
- `oppj_database.db` / `-shm` / `-wal` ne sont plus versionnés (untracked, ajoutés au `.gitignore`)
- `public/uploads/**` n'est plus versionné
- `ecosystem.config.js` (PM2) ajouté à la racine
- le workflow `cd.yml` (déploiement Vercel) a été supprimé — `ci.yml` (lint/type-check/build) reste actif sur les PR

**Avant de pousser ces changements**, vérifie qu'aucune autre release/fork de ce
repo ne dépend encore du fichier `.db` versionné.

---

## 1. Mise en place initiale (une seule fois)

### 1.1 Arborescence du projet

```bash
su - apps
mkdir -p /var/www/projects/oppj-pss/{releases,shared/uploads}
mkdir -p /var/www/projects/oppj-pss/shared/uploads/{evenements,bureau,slides,qrcodes,mouvements}
cd /var/www/projects/oppj-pss
git clone <URL_DU_REPO> repo
cd repo
git checkout main
```

### 1.2 Fichier `.env` partagé

```bash
cp /var/www/projects/oppj-pss/repo/.env.example /var/www/projects/oppj-pss/shared/.env
nano /var/www/projects/oppj-pss/shared/.env
```

Renseigne au minimum : `JWT_SECRET` (long secret aléatoire, ex. `openssl rand -hex 32`),
les identifiants SMTP réels, et :

```env
NEXT_PUBLIC_APP_URL=https://oppj-pss.codershap.com
NEXT_PUBLIC_APP_NAME=OPPJ
```

> `JWT_SECRET` et `MAIL_PASSWORD` sont sensibles : ne les mets jamais dans le
> repo Git, uniquement dans `shared/.env`.

### 1.3 Première release

```bash
cd /var/www/projects/oppj-pss
TIMESTAMP=$(date +%Y%m%d%H%M%S)
mkdir -p releases/$TIMESTAMP
cp -r repo/. releases/$TIMESTAMP/

# Liens vers les ressources partagées (persistantes entre releases)
ln -sfn /var/www/projects/oppj-pss/shared/.env releases/$TIMESTAMP/.env
ln -sfn /var/www/projects/oppj-pss/shared/uploads releases/$TIMESTAMP/public/uploads
ln -sfn /var/www/projects/oppj-pss/shared/oppj_database.db releases/$TIMESTAMP/oppj_database.db
ln -sfn /var/www/projects/oppj-pss/shared/oppj_database.db-shm releases/$TIMESTAMP/oppj_database.db-shm
ln -sfn /var/www/projects/oppj-pss/shared/oppj_database.db-wal releases/$TIMESTAMP/oppj_database.db-wal

cd releases/$TIMESTAMP
pnpm install --frozen-lockfile

# Crée le schéma dans la base partagée (vide au départ — le fichier
# oppj_database.db sera créé par better-sqlite3 au premier accès)
pnpm drizzle-kit migrate

pnpm build
```

> `pnpm drizzle-kit migrate` applique `db/migrations/0000_baseline_schema.sql`
> (schéma complet, généré depuis `db/schema.ts`). Ne lance **pas** `pnpm db:seed`
> en production : ce script insère des données de démo/fixtures de dev, pas un
> jeu de données prod. Crée ton premier compte admin via `/inscription`, puis
> passe son `role` à `admin` directement en base (`pnpm db:studio` ou `sqlite3`).

```bash
cd /var/www/projects/oppj-pss
ln -sfn releases/$TIMESTAMP current
cd current
pm2 start ecosystem.config.js
pm2 save
pm2 startup   # si PM2 n'est pas encore configuré pour démarrer au boot du VPS
```

### 1.4 Nginx

Choisis un port libre pour cette app (le `ecosystem.config.js` du repo utilise
`3010` par défaut — vérifie qu'il n'entre pas en conflit avec un autre projet
déjà déployé sur ce VPS, ex. `ss -ltnp | grep node` ou `pm2 list`, et ajuste
`PORT` dans `ecosystem.config.js` si besoin).

`/etc/nginx/sites-available/oppj-pss` (convention du VPS : nom court, pas le domaine complet — voir `codershap`, `explore-ci`) :

```nginx
server {
    listen 80;
    server_name oppj-pss.codershap.com;

    access_log /var/www/logs/oppj-pss-access.log;
    error_log /var/www/logs/oppj-pss-error.log;

    client_max_body_size 10M;  # marge au-dessus de UPLOAD_MAX_SIZE_MB (5 Mo)

    # SSE — /api/notifications/stream doit rester en streaming (pas de buffering,
    # pas de timeout court), sinon les notifications temps réel ne fonctionnent pas.
    location /api/notifications/stream {
        proxy_pass http://127.0.0.1:3010;
        proxy_http_version 1.1;
        proxy_set_header Connection '';
        proxy_buffering off;
        proxy_cache off;
        proxy_read_timeout 24h;
        chunked_transfer_encoding off;
    }

    location / {
        proxy_pass http://127.0.0.1:3010;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -sfn /etc/nginx/sites-available/oppj-pss /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
sudo certbot --nginx -d oppj-pss.codershap.com
```

> Ports déjà occupés sur ce VPS : `codershap` → 3000, `explore-ci` → 3001. `3010` (choisi pour OPPJ) est libre.

### 1.5 Permissions

```bash
sudo chown -R apps:www-data /var/www/projects/oppj-pss
sudo chmod -R 2775 /var/www/projects/oppj-pss
```

---

## 2. Mise à jour (déploiements suivants)

```bash
su - apps
cd /var/www/projects/oppj-pss/repo
git pull origin main

cd /var/www/projects/oppj-pss
TIMESTAMP=$(date +%Y%m%d%H%M%S)
mkdir -p releases/$TIMESTAMP
cp -r repo/. releases/$TIMESTAMP/

ln -sfn /var/www/projects/oppj-pss/shared/.env releases/$TIMESTAMP/.env
ln -sfn /var/www/projects/oppj-pss/shared/uploads releases/$TIMESTAMP/public/uploads
ln -sfn /var/www/projects/oppj-pss/shared/oppj_database.db releases/$TIMESTAMP/oppj_database.db
ln -sfn /var/www/projects/oppj-pss/shared/oppj_database.db-shm releases/$TIMESTAMP/oppj_database.db-shm
ln -sfn /var/www/projects/oppj-pss/shared/oppj_database.db-wal releases/$TIMESTAMP/oppj_database.db-wal

cd releases/$TIMESTAMP
pnpm install --frozen-lockfile

# Applique les migrations en attente (no-op si le schéma est déjà à jour)
pnpm drizzle-kit migrate

pnpm build
```

```bash
cd /var/www/projects/oppj-pss
ln -sfn releases/$TIMESTAMP current
cd current
pm2 delete oppj-pss
pm2 start ecosystem.config.js
pm2 save
```

> `pm2 delete` + `pm2 start` (plutôt que `pm2 restart`) pour forcer PM2 à
> repartir du nouveau `cwd` — indispensable ici puisque chaque release est un
> dossier différent (contrairement à un simple restart de process en place).

```bash
pm2 status
pm2 logs oppj-pss --lines 30
```

```bash
sudo chown -R apps:www-data /var/www/projects/oppj-pss
sudo chmod -R 2775 /var/www/projects/oppj-pss
```

Teste sur https://oppj-pss.codershap.com

### Nettoyage des anciennes releases

```bash
cd /var/www/projects/oppj-pss/releases
ls -t | tail -n +6 | xargs -r rm -rf
```

## 3. Rollback rapide

```bash
ls -la /var/www/projects/oppj-pss/releases
cd /var/www/projects/oppj-pss
ln -sfn releases/ANCIEN_TIMESTAMP current
cd current
pm2 delete oppj-pss
pm2 start ecosystem.config.js
pm2 save
```

> Un rollback ne fait pas de rollback de schéma DB. Si la release en échec a
> appliqué une migration Drizzle qui casse les releases précédentes, il faut
> gérer ça manuellement (restaurer un backup de `shared/oppj_database.db`).

## 4. Sauvegarde de la base

Le fichier `shared/oppj_database.db` est la seule copie des données de
production. Mets en place un backup régulier avant chaque déploiement au
minimum :

```bash
cp /var/www/projects/oppj-pss/shared/oppj_database.db \
   /var/www/projects/oppj-pss/shared/backups/oppj_database.db.$(date +%Y%m%d%H%M%S)
```

(idéalement via un cron quotidien + rotation, et une copie hors du VPS).

## Différences clés face à Codershap

| | Codershap (Supabase) | OPPJ (SQLite local) |
|---|---|---|
| Build | `npm install && npm run build` | `pnpm install --frozen-lockfile && pnpm build` |
| Données persistantes | Aucune (Supabase externe) | `shared/oppj_database.db` + `shared/uploads/` — symlinks **dans chaque release** |
| Migrations | N/A | `pnpm drizzle-kit migrate` à chaque déploiement |
| Process manager | PM2 (`pm2 start npm --name ...`) | PM2 via `ecosystem.config.js` versionné dans le repo |
| SSE | N/A | `/api/notifications/stream` a besoin de `proxy_buffering off` côté Nginx |
| Backup | Géré par Supabase | À la charge du VPS — voir §4 |
