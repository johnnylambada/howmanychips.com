class Chip {
  constructor(name, value, available) {
      this.name = name;
      this.value = value;
      this.available = available;
  }
}

let chipTypes = [new Chip("white", 1, 0)]; // Start with one chip type

// Cookie handling functions
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

function loadStateFromCookie() {
  const state = getCookie('pokerChipState');
  if (state) {
      const parsed = JSON.parse(state);
      document.getElementById('players').value = parsed.players;
      document.getElementById('buys').value = parsed.buys;
      chipTypes = parsed.chipTypes.map(c => new Chip(c.name, c.value, c.available));
      renderChipTypes();
      calculateChips();
  } else {
      renderChipTypes();
      calculateChips();
  }
}

function saveStateToCookie() {
  const state = {
      players: parseInt(document.getElementById('players').value),
      buys: parseFloat(document.getElementById('buys').value),
      chipTypes: chipTypes.map(chip => ({
          name: chip.name,
          value: chip.value,
          available: chip.available
      }))
  };
  setCookie('pokerChipState', JSON.stringify(state), 30); // Expires in 30 days
}

function renderChipTypes() {
  const container = document.getElementById('chip-types-container');
  container.innerHTML = '';

  chipTypes.forEach((chip, index) => {
      const row = document.createElement('div');
      row.className = 'chip-row';
      row.innerHTML = `
          <label>Name:</label>
          <input type="text" value="${chip.name}" onchange="updateChipName(${index}, this.value)">
          <label>Value:</label>
          <input type="number" min="1" value="${chip.value}" onchange="updateChipValue(${index}, this.value)">
          <label>Available:</label>
          <input type="number" min="0" value="${chip.available}" onchange="updateChipAvailable(${index}, this.value)">
          ${chipTypes.length > 1 ? `<button class="remove-btn" onclick="removeChipType(${index})">Remove</button>` : ''}
      `;
      container.appendChild(row);
  });

  updateTableHeaders();
}

function addChipType() {
  chipTypes.push(new Chip(`chip${chipTypes.length + 1}`, 1, 0));
  renderChipTypes();
}

function removeChipType(index) {
  chipTypes.splice(index, 1);
  renderChipTypes();
}

function updateChipName(index, name) {
  chipTypes[index].name = name;
  updateTableHeaders();
}

function updateChipValue(index, value) {
  chipTypes[index].value = parseInt(value) || 1;
}

function updateChipAvailable(index, available) {
  chipTypes[index].available = parseInt(available) || 0;
}

function setStandardChips() {
  chipTypes = [
      new Chip("white", 1, 250),
      new Chip("red", 5, 200),
      new Chip("blue", 10, 150),
      new Chip("green", 50, 99),
      new Chip("black", 100, 99)
  ];
  renderChipTypes();
  calculateChips();
}

function updateTableHeaders() {
  const firstHeader = document.getElementById('firstTableHeader');
  const lastHeader = document.getElementById('lastTableHeader');
  firstHeader.innerHTML = '<th>Players</th>';
  lastHeader.innerHTML = '<th>Players</th>';

  chipTypes.forEach(chip => {
      firstHeader.innerHTML += `<th>${chip.name}</th>`;
      lastHeader.innerHTML += `<th>${chip.name}</th>`;
  });

  firstHeader.innerHTML += '<th>Total Chips</th><th>Total Value</th>';
  lastHeader.innerHTML += '<th>Total Chips</th><th>Total Value</th>';
}

function calculateChips() {
  const players = parseInt(document.getElementById('players').value);
  const buys = parseFloat(document.getElementById('buys').value);

  if (players < 2 || isNaN(players) || isNaN(buys) || buys <= 1 ||
      chipTypes.some(chip => isNaN(chip.available) || chip.available < 0 || isNaN(chip.value) || chip.value <= 0)) {
      alert('Please enter valid inputs: Players (2 or more), Buys (>1), Available Chips (>=0), Values (>0)');
      return;
  }

  const fullBuys = Math.floor(buys);
  const lastBuyFraction = buys - fullBuys;

  const firstBuy = distributeChips(players, buys);
  const lastBuy = scaleChips(firstBuy, lastBuyFraction, players);

  updateTable('firstTable', firstBuy, players);
  updateTable('lastTable', lastBuy, players);

  const totalChipsUsed = (firstBuy.chips * fullBuys) + lastBuy.chips;
  document.getElementById('totalChipsUsed').textContent = `Total Chips Used: ${totalChipsUsed}`;

  saveStateToCookie(); // Save state after successful calculation
}

function distributeChips(players, buys) {
  const chips = {};
  chipTypes.forEach(chip => {
      chips[chip.name] = Math.floor(chip.available / (players * buys));
  });

  const totalChipsPerPlayer = Object.values(chips).reduce((sum, count) => sum + count, 0);
  const totalValuePerPlayer = chipTypes.reduce((sum, chip) => sum + (chips[chip.name] * chip.value), 0);

  const totalChipsNeeded = totalChipsPerPlayer * players * buys;
  const totalChipsAvailable = chipTypes.reduce((sum, chip) => sum + chip.available, 0);
  if (totalChipsNeeded > totalChipsAvailable) {
      alert('Error: Not enough chips to distribute across all players and buy-ins.');
  }

  return {
      ...chips,
      chips: totalChipsPerPlayer * soldiers,
      value: totalValuePerPlayer
  };
}

function scaleChips(baseChips, fraction, players) {
  const scaled = {};
  chipTypes.forEach(chip => {
      scaled[chip.name] = Math.floor(baseChips[chip.name] * fraction);
  });

  const totalChipsPerPlayer = Object.values(scaled).reduce((sum, count) => sum + count, 0);
  const totalValuePerPlayer = chipTypes.reduce((sum, chip) => sum + (scaled[chip.name] * chip.value), 0);

  return {
      ...scaled,
      chips: totalChipsPerPlayer * players,
      value: totalValuePerPlayer
  };
}

function updateTable(tableId, data, players) {
  const table = document.getElementById(tableId);
  while (table.rows.length > 1) table.deleteRow(1);

  const row = table.insertRow();
  row.insertCell().textContent = players;
  chipTypes.forEach(chip => {
      row.insertCell().textContent = data[chip.name];
  });
  row.insertCell().textContent = data.chips;
  row.insertCell().textContent = `$${data.value.toLocaleString()}`;
}

// Load state from cookie on page load
loadStateFromCookie();