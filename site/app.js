// site/app.js
class Chip {
  constructor(name, value, available) {
      this.name = name;
      this.value = value;
      this.available = available;
  }
}

// Cookie handling (still needs document.cookie, but we'll isolate it)
function setCookie(name, value, days) {
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/`;
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return decodeURIComponent(parts.pop().split(';').shift());
  return null;
}

// Pure functions
function distributeChips(players, buys, chipTypes) {
  const chips = {};
  chipTypes.forEach(chip => {
      chips[chip.name] = Math.floor(chip.available / (players * buys));
  });

  const totalChipsPerPlayer = Object.values(chips).reduce((sum, count) => sum + count, 0);
  const totalValuePerPlayer = chipTypes.reduce((sum, chip) => sum + (chips[chip.name] * chip.value), 0);

  const totalChipsNeeded = totalChipsPerPlayer * players * buys;
  const totalChipsAvailable = chipTypes.reduce((sum, chip) => sum + chip.available, 0);
  
  return {
      chipsData: chips,
      totalChips: totalChipsPerPlayer * players,
      totalValue: totalValuePerPlayer,
      isValid: totalChipsNeeded <= totalChipsAvailable
  };
}

function scaleChips(firstBuy, fraction, players, chipTypes) {
  const scaled = {};
  chipTypes.forEach(chip => {
      scaled[chip.name] = Math.floor(firstBuy.chipsData[chip.name] * fraction);
  });

  const totalChipsPerPlayer = Object.values(scaled).reduce((sum, count) => sum + count, 0);
  const totalValuePerPlayer = chipTypes.reduce((sum, chip) => sum + (scaled[chip.name] * chip.value), 0);

  return {
      chipsData: scaled,
      totalChips: totalChipsPerPlayer * players,
      totalValue: totalValuePerPlayer
  };
}

function calculateChips(players, buys, chipTypes) {
  if (players < 2 || isNaN(players) || isNaN(buys) || buys <= 1 ||
      chipTypes.some(chip => isNaN(chip.available) || chip.available < 0 || isNaN(chip.value) || chip.value <= 0)) {
      return { error: 'Invalid inputs: Players (2 or more), Buys (>1), Available Chips (>=0), Values (>0)' };
  }

  const fullBuys = Math.floor(buys);
  const lastBuyFraction = buys - fullBuys;

  const firstBuy = distributeChips(players, buys, chipTypes);
  if (!firstBuy.isValid) {
      return { error: 'Not enough chips to distribute across all players and buy-ins' };
  }

  const lastBuy = scaleChips(firstBuy, lastBuyFraction, players, chipTypes);
  const totalChipsUsed = (firstBuy.totalChips * fullBuys) + lastBuy.totalChips;

  return { firstBuy, lastBuy, totalChipsUsed };
}

function addChipType(chipTypes) {
  const newChip = new Chip(`chip${chipTypes.length + 1}`, 1, 0);
  return [...chipTypes, newChip];
}

function removeChipType(chipTypes, index) {
  return chipTypes.filter((_, i) => i !== index);
}

function updateChipName(chipTypes, index, name) {
  const updated = [...chipTypes];
  updated[index].name = name;
  return updated;
}

function updateChipValue(chipTypes, index, value) {
  const updated = [...chipTypes];
  updated[index].value = parseInt(value) || 1;
  return updated;
}

function updateChipAvailable(chipTypes, index, available) {
  const updated = [...chipTypes];
  updated[index].available = parseInt(available) || 0;
  return updated;
}

function setStandardChips() {
  return [
      new Chip("white", 1, 250),
      new Chip("red", 5, 200),
      new Chip("blue", 10, 150),
      new Chip("green", 50, 99),
      new Chip("black", 100, 99)
  ];
}

module.exports = {
  Chip,
  setCookie,
  getCookie,
  distributeChips,
  scaleChips,
  calculateChips,
  addChipType,
  removeChipType,
  updateChipName,
  updateChipValue,
  updateChipAvailable,
  setStandardChips
};