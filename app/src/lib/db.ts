import Database from 'better-sqlite3';
import path from 'path';

let dbInstance: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!dbInstance) {
    const dbPath = path.resolve(process.cwd(), 'blushe.db');
    dbInstance = new Database(dbPath);
    dbInstance.pragma('journal_mode = WAL');
    initSchema(dbInstance);
  }
  return dbInstance;
}

export function initSchema(db: Database.Database) {
  db.exec(`
    -- 1. Brands
    CREATE TABLE IF NOT EXISTS brands (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      website_url TEXT,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- 2. Products
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      brand_id INTEGER NOT NULL,
      product_name TEXT NOT NULL,
      description TEXT,
      product_url TEXT,
      image_url TEXT,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE CASCADE
    );

    -- 3. Product Shades (Decision Alternatives)
    CREATE TABLE IF NOT EXISTS product_shades (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      shade_name TEXT NOT NULL,
      shade_description TEXT,
      formula TEXT NOT NULL CHECK(formula IN ('Powder', 'Liquid', 'Cream', 'Stick', 'Other')),
      color_family TEXT NOT NULL,
      color_hex TEXT NOT NULL,
      price_idr INTEGER NOT NULL,
      tone_depth TEXT DEFAULT 'Medium',
      undertone_bias TEXT DEFAULT 'Neutral',
      price_source_url TEXT,
      price_checked_at DATE,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );

    -- 4. Criteria
    CREATE TABLE IF NOT EXISTS criteria (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      description TEXT,
      type TEXT NOT NULL CHECK(type IN ('benefit', 'cost')),
      weight REAL NOT NULL,
      scale_min REAL NOT NULL DEFAULT 1.0,
      scale_max REAL NOT NULL DEFAULT 5.0,
      is_active INTEGER NOT NULL DEFAULT 1
    );

    -- 5. Matching Rules (Configurable mapping heuristics)
    CREATE TABLE IF NOT EXISTS matching_rules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      rule_type TEXT NOT NULL,
      input_value TEXT NOT NULL,
      target_value TEXT NOT NULL,
      match_score REAL NOT NULL,
      rationale TEXT,
      is_active INTEGER NOT NULL DEFAULT 1
    );

    -- 6. Recommendation Runs (Dynamic audit logs)
    CREATE TABLE IF NOT EXISTS recommendation_runs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      skin_tone TEXT NOT NULL,
      undertone TEXT NOT NULL,
      selected_colors TEXT NOT NULL,
      selected_formula TEXT NOT NULL,
      budget_limit INTEGER,
      candidates_count INTEGER,
      v_parameter REAL NOT NULL DEFAULT 0.5,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    );

    -- 6b. Users (Pengguna Aplikasi)
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      display_name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      privacy_consent_at DATETIME NOT NULL,
      privacy_notice_version TEXT NOT NULL DEFAULT 'v1.0',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- 7. Recommendation Scores (Dynamic Decision Matrix)
    CREATE TABLE IF NOT EXISTS recommendation_scores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      run_id INTEGER NOT NULL,
      product_shade_id INTEGER NOT NULL,
      criterion_code TEXT NOT NULL,
      score REAL NOT NULL,
      FOREIGN KEY (run_id) REFERENCES recommendation_runs(id) ON DELETE CASCADE,
      FOREIGN KEY (product_shade_id) REFERENCES product_shades(id) ON DELETE CASCADE
    );

    -- 8. Recommendation Results
    CREATE TABLE IF NOT EXISTS recommendation_results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      run_id INTEGER NOT NULL,
      product_shade_id INTEGER NOT NULL,
      S_value REAL NOT NULL,
      R_value REAL NOT NULL,
      Q_value REAL NOT NULL,
      rank INTEGER NOT NULL,
      is_compromise INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (run_id) REFERENCES recommendation_runs(id) ON DELETE CASCADE,
      FOREIGN KEY (product_shade_id) REFERENCES product_shades(id) ON DELETE CASCADE
    );

    -- 9. Admin Users
    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'admin',
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Migrasi aman: Pastikan kolom user_id ada di recommendation_runs jika database sudah ada sebelumnya
  try {
    const runCols = db.pragma('table_info(recommendation_runs)') as Array<{ name: string }>;
    const hasUserId = runCols.some((col) => col.name === 'user_id');
    if (!hasUserId) {
      db.exec('ALTER TABLE recommendation_runs ADD COLUMN user_id INTEGER REFERENCES users(id)');
    }
  } catch (err) {
    console.warn('Migration warning for recommendation_runs.user_id:', err);
  }
}
