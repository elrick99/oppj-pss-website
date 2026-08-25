/**
 * @deprecated Script historique, conservé pour référence uniquement.
 * Les tables qu'il crée font désormais partie de la migration Drizzle
 * formelle db/migrations/0000_baseline_schema.sql (générée depuis db/schema.ts),
 * y compris la contrainte UNIQUE(question_id, utilisateur_id) sur sondage_votes.
 * Ne pas ré-exécuter : utiliser `pnpm drizzle-kit migrate` sur une base neuve.
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

db.transaction(() => {
  if (!tableExists('sondages')) {
    db.exec(`CREATE TABLE sondages (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      titre TEXT NOT NULL,
      description TEXT,
      slug TEXT UNIQUE NOT NULL,
      date_debut TEXT NOT NULL,
      date_fin TEXT NOT NULL,
      statut TEXT DEFAULT 'brouillon',
      qr_code_url TEXT,
      annee_pastorale_id INTEGER REFERENCES annee_pastorale(id),
      created_by INTEGER REFERENCES utilisateurs(id),
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )`)
    console.log('✓ Table sondages créée')
  } else {
    console.log('— Table sondages déjà existante')
  }

  if (!tableExists('sondage_questions')) {
    db.exec(`CREATE TABLE sondage_questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      sondage_id INTEGER NOT NULL REFERENCES sondages(id) ON DELETE CASCADE,
      texte TEXT NOT NULL,
      ordre INTEGER DEFAULT 0
    )`)
    console.log('✓ Table sondage_questions créée')
  } else {
    console.log('— Table sondage_questions déjà existante')
  }

  if (!tableExists('sondage_options')) {
    db.exec(`CREATE TABLE sondage_options (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      question_id INTEGER NOT NULL REFERENCES sondage_questions(id) ON DELETE CASCADE,
      texte TEXT NOT NULL,
      ordre INTEGER DEFAULT 0
    )`)
    console.log('✓ Table sondage_options créée')
  } else {
    console.log('— Table sondage_options déjà existante')
  }

  if (!tableExists('sondage_votes')) {
    db.exec(`CREATE TABLE sondage_votes (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      sondage_id INTEGER NOT NULL REFERENCES sondages(id) ON DELETE CASCADE,
      question_id INTEGER NOT NULL REFERENCES sondage_questions(id) ON DELETE CASCADE,
      option_id INTEGER NOT NULL REFERENCES sondage_options(id) ON DELETE CASCADE,
      utilisateur_id INTEGER NOT NULL REFERENCES utilisateurs(id) ON DELETE CASCADE,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(question_id, utilisateur_id)
    )`)
    console.log('✓ Table sondage_votes créée')
  } else {
    console.log('— Table sondage_votes déjà existante')
  }
})()

console.log('\n✅ Migration sondages terminée.')
db.close()
