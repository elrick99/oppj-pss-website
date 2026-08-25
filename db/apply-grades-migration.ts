/**
 * @deprecated Script historique, conservé pour référence uniquement.
 * Les tables qu'il crée font désormais partie de la migration Drizzle
 * formelle db/migrations/0000_baseline_schema.sql (générée depuis db/schema.ts).
 * Ne pas ré-exécuter : utiliser `pnpm drizzle-kit migrate` sur une base neuve.
 *
 * Script one-shot : ajoute les tables grades, categories_points, regles_points,
 * historique_points et les colonnes points_total + grade_id sur utilisateurs.
 * Idempotent : vérifie l'existence avant de créer.
 */
import Database from 'better-sqlite3'
import path from 'path'

const db = new Database(path.join(process.cwd(), 'oppj_database.db'))
db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

function tableExists(name: string): boolean {
  const row = db.prepare(`SELECT name FROM sqlite_master WHERE type='table' AND name=?`).get(name)
  return !!row
}

function columnExists(table: string, col: string): boolean {
  const info = db.prepare(`PRAGMA table_info(${table})`).all() as { name: string }[]
  return info.some(c => c.name === col)
}

db.transaction(() => {
  if (!tableExists('grades')) {
    db.exec(`CREATE TABLE grades (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      nom TEXT NOT NULL,
      description TEXT,
      points_min INTEGER NOT NULL DEFAULT 0,
      couleur TEXT DEFAULT '#1A3A8F',
      icone TEXT DEFAULT '⭐',
      ordre INTEGER DEFAULT 0,
      actif INTEGER DEFAULT true,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )`)
    console.log('✓ Table grades créée')
  } else {
    console.log('— Table grades déjà existante')
  }

  if (!tableExists('categories_points')) {
    db.exec(`CREATE TABLE categories_points (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      nom TEXT NOT NULL,
      description TEXT,
      icone TEXT DEFAULT '📋',
      ordre INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )`)
    console.log('✓ Table categories_points créée')
  } else {
    console.log('— Table categories_points déjà existante')
  }

  if (!tableExists('regles_points')) {
    db.exec(`CREATE TABLE regles_points (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      categorie_id INTEGER REFERENCES categories_points(id) ON DELETE CASCADE,
      libelle TEXT NOT NULL,
      description TEXT,
      points INTEGER NOT NULL DEFAULT 0,
      type TEXT NOT NULL DEFAULT 'manuel',
      actif INTEGER DEFAULT true,
      ordre INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )`)
    console.log('✓ Table regles_points créée')
  } else {
    console.log('— Table regles_points déjà existante')
  }

  if (!tableExists('historique_points')) {
    db.exec(`CREATE TABLE historique_points (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      utilisateur_id INTEGER NOT NULL REFERENCES utilisateurs(id) ON DELETE CASCADE,
      regle_id INTEGER REFERENCES regles_points(id) ON DELETE SET NULL,
      regle_libelle TEXT NOT NULL,
      points INTEGER NOT NULL,
      reference_type TEXT,
      reference_id INTEGER,
      note TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )`)
    console.log('✓ Table historique_points créée')
  } else {
    console.log('— Table historique_points déjà existante')
  }

  if (!columnExists('utilisateurs', 'points_total')) {
    db.exec(`ALTER TABLE utilisateurs ADD COLUMN points_total INTEGER DEFAULT 0`)
    console.log('✓ Colonne utilisateurs.points_total ajoutée')
  } else {
    console.log('— Colonne points_total déjà existante')
  }

  if (!columnExists('utilisateurs', 'grade_id')) {
    db.exec(`ALTER TABLE utilisateurs ADD COLUMN grade_id INTEGER`)
    console.log('✓ Colonne utilisateurs.grade_id ajoutée')
  } else {
    console.log('— Colonne grade_id déjà existante')
  }
})()

console.log('\n✅ Migration terminée.')
db.close()
