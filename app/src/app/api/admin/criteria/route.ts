import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { seedDatabase } from '@/lib/seed';

export async function GET() {
  try {
    seedDatabase();
    const db = getDb();
    const criteria = db.prepare('SELECT * FROM criteria ORDER BY code ASC').all();
    return NextResponse.json({ success: true, criteria });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    seedDatabase();
    const db = getDb();
    const { criteria } = await request.json();

    if (!Array.isArray(criteria)) {
      return NextResponse.json({ success: false, message: 'Data kriteria tidak valid' }, { status: 400 });
    }

    const updateStmt = db.prepare('UPDATE criteria SET weight = ?, type = ? WHERE id = ?');
    const updateTx = db.transaction((list: any[]) => {
      for (const c of list) {
        updateStmt.run(c.weight, c.type, c.id);
      }
    });

    updateTx(criteria);

    return NextResponse.json({ success: true, message: 'Kriteria berhasil diperbarui' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
