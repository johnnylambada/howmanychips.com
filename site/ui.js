// site/ui.js
let chipTypes = [new Chip("white", 1, 0)];

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

function renderChipTypes() {
    const container = document.getElementById('chip-types-container');
    container.innerHTML = '';
    chipTypes.forEach((chip, index) => {
        const row = document.createElement('div');
        row.className = 'chip-row';
        row.innerHTML = `
            <label>Name:</label>
            <input type="text" value="${chip.name}" onchange="handleUpdateChipName(${index}, this.value)">
            <label>Value:</label>
            <input type="number" min="1" value="${chip.value}" onchange="handleUpdateChipValue(${index}, this.value)">
            <label>Available:</label>
            <input type="number" min="0" value="${chip.available}" onchange="handleUpdateChipAvailable(${index}, this.value)">
            ${chipTypes.length > 1 ? `<button class="remove-btn" onclick="handleRemoveChipType(${index})">Remove</button>` : ''}
        `;
        container.appendChild(row);
    });
    updateTableHeaders();
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

function updateTable(tableId, data, players) {
    const table = document.getElementById(tableId);
    while (table.rows.length > 1) table.deleteRow(1);
    const row = table.insertRow();
    row.insertCell().textContent = players;
    chipTypes.forEach(chip => {
        row.insertCell().textContent = data.chipsData[chip.name];
    });
    row.insertCell().textContent = data.totalChips;
    row.insertCell().textContent = `$${data.totalValue.toLocaleString()}`;
}

function handleCalculateChips() {
    const players = parseInt(document.getElementById('players').value);
    const buys = parseFloat(document.getElementById('buys').value);
    const result = calculateChips(players, buys, chipTypes);

    if (result.error) {
        alert(result.error);
        return;
    }

    updateTable('firstTable', result.firstBuy, players);
    updateTable('lastTable', result.lastBuy, players);
    document.getElementById('totalChipsUsed').textContent = `Total Chips Used: ${result.totalChipsUsed}`;
    setCookie('pokerChipState', JSON.stringify({ players, buys, chipTypes }), 30);
}

function handleAddChipType() {
    chipTypes = addChipType(chipTypes);
    renderChipTypes();
}

function handleRemoveChipType(index) {
    chipTypes = removeChipType(chipTypes, index);
    renderChipTypes();
}

function handleUpdateChipName(index, name) {
    chipTypes = updateChipName(chipTypes, index, name);
    renderChipTypes();
}

function handleUpdateChipValue(index, value) {
    chipTypes = updateChipValue(chipTypes, index, value);
}

function handleUpdateChipAvailable(index, available) {
    chipTypes = updateChipAvailable(chipTypes, index, available);
}

function handleSetStandardChips() {
    chipTypes = setStandardChips();
    renderChipTypes();
    handleCalculateChips();
}

function loadStateFromCookie() {
    const state = getCookie('pokerChipState');
    if (state) {
        const parsed = JSON.parse(state);
        document.getElementById('players').value = parsed.players;
        document.getElementById('buys').value = parsed.buys;
        chipTypes = parsed.chipTypes.map(c => new Chip(c.name, c.value, c.available));
        renderChipTypes();
        handleCalculateChips();
    } else {
        renderChipTypes();
        handleCalculateChips();
    }
}

loadStateFromCookie();