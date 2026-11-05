import { describe, it, expect } from 'vitest';
import { calculateVikor, CandidateAlternative, CriterionConfig } from '../src/lib/vikor';

describe('VIKOR Calculation Engine', () => {
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
  ];

  it('calculates S, R, and Q accurately and ranks alternatives in ascending order of Q', () => {
    const result = calculateVikor(sampleAlternatives, sampleCriteria, 0.5);

    expect(result.ranked).toHaveLength(3);
    // Rank 1 must have smallest Q
    expect(result.ranked[0].rank).toBe(1);
    expect(result.ranked[0].Q).toBeLessThanOrEqual(result.ranked[1].Q);
    expect(result.ranked[1].Q).toBeLessThanOrEqual(result.ranked[2].Q);

    // Verify fStar and fMinus
    expect(result.fStar['C1']).toBe(4.5);
    expect(result.fMinus['C1']).toBe(3.5);

    // Price is cost, so fStar is min (59000), fMinus is max (92000)
    expect(result.fStar['C4']).toBe(59000);
    expect(result.fMinus['C4']).toBe(92000);

    // DQ = 1 / (3 - 1) = 0.5
    expect(result.DQ).toBe(0.5);
  });

  it('handles zero denominator safely when all alternatives have identical scores on a criterion', () => {
    const tiedCriteria: CriterionConfig[] = [
      { code: 'C1', name: 'Skin Tone Match', type: 'benefit', weight: 0.5 },
      { code: 'C2', name: 'Price', type: 'cost', weight: 0.5 },
    ];

    const tiedAlternatives: CandidateAlternative[] = [
      { id: 10, name: 'Alt A', scores: { C1: 4.0, C2: 50000 } },
      { id: 11, name: 'Alt B', scores: { C1: 4.0, C2: 70000 } }, // C1 identical across both
    ];

    const result = calculateVikor(tiedAlternatives, tiedCriteria, 0.5);

    expect(result.ranked).toHaveLength(2);
    // S and R should be valid numbers, not NaN
    expect(Number.isNaN(result.ranked[0].S)).toBe(false);
    expect(Number.isNaN(result.ranked[0].R)).toBe(false);
    expect(Number.isNaN(result.ranked[0].Q)).toBe(false);
  });

  it('handles edge case of single alternative gracefully', () => {
    const singleAlt: CandidateAlternative[] = [
      { id: 99, name: 'Only One', scores: { C1: 5.0, C4: 80000 } },
    ];

    const result = calculateVikor(singleAlt, sampleCriteria);
    expect(result.ranked).toHaveLength(1);
    expect(result.ranked[0].rank).toBe(1);
    expect(result.ranked[0].Q).toBe(0);
    expect(result.ranked[0].isCompromise).toBe(true);
  });

  it('handles empty alternative list without crashing', () => {
    const result = calculateVikor([], sampleCriteria);
    expect(result.ranked).toHaveLength(0);
    expect(result.compromiseAlternatives).toHaveLength(0);
  });
});
