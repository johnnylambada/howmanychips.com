/**
 * Calculate blind structure for a poker tournament
 */

/**
 * Generate a blind structure for a poker tournament
 * @param {number} players - Number of players
 * @param {number} startingStack - Starting chip stack per player
 * @param {number} durationHours - Desired tournament length in hours
 * @param {number} [initialSmallBlind=5] - Initial small blind amount
 * @returns {Array} Array of blind levels with timing information
 */
export function generateBlindStructure(players, startingStack, durationHours, initialSmallBlind = 5) {
  // Input validation
  if (players < 2 || players > 100) {
    throw new Error('Number of players must be between 2 and 100');
  }
  if (startingStack < 100 || startingStack > 100000) {
    throw new Error('Starting stack must be between 100 and 100,000');
  }
  if (durationHours < 0.5 || durationHours > 12) {
    throw new Error('Tournament duration must be between 0.5 and 12 hours');
  }

  // Calculate total tournament chips
  const totalChips = players * startingStack;
  
  // Determine number of blind levels based on duration
  // Typically 15-20 minute levels for shorter games, 20-30 for longer games
  let levelDurationMinutes;
  if (durationHours <= 1) {
    levelDurationMinutes = 10; // Short tournament
  } else if (durationHours <= 3) {
    levelDurationMinutes = 15; // Medium tournament
  } else {
    levelDurationMinutes = 20; // Longer tournament
  }
  
  // Calculate number of levels
  const numLevels = Math.ceil((durationHours * 60) / levelDurationMinutes);
  
  // Calculate blind increment factor
  // The last level's big blind should be roughly 1/4 to 1/3 of all chips
  const targetFinalBigBlind = Math.ceil(totalChips / (3 * players));
  const initialBigBlind = initialSmallBlind * 2;
  const incrementFactor = Math.pow(targetFinalBigBlind / initialBigBlind, 1 / (numLevels - 1));
  
  // Generate blind structure
  const blindStructure = [];
  let currentSmallBlind = initialSmallBlind;
  let currentBigBlind = initialBigBlind;
  let currentTime = 0;
  
  for (let i = 0; i < numLevels; i++) {
    // Round blinds to nice numbers
    const roundedSmallBlind = roundBlind(currentSmallBlind);
    const roundedBigBlind = roundBlind(currentBigBlind);
    
    // Format time
    const hours = Math.floor(currentTime / 60);
    const minutes = currentTime % 60;
    const timeStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    
    // Add to structure
    blindStructure.push({
      level: i + 1,
      smallBlind: roundedSmallBlind,
      bigBlind: roundedBigBlind,
      startTime: timeStr,
      durationMinutes: levelDurationMinutes
    });
    
    // Increase blinds for next level
    currentSmallBlind *= incrementFactor;
    currentBigBlind *= incrementFactor;
    currentTime += levelDurationMinutes;
  }
  
  return blindStructure;
}

/**
 * Round blinds to nice values for easier chip handling
 */
function roundBlind(blind) {
  if (blind < 10) {
    return Math.max(5, Math.round(blind / 5) * 5);
  } else if (blind < 100) {
    return Math.round(blind / 10) * 10;
  } else if (blind < 500) {
    return Math.round(blind / 25) * 25;
  } else if (blind < 1000) {
    return Math.round(blind / 50) * 50;
  } else if (blind < 5000) {
    return Math.round(blind / 100) * 100;
  } else {
    return Math.round(blind / 500) * 500;
  }
}

/**
 * Calculate recommended starting stack sizes based on desired tournament length
 * @param {number} durationHours - Desired tournament length in hours
 * @returns {number} - Recommended starting stack size
 */
export function recommendStartingStack(durationHours) {
  if (durationHours <= 1) {
    return 1000; // Short tournament
  } else if (durationHours <= 2) {
    return 1500; // Medium-short tournament
  } else if (durationHours <= 4) {
    return 2500; // Medium tournament
  } else {
    return 5000; // Long tournament
  }
}