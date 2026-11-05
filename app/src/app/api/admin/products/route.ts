import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { seedDatabase } from '@/lib/seed';

export async function GET() {
  try {
    seedDatabase();
    const db = getDb();

    const brands = db.prepare('SELECT * FROM brands WHERE is_active = 1 ORDER BY name ASC').all();
    const products = db.prepare(`
      SELECT p.*, b.name as brand_name 
      FROM products p 
      JOIN brands b ON p.brand_id = b.id 
      WHERE p.is_active = 1 
      ORDER BY p.product_name ASC
    `).all();

    const shades = db.prepare(`
      SELECT s.*, p.product_name, b.name as brand_name
      FROM product_shades s
      JOIN products p ON s.product_id = p.id
      JOIN brands b ON p.brand_id = b.id
      WHERE s.is_active = 1
      ORDER BY s.id DESC
    `).all();

    return NextResponse.json({ success: true, brands, products, shades });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    seedDatabase();
    const db = getDb();
    const body = await request.json();
    const { action } = body;

    if (action === 'create_brand') {
      const { name, websiteUrl } = body;
      const res = db.prepare('INSERT INTO brands (name, website_url) VALUES (?, ?)').run(name, websiteUrl || null);
      return NextResponse.json({ success: true, id: Number(res.lastInsertRowid) });
    }

    if (action === 'create_product') {
      const { brandId, productName, description } = body;
      const res = db.prepare('INSERT INTO products (brand_id, product_name, description) VALUES (?, ?, ?)').run(
        brandId,
        productName,
        description || null
      );
      return NextResponse.json({ success: true, id: Number(res.lastInsertRowid) });
    }

    if (action === 'create_shade') {
      const {
        productId,
        shadeName,
        shadeDescription,
        formula,
        colorFamily,
        colorHex,
        priceIdr,
        toneDepth = 'Medium',
        undertoneBias = 'Neutral',
      } = body;

      const res = db.prepare(`
        INSERT INTO product_shades (
          product_id, shade_name, shade_description, formula, color_family, color_hex, price_idr, tone_depth, undertone_bias
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        productId,
        shadeName,
        shadeDescription || null,
        formula,
        colorFamily,
        colorHex,
        priceIdr,
        toneDepth,
        undertoneBias
      );
      return NextResponse.json({ success: true, id: Number(res.lastInsertRowid) });
    }

    return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const shadeId = searchParams.get('shadeId');

    if (shadeId) {
      db.prepare('UPDATE product_shades SET is_active = 0 WHERE id = ?').run(shadeId);
      return NextResponse.json({ success: true, message: 'Shade dinonaktifkan' });
    }

    return NextResponse.json({ success: false, message: 'Parameter shadeId diperlukan' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
