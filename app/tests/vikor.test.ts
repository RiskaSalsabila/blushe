import { describe, it, expect } from 'vitest';
import { calculateVikor, CandidateAlternative, CriterionConfig } from '../src/lib/vikor';

describe('VIKOR Calculation Engine - Multi-Alternative Scenarios', () => {
  const sampleCriteria: CriterionConfig[] = [
    { code: 'C1', name: 'Skin Tone Match', type: 'benefit', weight: 0.35 },
    { code: 'C2', name: 'Undertone Match', type: 'benefit', weight: 0.25 },
    { code: 'C3', name: 'Color Preference', type: 'benefit', weight: 0.25 },
    { code: 'C4', name: 'Price', type: 'cost', weight: 0.15 },
  ];

  const sampleAlternatives: CandidateAlternative[] = [
    {
      id: 1,
      name: 'Petal Theory - Cloud Blush / Soft Rose',
      scores: { C1: 4.5, C2: 4.0, C3: 5.0, C4: 78000 },
    },
    {
      id: 2,
      name: 'Mellow Muse - Velvet Cheek / Peach Bloom',
      scores: { C1: 3.5, C2: 5.0, C3: 4.0, C4: 92000 },
    },
    {
      id: 3,
      name: 'Dear Petal - Soft Flush / Coral Dawn',
      scores: { C1: 4.0, C2: 3.5, C3: 3.0, C4: 59000 },
    },
    {
      id: 4,
      name: 'Rose Atelier - Silk Tint / Mauve Day',
      scores: { C1: 3.0, C2: 4.0, C3: 3.5, C4: 105000 },
    },
  ];

  // 1. Kondisi m = 0
  it('handles m = 0 (empty alternatives): does not run VIKOR, returns empty results', () => {
    const result = calculateVikor([], sampleCriteria);
    expect(result.ranked).toHaveLength(0);
    expect(result.isVikorEligible).toBe(false);
    expect(result.DQ).toBe(0);
    expect(result.compromiseAlternatives).toHaveLength(0);
  });

  // 2. Kondisi m = 1
  it('handles m = 1 (single alternative): does not calculate ranking, Q, or compromise, and avoids division by zero in DQ', () => {
    const singleAlt: CandidateAlternative[] = [sampleAlternatives[0]];
    const result = calculateVikor(singleAlt, sampleCriteria);

    expect(result.ranked).toHaveLength(1);
    expect(result.isVikorEligible).toBe(false);

    // Pastikan DQ tidak menghasilkan Infinity atau NaN (pembagian 1 / (1-1))
    expect(result.DQ).toBe(0);
    expect(Number.isFinite(result.DQ)).toBe(true);

    const item = result.ranked[0];
    expect(item.name).toBe(sampleAlternatives[0].name);
    // Tidak dilabeli sebagai Solusi Kompromi
    expect(item.isCompromise).toBe(false);
    // Nilai rank dan Q tidak ditetapkan
    expect(item.rank).toBeUndefined();
    expect(item.Q).toBeUndefined();
    expect(result.compromiseAlternatives).toHaveLength(0);
  });

  // 3. Kondisi m = 2
  it('handles m = 2 (two alternatives): calculates S, R, Q, sets DQ = 1/(2-1) = 1.0, and evaluates C1 & C2', () => {
    const twoAlts: CandidateAlternative[] = [sampleAlternatives[0], sampleAlternatives[1]];
    const result = calculateVikor(twoAlts, sampleCriteria, 0.5);

    expect(result.ranked).toHaveLength(2);
    expect(result.isVikorEligible).toBe(true);

    // DQ = 1 / (2 - 1) = 1.0
    expect(result.DQ).toBe(1.0);

    // Alternatif memiliki rank dan Q
    expect(result.ranked[0].rank).toBe(1);
    expect(result.ranked[1].rank).toBe(2);
    expect(result.ranked[0].Q).toBeDefined();
    expect(result.ranked[1].Q).toBeDefined();

    // S, R, Q valid
    expect(Number.isNaN(result.ranked[0].S)).toBe(false);
    expect(Number.isNaN(result.ranked[0].R)).toBe(false);
    expect(Number.isNaN(result.ranked[0].Q)).toBe(false);

    // Status pesan evaluasi kompromi tersedia
    expect(result.statusMessage).toBeDefined();
    expect(typeof result.acceptableAdvantage).toBe('boolean');
    expect(typeof result.acceptableStability).toBe('boolean');
  });

  // 4. Kondisi m > 2 (m = 3 dan m = 4)
  it('handles m = 3 and m = 4 (more than 2 alternatives): calculates accurate DQ and ranking order', () => {
    // Test m = 3
    const threeAlts = sampleAlternatives.slice(0, 3);
    const res3 = calculateVikor(threeAlts, sampleCriteria, 0.5);

    expect(res3.ranked).toHaveLength(3);
    expect(res3.isVikorEligible).toBe(true);
    // DQ = 1 / (3 - 1) = 0.5
    expect(res3.DQ).toBe(0.5);
    expect(res3.ranked[0].rank).toBe(1);
    expect(res3.ranked[1].rank).toBe(2);
    expect(res3.ranked[2].rank).toBe(3);
    expect(res3.ranked[0].Q).toBeLessThanOrEqual(res3.ranked[1].Q!);

    // Test m = 4
    const res4 = calculateVikor(sampleAlternatives, sampleCriteria, 0.5);
    expect(res4.ranked).toHaveLength(4);
    expect(res4.isVikorEligible).toBe(true);
    // DQ = 1 / (4 - 1) = 0.3333
    expect(res4.DQ).toBe(0.3333);
    expect(res4.ranked[0].rank).toBe(1);
    expect(res4.ranked[3].rank).toBe(4);
  });

  it('handles zero denominator safely when alternatives have identical values on a criterion', () => {
    const tiedCriteria: CriterionConfig[] = [
      { code: 'C1', name: 'Skin Tone Match', type: 'benefit', weight: 0.5 },
      { code: 'C2', name: 'Price', type: 'cost', weight: 0.5 },
    ];

    const tiedAlternatives: CandidateAlternative[] = [
      { id: 10, name: 'Alt A', scores: { C1: 4.0, C2: 50000 } },
      { id: 11, name: 'Alt B', scores: { C1: 4.0, C2: 70000 } },
    ];

    const result = calculateVikor(tiedAlternatives, tiedCriteria, 0.5);
    expect(result.ranked).toHaveLength(2);
    expect(Number.isNaN(result.ranked[0].S)).toBe(false);
    expect(Number.isNaN(result.ranked[0].R)).toBe(false);
    expect(Number.isNaN(result.ranked[0].Q)).toBe(false);
  });
});
