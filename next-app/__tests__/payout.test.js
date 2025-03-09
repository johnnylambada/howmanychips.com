import { calculatePayouts, getPayoutStructures } from '../lib/payout';

describe('calculatePayouts', () => {
  test('calculates prize pool correctly', () => {
    const result = calculatePayouts(10, 50, 'top-three');
    expect(result.prizePool).toBe(500); // 10 players * $50 buy-in
  });
  
  test('distributes top-three payouts correctly', () => {
    const result = calculatePayouts(10, 100, 'top-three');
    
    expect(result.payouts.length).toBe(3);
    
    // Verify correct percentages
    expect(result.payouts[0].percentage).toBe(50);
    expect(result.payouts[1].percentage).toBe(30);
    expect(result.payouts[2].percentage).toBe(20);
    
    // Verify correct positions
    expect(result.payouts[0].position).toBe(1);
    expect(result.payouts[1].position).toBe(2);
    expect(result.payouts[2].position).toBe(3);
    
    // Verify correct amounts
    expect(result.payouts[0].amount).toBe(500); // 50% of $1000
    expect(result.payouts[1].amount).toBe(300); // 30% of $1000
    expect(result.payouts[2].amount).toBe(200); // 20% of $1000
    
    // Total should add up to prize pool
    const totalPaid = result.payouts.reduce((sum, payout) => sum + payout.amount, 0);
    expect(totalPaid).toBe(1000);
  });
  
  test('handles winner-takes-all structure correctly', () => {
    const result = calculatePayouts(5, 20, 'winner-takes-all');
    
    expect(result.payouts.length).toBe(1);
    expect(result.payouts[0].position).toBe(1);
    expect(result.payouts[0].percentage).toBe(100);
    expect(result.payouts[0].amount).toBe(100); // 5 players * $20 buy-in
  });
  
  test('handles top percentage structures correctly', () => {
    // Test for top 25% of field with 20 players
    const result = calculatePayouts(20, 50, 'top-25-percent');
    
    // Should pay 5 players (25% of 20)
    expect(result.payouts.length).toBe(5);
    
    // Verify descending payouts
    for (let i = 1; i < result.payouts.length; i++) {
      expect(result.payouts[i].amount).toBeLessThan(result.payouts[i-1].amount);
    }
    
    // Total payout should equal prize pool
    const totalPaid = result.payouts.reduce((sum, payout) => sum + payout.amount, 0);
    expect(totalPaid).toBe(1000); // 20 players * $50 buy-in
  });
  
  test('limits payouts to number of players', () => {
    // Try to pay 9 places with only 6 players
    const result = calculatePayouts(6, 100, 'final-table');
    
    // Should only pay 6 players even though final table normally pays 9
    expect(result.payouts.length).toBe(6);
  });
  
  test('handles custom percentages correctly', () => {
    const customPercentages = [40, 40, 20];
    const result = calculatePayouts(10, 50, 'custom', customPercentages);
    
    expect(result.payouts.length).toBe(3);
    expect(result.payouts[0].percentage).toBe(40);
    expect(result.payouts[1].percentage).toBe(40);
    expect(result.payouts[2].percentage).toBe(20);
    
    // Verify amounts
    expect(result.payouts[0].amount).toBe(200); // 40% of $500
    expect(result.payouts[1].amount).toBe(200); // 40% of $500
    expect(result.payouts[2].amount).toBe(100); // 20% of $500
  });
  
  test('normalizes custom percentages that do not add up to 100%', () => {
    // Percentages that don't add up to 100
    const customPercentages = [50, 20, 10]; // Adds up to 80%
    const result = calculatePayouts(10, 100, 'custom', customPercentages);
    
    // Total payout should still equal prize pool
    const totalPaid = result.payouts.reduce((sum, payout) => sum + payout.amount, 0);
    expect(totalPaid).toBe(1000);
  });
  
  test('throws error with invalid inputs', () => {
    // Invalid number of players
    expect(() => calculatePayouts(1, 50, 'top-three')).toThrow(/players/);
    
    // Invalid buy-in
    expect(() => calculatePayouts(10, 0, 'top-three')).toThrow('Buy-in amount must be greater than 0');
    expect(() => calculatePayouts(10, -10, 'top-three')).toThrow('Buy-in amount must be greater than 0');
  });
});

describe('getPayoutStructures', () => {
  test('returns array of available payout structures', () => {
    const structures = getPayoutStructures();
    
    expect(Array.isArray(structures)).toBe(true);
    expect(structures.length).toBeGreaterThan(0);
    
    // Each structure should have an id and name
    structures.forEach(structure => {
      expect(structure).toHaveProperty('id');
      expect(structure).toHaveProperty('name');
    });
    
    // Common structures should be included
    const structureIds = structures.map(s => s.id);
    expect(structureIds).toContain('winner-takes-all');
    expect(structureIds).toContain('top-three');
    expect(structureIds).toContain('final-table');
  });
});