import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { seedDatabase } from '@/lib/seed';

export async function GET() {
  try {
    seedDatabase();
    const db = getDb();

    const brands = (db.prepare('SELECT COUNT(*) as c FROM brands WHERE is_active = 1').get() as { c: number }).c;
    const products = (db.prepare('SELECT COUNT(*) as c FROM products WHERE is_active = 1').get() as { c: number }).c;
    const shades = (db.prepare('SELECT COUNT(*) as c FROM product_shades WHERE is_active = 1').get() as { c: number }).c;
    const criteria = (db.prepare('SELECT COUNT(*) as c FROM criteria WHERE is_active = 1').get() as { c: number }).c;
    const runs = (db.prepare('SELECT COUNT(*) as c FROM recommendation_runs').get() as { c: number }).c;

    const recentRuns = db.prepare(`
      SELECT id, skin_tone, undertone, selected_colors, selected_formula, budget_limit, candidates_count, created_at
      FROM recommendation_runs
      ORDER BY id DESC
      LIMIT 5
    `).all();

    return NextResponse.json({
      success: true,
      stats: { brands, products, shades, criteria, runs },
      recentRuns,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
