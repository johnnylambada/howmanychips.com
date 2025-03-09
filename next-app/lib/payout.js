/**
 * Calculate payout structures for poker tournaments
 */

/**
 * Calculate tournament payouts based on players, buy-in amount, and structure type
 * @param {number} players - Number of players
 * @param {number} buyIn - Buy-in amount per player
 * @param {string} structureType - Type of payout structure
 * @param {number[]} [customPercentages] - Custom percentages for payout (optional)
 * @returns {Array} Array of payout amounts with positions
 */
export function calculatePayouts(players, buyIn, structureType, customPercentages = null) {
  // Input validation
  if (players < 2) {
    throw new Error('Number of players must be at least 2');
  }
  if (buyIn <= 0) {
    throw new Error('Buy-in amount must be greater than 0');
  }
  
  // Calculate total prize pool
  const prizePool = players * buyIn;
  
  // Determine number of paying positions and percentages based on structure type
  let payoutPositions = [];
  let percentages = [];
  
  if (customPercentages && Array.isArray(customPercentages) && customPercentages.length > 0) {
    // Use custom percentages if provided
    percentages = [...customPercentages];
    // Ensure percentages add up to 100%
    const sum = percentages.reduce((a, b) => a + b, 0);
    if (Math.abs(sum - 100) > 0.1) {
      // Normalize percentages if they don't add up to 100%
      percentages = percentages.map(p => (p / sum) * 100);
    }
  } else {
    // Use predefined structures
    switch (structureType) {
      case 'winner-takes-all':
        percentages = [100];
        break;
        
      case 'top-three':
        percentages = [50, 30, 20];
        break;
        
      case 'top-25-percent':
        // Pay top 25% of field
        const payingSpots = Math.max(2, Math.ceil(players * 0.25));
        percentages = generateDecreasingPercentages(payingSpots);
        break;
        
      case 'top-three-flat':
        percentages = [40, 30, 30];
        break;
        
      case 'top-10-percent':
        // Pay top 10% of field
        const tenPercent = Math.max(2, Math.ceil(players * 0.1));
        percentages = generateDecreasingPercentages(tenPercent);
        break;
        
      case 'final-table':
        // Pay final table (usually top 9 players)
        percentages = generateDecreasingPercentages(Math.min(9, players));
        break;
        
      default:
        // Default to 50/30/20 for top 3
        percentages = [50, 30, 20];
    }
  }
  
  // Limit payout positions to number of players
  percentages = percentages.slice(0, players);
  
  // Calculate actual payouts
  for (let i = 0; i < percentages.length; i++) {
    const position = i + 1;
    const percentage = percentages[i];
    const amount = Math.round((prizePool * percentage) / 100);
    
    payoutPositions.push({
      position: position,
      percentage: percentage,
      amount: amount
    });
  }
  
  return {
    prizePool,
    payouts: payoutPositions
  };
}

/**
 * Generate decreasing percentage distribution for a given number of paying positions
 * @param {number} spots - Number of paying positions
 * @returns {Array} Array of percentages that add up to 100%
 */
function generateDecreasingPercentages(spots) {
  // Special cases for small number of spots
  if (spots === 1) return [100];
  if (spots === 2) return [65, 35];
  if (spots === 3) return [50, 30, 20];
  if (spots === 4) return [45, 25, 18, 12];
  if (spots === 5) return [40, 23, 16, 12, 9];
  if (spots === 6) return [38, 22, 15, 11, 8, 6];
  
  // For larger payouts, use a formula to generate decreasing percentages
  const percentages = [];
  
  // First place gets 30-40% depending on field size
  const firstPlacePercent = Math.max(30, Math.min(40, 50 - spots * 1.5));
  percentages.push(firstPlacePercent);
  
  // Second place gets 55-65% of first place
  const secondPlacePercent = firstPlacePercent * 0.6;
  percentages.push(secondPlacePercent);
  
  // Remaining spots get progressively smaller
  let remainingPercent = 100 - (firstPlacePercent + secondPlacePercent);
  const remainingSpots = spots - 2;
  
  if (remainingSpots > 0) {
    // Generate a decreasing series for remaining spots
    let ratios = [];
    for (let i = remainingSpots; i > 0; i--) {
      ratios.push(Math.pow(1.2, i));
    }
    
    // Normalize the ratios to distribute the remaining percentage
    const totalRatio = ratios.reduce((sum, ratio) => sum + ratio, 0);
    for (let i = 0; i < remainingSpots; i++) {
      const percent = (ratios[i] / totalRatio) * remainingPercent;
      percentages.push(percent);
    }
  }
  
  // Round percentages to 1 decimal place
  return percentages.map(p => Math.round(p * 10) / 10);
}

/**
 * Get the names of available payout structures
 * @returns {Array} Array of structure objects with id and name
 */
export function getPayoutStructures() {
  return [
    { id: 'winner-takes-all', name: 'Winner Takes All' },
    { id: 'top-three', name: 'Top 3 (50/30/20)' },
    { id: 'top-three-flat', name: 'Top 3 Flat (40/30/30)' },
    { id: 'top-10-percent', name: 'Top 10% of Field' },
    { id: 'top-25-percent', name: 'Top 25% of Field' },
    { id: 'final-table', name: 'Final Table (9 spots)' }
  ];
}