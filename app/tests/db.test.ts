import { describe, it, expect } from 'vitest';
import { getDb } from '../src/lib/db';
import { seedDatabase } from '../src/lib/seed';

describe('Database SQLite & Seed Initialization', () => {
  it('initializes schema and populates demo seed data', () => {
    seedDatabase();
    const db = getDb();

    const brandsCount = db.prepare('SELECT COUNT(*) as c FROM brands').get() as { c: number };
    expect(brandsCount.c).toBeGreaterThan(0);

    const shadesCount = db.prepare('SELECT COUNT(*) as c FROM product_shades').get() as { c: number };
    expect(shadesCount.c).toBeGreaterThan(0);

    const criteriaCount = db.prepare('SELECT COUNT(*) as c FROM criteria').get() as { c: number };
    expect(criteriaCount.c).toBe(4); // C1, C2, C3, C4

    const admin = db.prepare('SELECT username FROM admin_users WHERE username = ?').get('admin');
    expect(admin).toBeDefined();
  });
});
