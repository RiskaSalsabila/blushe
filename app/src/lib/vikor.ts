/**
 * BLUSHÉ — Modul Kalkulasi Algoritma VIKOR (VlseKriterijumska Optimizacija I Kompromisno Resenje)
 * 
 * Modul terisolasi tanpa ketergantungan pada UI atau framework.
 * Mengikuti formulasi standar VIKOR:
 * 1. Tentukan f* (terbaik) dan f- (terburuk) per kriteria (benefit vs cost).
 * 2. Hitung Utility Measure (S_i) dan Individual Regret (R_i).
 * 3. Hitung Indeks Kompromi (Q_i) dengan parameter v (default 0.5).
 * 4. Urutkan berdasarkan Q_i ascending (terkecil = peringkat terbaik).
 * 5. Evaluasi kondisi kompromi:
 *    - C1: Acceptable Advantage: Q(A2) - Q(A1) >= DQ, DQ = 1 / (m - 1)
 *    - C2: Acceptable Stability: A1 juga terbaik pada S atau R.
 */

export interface CriterionConfig {
  code: string;
  name: string;
  type: 'benefit' | 'cost';
  weight: number;
}

export interface CandidateAlternative {
  id: number;
  name: string;
  brand?: string;
  shade?: string;
  formula?: string;
  price?: number;
  colorHex?: string;
  scores: Record<string, number>; // key: criterion.code
  metadata?: Record<string, unknown>;
}

export interface VikorAlternativeResult {
  alternativeId: number;
  name: string;
  brand?: string;
  shade?: string;
  formula?: string;
  price?: number;
  colorHex?: string;
  S?: number;
  R?: number;
  Q?: number;
  rank?: number;
  isCompromise: boolean;
  metadata?: Record<string, unknown>;
}

export interface VikorCalculationOutput {
  ranked: VikorAlternativeResult[];
  fStar: Record<string, number>;
  fMinus: Record<string, number>;
  sStar: number;
  sMinus: number;
  rStar: number;
  rMinus: number;
  DQ: number;
  acceptableAdvantage: boolean; // C1
  acceptableStability: boolean; // C2
  compromiseAlternatives: number[]; // daftar alternativeId yang masuk solusi kompromi
  isVikorEligible: boolean; // true hanya jika m >= 2
  statusMessage: string;
}

/**
 * Menjalankan kalkulasi VIKOR untuk daftar alternatif dan kriteria.
 * Menangani kasus khusus:
 * - m = 0: return kosong, VIKOR tidak dijalankan
 * - m = 1: informasi alternatif ditampilkan tanpa pemeringkatan/Q/solusi kompromi, DQ = 0 (mencegah pembagian nol)
 * - m >= 2: kalkulasi penuh VIKOR, S, R, Q, evaluasi C1 & C2
 */
export function calculateVikor(
  alternatives: CandidateAlternative[],
  criteria: CriterionConfig[],
  vParameter: number = 0.5
): VikorCalculationOutput {
  const m = alternatives.length;

  // Kasus 1: m = 0 (Tidak ada alternatif)
  if (m === 0) {
    return {
      ranked: [],
      fStar: {},
      fMinus: {},
      sStar: 0,
      sMinus: 0,
      rStar: 0,
      rMinus: 0,
      DQ: 0,
      acceptableAdvantage: false,
      acceptableStability: false,
      compromiseAlternatives: [],
      isVikorEligible: false,
      statusMessage: 'Tidak ada alternatif yang memenuhi kriteria filter.',
    };
  }

  // Kasus 2: m = 1 (Hanya satu alternatif yang lolos filter)
  // VIKOR membutuhkan minimal 2 alternatif untuk dibandingkan (m >= 2).
  // DQ = 1/(m-1) tidak dihitung untuk mencegah pembagian dengan nol.
  if (m === 1) {
    const alt = alternatives[0];
    const singleResult: VikorAlternativeResult = {
      alternativeId: alt.id,
      name: alt.name,
      brand: alt.brand,
      shade: alt.shade,
      formula: alt.formula,
      price: alt.price,
      colorHex: alt.colorHex,
      isCompromise: false, // Tidak dilabeli solusi kompromi
      metadata: alt.metadata,
      // S, R, Q, dan rank sengaja undefined (tidak dihitung/bukan hasil VIKOR)
    };
    return {
      ranked: [singleResult],
      fStar: {},
      fMinus: {},
      sStar: 0,
      sMinus: 0,
      rStar: 0,
      rMinus: 0,
      DQ: 0, // Aman: mencegah pembagian dengan nol 1/(1-1)
      acceptableAdvantage: false,
      acceptableStability: false,
      compromiseAlternatives: [],
      isVikorEligible: false,
      statusMessage:
        'Hanya satu alternatif yang memenuhi filter sehingga belum dapat dilakukan pemeringkatan VIKOR (memerlukan minimal 2 alternatif).',
    };
  }

  // Kasus 3: m >= 2 (Kalkulasi VIKOR Penuh)
  // Normalisasi bobot kriteria agar total = 1.0 (safeguard)
  const totalWeight = criteria.reduce((sum, c) => sum + (c.weight > 0 ? c.weight : 0), 0);
  const normalizedCriteria = criteria.map((c) => ({
    ...c,
    weight: totalWeight > 0 ? c.weight / totalWeight : 1 / criteria.length,
  }));

  // 1. Tentukan f* (terbaik) dan f- (terburuk) per kriteria
  const fStar: Record<string, number> = {};
  const fMinus: Record<string, number> = {};

  for (const crit of normalizedCriteria) {
    const scores = alternatives.map((a) => a.scores[crit.code] ?? 0);
    const maxVal = Math.max(...scores);
    const minVal = Math.min(...scores);

    if (crit.type === 'benefit') {
      fStar[crit.code] = maxVal;
      fMinus[crit.code] = minVal;
    } else {
      // cost: nilai terbaik adalah yang terkecil
      fStar[crit.code] = minVal;
      fMinus[crit.code] = maxVal;
    }
  }

  // 2. Hitung S_i dan R_i
  // S_i = sum_j [ w_j * (f*_j - f_ij) / (f*_j - f-_j) ]
  // R_i = max_j [ w_j * (f*_j - f_ij) / (f*_j - f-_j) ]
  const preliminaryResults = alternatives.map((alt) => {
    let sSum = 0;
    let rMax = 0;

    for (const crit of normalizedCriteria) {
      const f_ij = alt.scores[crit.code] ?? 0;
      const best = fStar[crit.code];
      const worst = fMinus[crit.code];
      const denominator = best - worst;

      let distance = 0;
      // Penanganan zero-denominator jika semua alternatif memiliki nilai identik
      if (Math.abs(denominator) > 1e-9) {
        distance = (best - f_ij) / denominator;
      } else {
        distance = 0;
      }

      // Pastikan jarak tidak negatif karena rounding error
      if (distance < 0) distance = 0;

      const weightedDistance = crit.weight * distance;
      sSum += weightedDistance;
      if (weightedDistance > rMax) {
        rMax = weightedDistance;
      }
    }

    return {
      alternative: alt,
      S: sSum,
      R: rMax,
    };
  });

  // Nilai ekstrem untuk S dan R
  const allS = preliminaryResults.map((p) => p.S);
  const allR = preliminaryResults.map((p) => p.R);

  const sStar = Math.min(...allS);
  const sMinus = Math.max(...allS);
  const rStar = Math.min(...allR);
  const rMinus = Math.max(...allR);

  const sRange = sMinus - sStar;
  const rRange = rMinus - rStar;

  // 3. Hitung Q_i
  // Q_i = v * (S_i - S*) / (S- - S*) + (1-v) * (R_i - R*) / (R- - R*)
  const withQ = preliminaryResults.map((item) => {
    let sPart = 0;
    if (Math.abs(sRange) > 1e-9) {
      sPart = (item.S - sStar) / sRange;
    }

    let rPart = 0;
    if (Math.abs(rRange) > 1e-9) {
      rPart = (item.R - rStar) / rRange;
    }

    const Q = vParameter * sPart + (1 - vParameter) * rPart;

    return {
      alternativeId: item.alternative.id,
      name: item.alternative.name,
      brand: item.alternative.brand,
      shade: item.alternative.shade,
      formula: item.alternative.formula,
      price: item.alternative.price,
      colorHex: item.alternative.colorHex,
      S: Number(item.S.toFixed(4)),
      R: Number(item.R.toFixed(4)),
      Q: Number(Q.toFixed(4)),
      rank: 0,
      isCompromise: false,
      metadata: item.alternative.metadata,
    };
  });

  // 4. Urutkan berdasarkan Q ascending (nilai terkecil adalah terbaik)
  // Jika Q seri, gunakan S terkecil sebagai tie-breaker
  withQ.sort((a, b) => {
    if (Math.abs(a.Q - b.Q) > 1e-6) {
      return a.Q - b.Q;
    }
    return a.S - b.S;
  });

  // Tetapkan ranking
  withQ.forEach((item, index) => {
    item.rank = index + 1;
  });

  // 5. Evaluasi Solusi Kompromi
  // m >= 2 sehingga m - 1 >= 1 (aman dari zero denominator)
  const DQ = Number((1 / (m - 1)).toFixed(4));
  const bestAlt = withQ[0];
  const secondAlt = withQ[1];

  // Syarat C1: Acceptable Advantage -> Q(A2) - Q(A1) >= DQ
  const acceptableAdvantage = secondAlt.Q - bestAlt.Q >= DQ - 1e-6;

  // Syarat C2: Acceptable Stability -> A1 juga terbaik di urutan S atau urutan R
  const bestS = withQ.reduce((prev, curr) => ((curr.S ?? 0) < (prev.S ?? 0) ? curr : prev), withQ[0]);
  const bestR = withQ.reduce((prev, curr) => ((curr.R ?? 0) < (prev.R ?? 0) ? curr : prev), withQ[0]);
  const acceptableStability =
    bestAlt.alternativeId === bestS.alternativeId || bestAlt.alternativeId === bestR.alternativeId;

  // Tentukan alternatif mana saja yang diusulkan sebagai solusi kompromi
  const compromiseIds: number[] = [];
  let statusMessage = '';

  if (acceptableAdvantage && acceptableStability) {
    // Solusi kompromi tunggal definitif
    bestAlt.isCompromise = true;
    compromiseIds.push(bestAlt.alternativeId);
    statusMessage =
      'Kondisi kompromi C1 (Acceptable Advantage) dan C2 (Acceptable Stability) terpenuhi. Alternatif teratas merupakan solusi kompromi definitif.';
  } else if (!acceptableAdvantage && acceptableStability) {
    // Kumpulan solusi kompromi karena C1 tidak terpenuhi
    for (const item of withQ) {
      if ((item.Q ?? 0) - (bestAlt.Q ?? 0) < DQ + 1e-6) {
        item.isCompromise = true;
        compromiseIds.push(item.alternativeId);
      }
    }
    statusMessage = `Kondisi C1 (Acceptable Advantage) tidak terpenuhi (selisih Q alternatif kedua dan pertama < DQ = ${DQ}). Alternatif dengan selisih Q < DQ diajukan sebagai kompromi bersama.`;
  } else if (acceptableAdvantage && !acceptableStability) {
    // Hanya C2 tidak terpenuhi: A1 dan A2 diajukan sebagai solusi kompromi
    bestAlt.isCompromise = true;
    secondAlt.isCompromise = true;
    compromiseIds.push(bestAlt.alternativeId, secondAlt.alternativeId);
    statusMessage =
      'Kondisi C2 (Acceptable Stability) tidak terpenuhi (alternatif teratas Q bukan yang terbaik pada nilai S atau R). Alternatif peringkat 1 dan 2 diajukan sebagai solusi kompromi.';
  } else {
    // Keduanya tidak terpenuhi
    for (const item of withQ) {
      if ((item.Q ?? 0) - (bestAlt.Q ?? 0) < DQ + 1e-6) {
        item.isCompromise = true;
        compromiseIds.push(item.alternativeId);
      }
    }
    statusMessage = `Kondisi C1 dan C2 tidak terpenuhi secara penuh. Alternatif teratas dengan selisih Q < DQ = ${DQ} diajukan sebagai solusi kompromi bersama.`;
  }

  return {
    ranked: withQ,
    fStar,
    fMinus,
    sStar: Number(sStar.toFixed(4)),
    sMinus: Number(sMinus.toFixed(4)),
    rStar: Number(rStar.toFixed(4)),
    rMinus: Number(rMinus.toFixed(4)),
    DQ,
    acceptableAdvantage,
    acceptableStability,
    compromiseAlternatives: compromiseIds,
    isVikorEligible: true,
    statusMessage,
  };
}
