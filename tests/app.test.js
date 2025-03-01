// tests/app.test.js
const { Chip, distributeChips } = require('../site/app.js');

describe('distributeChips', () => {
  test('distributes chips evenly for 2 players and 1.5 buys', () => {
    // Mock window.chipTypes (global in jsdom maps to window)
    global.chipTypes = [
      new Chip('white', 1, 250),
      new Chip('red', 5, 200)
    ];

    // Mock alert to avoid DOM dependency issues
    global.alert = jest.fn();

    const result = distributeChips(2, 1.5);
    
    expect(result.white).toBe(83);  // 250 / (2 * 1.5) = 83.33 -> 83
    expect(result.red).toBe(66);    // 200 / (2 * 1.5) = 66.66 -> 66
    expect(result.chips).toBe(298); // (83 + 66) * 2
    expect(result.value).toBe(413); // (83 * 1) + (66 * 5)
  });
});