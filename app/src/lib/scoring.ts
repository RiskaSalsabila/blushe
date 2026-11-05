/**
 * BLUSHÉ — Modular Dynamic Scoring Engine
 * 
 * Modul ini menghitung nilai kecocokan kriteria (C1, C2, C3) secara dinamis
 * berdasarkan profil dan preferensi pengguna dengan atribut spesifik shade.
 * 
 * CATATAN PENTING:
 * Matriks dan skala nilai dalam modul ini bersifat PROVISIONAL / SIMULASI.
 * Belum menjadi keputusan akademik final sampai disahkan oleh studi literatur
 * dan arahan dosen pembimbing.
 */

export interface ShadeProfile {
  id: number;
  shadeName: string;
  formula: string;
  colorFamily: string;
  colorHex: string;
  priceIdr: number;
  // Atribut teoritis untuk pencocokan (simulasi)
  toneDepth?: string;     // 'Fair', 'Light', 'Medium', 'Tan', 'Deep', 'Universal'
  undertoneBias?: string; // 'Warm', 'Cool', 'Neutral', 'Universal'
}

/**
 * C1 — Menghitung skor kecocokan Skin Tone pengguna dengan kedalaman warna shade.
 * Skala 1.0 (sangat tidak cocok) hingga 5.0 (sangat cocok).
 */
export function scoreSkinTone(userTone: string | null, shadeToneDepth?: string): number {
  if (!userTone || !shadeToneDepth) return 3.0; // Nilai default netral jika belum ada data

  if (shadeToneDepth === 'Universal') return 4.5;
  if (userTone === shadeToneDepth) return 5.0;

  const toneLevels = ['Fair', 'Light', 'Medium', 'Tan', 'Deep'];
  const userIdx = toneLevels.indexOf(userTone);
  const shadeIdx = toneLevels.indexOf(shadeToneDepth);

  if (userIdx !== -1 && shadeIdx !== -1) {
    const diff = Math.abs(userIdx - shadeIdx);
    if (diff === 1) return 3.8;
    if (diff === 2) return 2.5;
    return 1.5;
  }

  return 3.0;
}

/**
 * C2 — Menghitung skor kecocokan Undertone pengguna dengan bias undertone shade.
 * Skala 1.0 hingga 5.0.
 */
export function scoreUndertone(userUndertone: string | null, shadeBias?: string): number {
  if (!userUndertone || !shadeBias) return 3.0;

  if (shadeBias === 'Neutral' || shadeBias === 'Universal' || userUndertone === 'Neutral') {
    return 4.2; // Neutral sangat fleksibel
  }

  if (userUndertone === shadeBias) {
    return 5.0; // Sangat cocok (e.g. Warm dengan Warm)
  }

  return 2.0; // Berlawanan (e.g. Cool dengan Warm)
}

/**
 * C3 — Menghitung skor kesesuaian preferensi warna pengguna (multi-select).
 * Pengguna dapat memilih lebih dari satu kelompok warna (e.g. ['Pink', 'Peach']).
 */
export function scoreColorPreference(
  selectedColors: string[],
  shadeColorFamily: string
): number {
  if (!selectedColors || selectedColors.length === 0) return 3.0;

  // Jika shade termasuk dalam salah satu warna yang dipilih pengguna
  if (selectedColors.includes(shadeColorFamily)) {
    return 5.0;
  }

  // Hubungan keharmonisan warna sekunder (simulasi)
  const relatedGroups: Record<string, string[]> = {
    Pink: ['Mauve', 'Berry', 'Coral'],
    Peach: ['Coral', 'Terracotta'],
    Coral: ['Peach', 'Pink'],
    Mauve: ['Berry', 'Pink'],
    Berry: ['Mauve', 'Pink'],
    Terracotta: ['Peach', 'Coral'],
  };

  const isRelated = selectedColors.some((color) =>
    relatedGroups[color]?.includes(shadeColorFamily)
  );

  if (isRelated) {
    return 3.5; // Warna tetangga/harmonis
  }

  return 1.5; // Tidak ada korelasi preferensi
}
