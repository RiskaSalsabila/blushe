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
    const users = (db.prepare('SELECT COUNT(*) as c FROM users').get() as { c: number }).c;

    const recentRuns = db.prepare(`
      SELECT 
        r.id, r.user_id, u.display_name as user_name, u.email as user_email,
        r.skin_tone, r.undertone, r.selected_colors, r.selected_formula, 
        r.budget_limit, r.candidates_count, r.created_at
      FROM recommendation_runs r
      LEFT JOIN users u ON r.user_id = u.id
      ORDER BY r.id DESC
      LIMIT 5
    `).all();

    return NextResponse.json({
      success: true,
      stats: { brands, products, shades, criteria, runs, users },
      recentRuns,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
