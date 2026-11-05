import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { calculateVikor, CandidateAlternative, CriterionConfig } from '@/lib/vikor';
import { scoreSkinTone, scoreUndertone, scoreColorPreference } from '@/lib/scoring';
import { seedDatabase } from '@/lib/seed';

export async function POST(request: Request) {
  try {
    seedDatabase(); // Pastikan DB terinisialisasi
    const db = getDb();

    const body = await request.json();
    const { tone, undertone, colors = [], formula, budget = 999999 } = body;

    // 1. Ambil kriteria aktif dari database
    const dbCriteria = db.prepare('SELECT * FROM criteria WHERE is_active = 1').all() as Array<{
      code: string;
      name: string;
      type: 'benefit' | 'cost';
      weight: number;
    }>;

    const criteriaConfig: CriterionConfig[] = dbCriteria.map((c) => ({
      code: c.code,
      name: c.name,
      type: c.type,
      weight: c.weight,
    }));

    // 2. Query seluruh produk dan shade aktif dengan join
    const query = `
      SELECT 
        s.id as shade_id,
        s.shade_name,
        s.shade_description,
        s.formula,
        s.color_family,
        s.color_hex,
        s.price_idr,
        s.tone_depth,
        s.undertone_bias,
        p.product_name,
        b.name as brand_name
      FROM product_shades s
      JOIN products p ON s.product_id = p.id
      JOIN brands b ON p.brand_id = b.id
      WHERE s.is_active = 1 AND p.is_active = 1 AND b.is_active = 1
    `;

    const allShades = db.prepare(query).all() as Array<{
      shade_id: number;
      shade_name: string;
      shade_description: string;
      formula: string;
      color_family: string;
      color_hex: string;
      price_idr: number;
      tone_depth?: string;
      undertone_bias?: string;
      product_name: string;
      brand_name: string;
    }>;

    // 3. Terapkan HARD FILTER
    const filtered = allShades.filter((item) => {
      // Filter Formula
      if (formula && formula !== 'No preference' && item.formula !== formula) {
        return false;
      }
      // Filter Anggaran
      if (budget && budget !== 999999 && item.price_idr > budget) {
        return false;
      }
      return true;
    });

    if (filtered.length === 0) {
      return NextResponse.json({
        success: true,
        summary: {
          tone,
          undertone,
          colors,
          formula: formula === 'No preference' ? 'Bebas' : formula,
          budget: budget === 999999 ? 'Tanpa batas' : `Maks. Rp${budget.toLocaleString('id-ID')}`,
        },
        candidatesCount: 0,
        results: [],
        audit: null,
        isEmpty: true,
      });
    }

    // 4. Pembentukan Matriks Keputusan Dinamis (Dynamic Scoring)
    const candidates: CandidateAlternative[] = filtered.map((item) => {
      const c1Score = scoreSkinTone(tone, item.tone_depth);
      const c2Score = scoreUndertone(undertone, item.undertone_bias);
      const c3Score = scoreColorPreference(colors, item.color_family);
      const c4Score = item.price_idr; // Cost criterion

      return {
        id: item.shade_id,
        name: `${item.brand_name} · ${item.product_name} / ${item.shade_name}`,
        brand: item.brand_name,
        shade: item.shade_name,
        formula: item.formula,
        price: item.price_idr,
        colorHex: item.color_hex,
        scores: {
          C1: c1Score,
          C2: c2Score,
          C3: c3Score,
          C4: c4Score,
        },
        metadata: {
          desc: item.shade_description,
          colorFamily: item.color_family,
          productName: item.product_name,
        },
      };
    });

    // 5. Eksekusi Algoritma VIKOR
    const vikorOutput = calculateVikor(candidates, criteriaConfig, 0.5);

    // 6. Catat audit sesi rekomendasi ke SQLite
    try {
      const runInsert = db.prepare(`
        INSERT INTO recommendation_runs (
          skin_tone, undertone, selected_colors, selected_formula, budget_limit, candidates_count, v_parameter
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(
        tone || '-',
        undertone || '-',
        JSON.stringify(colors),
        formula || 'No preference',
        budget,
        candidates.length,
        0.5
      );

      const runId = Number(runInsert.lastInsertRowid);

      const insertScore = db.prepare(`
        INSERT INTO recommendation_scores (run_id, product_shade_id, criterion_code, score)
        VALUES (?, ?, ?, ?)
      `);

      const insertResult = db.prepare(`
        INSERT INTO recommendation_results (
          run_id, product_shade_id, S_value, R_value, Q_value, rank, is_compromise
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `);

      for (const cand of candidates) {
        for (const [code, score] of Object.entries(cand.scores)) {
          insertScore.run(runId, cand.id, code, score);
        }
      }

      for (const res of vikorOutput.ranked) {
        insertResult.run(
          runId,
          res.alternativeId,
          res.S,
          res.R,
          res.Q,
          res.rank,
          res.isCompromise ? 1 : 0
        );
      }
    } catch (dbErr) {
      console.warn('Logging recommendation run failed:', dbErr);
    }

    return NextResponse.json({
      success: true,
      summary: {
        tone,
        undertone,
        colors,
        formula: formula === 'No preference' ? 'Bebas' : formula,
        budget: budget === 999999 ? 'Tanpa batas' : `Maks. Rp${budget.toLocaleString('id-ID')}`,
      },
      candidatesCount: candidates.length,
      results: vikorOutput.ranked.slice(0, 3), // Menampilkan 3 teratas sesuai prototype visual
      audit: {
        totalAlternatives: vikorOutput.ranked.length,
        DQ: vikorOutput.DQ,
        acceptableAdvantage: vikorOutput.acceptableAdvantage,
        acceptableStability: vikorOutput.acceptableStability,
        compromiseCount: vikorOutput.compromiseAlternatives.length,
      },
      isEmpty: false,
    });
  } catch (error: any) {
    console.error('API /recommend error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal error' },
      { status: 500 }
    );
  }
}
