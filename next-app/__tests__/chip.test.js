// __tests__/chip.test.js
import { Chip, distributeChips, scaleChips, calculateChips, setStandardChips, addChipType, removeChipType, updateChipName, updateChipValue, updateChipAvailable } from '../lib/chip';

describe('Chip Class', () => {
  test('constructs with correct properties', () => {
    const chip = new Chip('white', 1, 250);
    expect(chip.name).toBe('white');
    expect(chip.value).toBe(1);
    expect(chip.available).toBe(250);
  });
});

describe('distributeChips', () => {
  const chipTypes = [
    new Chip('white', 1, 250),
    new Chip('red', 5, 200),
    new Chip('blue', 10, 150),
    new Chip('green', 50, 99),
    new Chip('black', 100, 99)
  ];

  test('distributes chips evenly for 2 players and 1.5 buys (spreadsheet default)', () => {
    const result = distributeChips(2, 1.5, chipTypes);
    
    expect(result.chipsData.white).toBe(83);
    expect(result.chipsData.red).toBe(66);
    expect(result.chipsData.blue).toBe(50);
    expect(result.chipsData.green).toBe(33);
    expect(result.chipsData.black).toBe(33);
    expect(result.totalChips).toBe(530);
    expect(result.totalValue).toBe(5863);
    expect(result.isValid).toBe(true);
  });

  test('distributes for 5 players and 1.5 buys', () => {
    const result = distributeChips(5, 1.5, chipTypes);
    
    expect(result.chipsData.white).toBe(33);
    expect(result.chipsData.red).toBe(26);
    expect(result.chipsData.blue).toBe(20);
    expect(result.chipsData.green).toBe(13);
    expect(result.chipsData.black).toBe(13);
    expect(result.totalChips).toBe(525);
    expect(result.totalValue).toBe(2313);
    expect(result.isValid).toBe(true);
  });
});

describe('scaleChips', () => {
  const chipTypes = [
    new Chip('white', 1, 250),
    new Chip('red', 5, 200),
    new Chip('blue', 10, 150),
    new Chip('green', 50, 99),
    new Chip('black', 100, 99)
  ];

  test('scales chips for last buy-in (0.5) with 2 players', () => {
    const firstBuy = distributeChips(2, 1.5, chipTypes);
    const result = scaleChips(firstBuy, 0.5, 2, chipTypes);
    
    expect(result.chipsData.white).toBe(41);
    expect(result.chipsData.red).toBe(33);
    expect(result.chipsData.blue).toBe(25);
    expect(result.chipsData.green).toBe(16);
    expect(result.chipsData.black).toBe(16);
    expect(result.totalChips).toBe(262);
    expect(result.totalValue).toBe(2856);
  });
});

describe('calculateChips', () => {
  const chipTypes = [
    new Chip('white', 1, 250),
    new Chip('red', 5, 200),
    new Chip('blue', 10, 150),
    new Chip('green', 50, 99),
    new Chip('black', 100, 99)
  ];

  test('calculates full flow for 2 players, 1.5 buys', () => {
    const result = calculateChips(2, 1.5, chipTypes);
    
    expect(result.error).toBeUndefined();
    expect(result.firstBuy.totalChips).toBe(530);
    expect(result.firstBuy.totalValue).toBe(5863);
    expect(result.lastBuy.totalChips).toBe(262);
    expect(result.lastBuy.totalValue).toBe(2856);
    expect(result.totalChipsUsed).toBe(792);
  });

  test('returns error on invalid players', () => {
    const result = calculateChips(1, 1.5, chipTypes);
    expect(result.error).toBe('Invalid inputs: Players (2 or more), Buys (>1), Available Chips (>=0), Values (>0)');
  });
});

describe('setStandardChips', () => {
  test('resets to spreadsheet defaults', () => {
    const result = setStandardChips();
    
    expect(result.length).toBe(5);
    expect(result[0]).toEqual({ name: 'white', value: 1, available: 250 });
    expect(result[1]).toEqual({ name: 'red', value: 5, available: 200 });
    expect(result[2]).toEqual({ name: 'blue', value: 10, available: 150 });
    expect(result[3]).toEqual({ name: 'green', value: 50, available: 99 });
    expect(result[4]).toEqual({ name: 'black', value: 100, available: 99 });
  });
});

describe('chipType Management', () => {
  test('addChipType adds a new chip', () => {
    const initial = [new Chip('white', 1, 250)];
    const result = addChipType(initial);
    expect(result.length).toBe(2);
    expect(result[1].name).toBe('chip2');
    expect(result[1].value).toBe(1);
    expect(result[1].available).toBe(0);
  });

  test('removeChipType removes a chip', () => {
    const initial = [new Chip('white', 1, 250), new Chip('red', 5, 200)];
    const result = removeChipType(initial, 1);
    expect(result.length).toBe(1);
    expect(result[0].name).toBe('white');
  });

  test('updateChipName changes name', () => {
    const initial = [new Chip('white', 1, 250)];
    const result = updateChipName(initial, 0, 'blue');
    expect(result[0].name).toBe('blue');
    expect(result[0].value).toBe(1);
  });

  test('updateChipValue changes value', () => {
    const initial = [new Chip('white', 1, 250)];
    const result = updateChipValue(initial, 0, '10');
    expect(result[0].value).toBe(10);
    expect(result[0].available).toBe(250);
  });

  test('updateChipAvailable changes available', () => {
    const initial = [new Chip('white', 1, 250)];
    const result = updateChipAvailable(initial, 0, '100');
    expect(result[0].available).toBe(100);
    expect(result[0].value).toBe(1);
  });
});