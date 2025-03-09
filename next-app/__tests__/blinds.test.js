import { generateBlindStructure, recommendStartingStack } from '../lib/blinds';

describe('generateBlindStructure', () => {
  test('generates correct structure for standard tournament', () => {
    const result = generateBlindStructure(9, 1500, 2, 5);
    
    // Basic validations
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
    
    // Check first level structure
    const firstLevel = result[0];
    expect(firstLevel).toHaveProperty('level', 1);
    expect(firstLevel).toHaveProperty('smallBlind', 5);
    expect(firstLevel).toHaveProperty('bigBlind', 10);
    expect(firstLevel).toHaveProperty('startTime', '00:00');
    expect(firstLevel).toHaveProperty('durationMinutes');
    
    // Check level progression
    expect(result[1].smallBlind).toBeGreaterThan(result[0].smallBlind);
    expect(result[1].bigBlind).toBeGreaterThan(result[0].bigBlind);
    
    // Verify time progression
    const firstDuration = result[0].durationMinutes;
    expect(result[1].startTime).toBe(`00:${firstDuration.toString().padStart(2, '0')}`);
  });
  
  test('adapts level durations based on tournament length', () => {
    const shortTournament = generateBlindStructure(9, 1500, 1, 5);
    const mediumTournament = generateBlindStructure(9, 1500, 2, 5);
    const longTournament = generateBlindStructure(9, 1500, 5, 5);
    
    // Short tournaments should have shorter level durations
    expect(shortTournament[0].durationMinutes).toBeLessThanOrEqual(mediumTournament[0].durationMinutes);
    // Long tournaments should have longer level durations
    expect(longTournament[0].durationMinutes).toBeGreaterThanOrEqual(mediumTournament[0].durationMinutes);
  });
  
  test('calculates appropriate target final blind', () => {
    const result = generateBlindStructure(9, 1500, 2, 5);
    const lastLevel = result[result.length - 1];
    
    // The last level's big blind should be significant compared to total chips
    const totalChips = 9 * 1500;
    // Last big blind should be at least 1/10th of total chips per player
    expect(lastLevel.bigBlind).toBeGreaterThan((totalChips / 9) / 10);
    // But not more than total chips per player (would make game unplayable)
    expect(lastLevel.bigBlind).toBeLessThan(totalChips / 9);
  });
  
  test('rounds blinds to nice values', () => {
    const result = generateBlindStructure(9, 1500, 2, 5);
    
    // Test that all blinds are properly rounded
    result.forEach(level => {
      if (level.smallBlind < 10) {
        // Small values should be multiple of 5
        expect(level.smallBlind % 5).toBe(0);
      } else if (level.smallBlind < 100) {
        // Medium values should be multiple of 10
        expect(level.smallBlind % 10).toBe(0);
      } else if (level.smallBlind < 500) {
        // Larger values should be multiple of 25
        expect(level.smallBlind % 25).toBe(0);
      }
      
      // Check that big blind is approximately double the small blind
      // Due to rounding, it might not be exactly double
      expect(level.bigBlind).toBeGreaterThanOrEqual(level.smallBlind);
      expect(level.bigBlind).toBeLessThanOrEqual(level.smallBlind * 2.5);
    });
  });
  
  test('throws error with invalid input', () => {
    // Invalid players
    expect(() => generateBlindStructure(1, 1500, 2, 5)).toThrow(/players/);
    expect(() => generateBlindStructure(101, 1500, 2, 5)).toThrow(/players/);
    
    // Invalid starting stack
    expect(() => generateBlindStructure(9, 50, 2, 5)).toThrow(/stack/);
    expect(() => generateBlindStructure(9, 200000, 2, 5)).toThrow(/stack/);
    
    // Invalid duration
    expect(() => generateBlindStructure(9, 1500, 0.2, 5)).toThrow(/duration/);
    expect(() => generateBlindStructure(9, 1500, 15, 5)).toThrow(/duration/);
  });
});

describe('recommendStartingStack', () => {
  test('recommends appropriate stack sizes based on tournament length', () => {
    // Short tournament
    expect(recommendStartingStack(1)).toBe(1000);
    
    // Medium tournaments
    expect(recommendStartingStack(2)).toBe(1500);
    
    // Longer tournaments
    expect(recommendStartingStack(4)).toBe(2500);
    expect(recommendStartingStack(6)).toBe(5000);
    
    // Verify progression
    expect(recommendStartingStack(1)).toBeLessThan(recommendStartingStack(2));
    expect(recommendStartingStack(2)).toBeLessThan(recommendStartingStack(4));
    expect(recommendStartingStack(4)).toBeLessThan(recommendStartingStack(6));
  });
});