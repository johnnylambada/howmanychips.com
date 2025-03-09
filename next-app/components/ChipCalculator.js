import { useState, useEffect } from 'react';
import { 
  Chip, 
  calculateChips, 
  addChipType, 
  removeChipType, 
  updateChipName, 
  updateChipValue, 
  updateChipAvailable, 
  setStandardChips 
} from '../lib/chip';

export default function ChipCalculator() {
  const [chipTypes, setChipTypes] = useState([new Chip("white", 1, 0)]);
  const [players, setPlayers] = useState(2);
  const [buys, setBuys] = useState(1.5);
  const [results, setResults] = useState(null);

  useEffect(() => {
    // Load state from local storage if available
    const savedState = typeof window !== 'undefined' ? localStorage.getItem('pokerChipState') : null;
    
    if (savedState) {
      const parsed = JSON.parse(savedState);
      setPlayers(parsed.players);
      setBuys(parsed.buys);
      setChipTypes(parsed.chipTypes.map(c => new Chip(c.name, c.value, c.available)));
      handleCalculate(parsed.players, parsed.buys, parsed.chipTypes.map(c => new Chip(c.name, c.value, c.available)));
    } else {
      renderChipTypes();
    }
  }, []);

  const saveState = (players, buys, chipTypes) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('pokerChipState', JSON.stringify({ players, buys, chipTypes }));
    }
  };

  const handleCalculate = (players, buys, chips) => {
    const playersVal = players || 2;
    const buysVal = buys || 1.5;
    const chipsVal = chips || chipTypes;
    
    const result = calculateChips(playersVal, buysVal, chipsVal);
    
    if (result.error) {
      alert(result.error);
      return;
    }
    
    setResults(result);
    saveState(playersVal, buysVal, chipsVal);
  };

  const handleAddChipType = () => {
    setChipTypes(prevChips => addChipType(prevChips));
  };

  const handleRemoveChipType = (index) => {
    setChipTypes(prevChips => removeChipType(prevChips, index));
  };

  const handleUpdateChipName = (index, name) => {
    setChipTypes(prevChips => updateChipName(prevChips, index, name));
  };

  const handleUpdateChipValue = (index, value) => {
    setChipTypes(prevChips => updateChipValue(prevChips, index, value));
  };

  const handleUpdateChipAvailable = (index, available) => {
    setChipTypes(prevChips => updateChipAvailable(prevChips, index, available));
  };

  const handleSetStandardChips = () => {
    const standardChips = setStandardChips();
    setChipTypes(standardChips);
    handleCalculate(players, buys, standardChips);
  };

  const renderChipTypes = () => {
    return chipTypes.map((chip, index) => (
      <div className="chip-row" key={index}>
        <label>Name:</label>
        <input 
          type="text" 
          value={chip.name} 
          onChange={(e) => handleUpdateChipName(index, e.target.value)} 
        />
        <label>Value:</label>
        <input 
          type="number" 
          min="1" 
          value={chip.value} 
          onChange={(e) => handleUpdateChipValue(index, e.target.value)} 
        />
        <label>Available:</label>
        <input 
          type="number" 
          min="0" 
          value={chip.available} 
          onChange={(e) => handleUpdateChipAvailable(index, e.target.value)} 
        />
        {chipTypes.length > 1 && (
          <button className="remove-btn" onClick={() => handleRemoveChipType(index)}>
            Remove
          </button>
        )}
      </div>
    ));
  };

  const renderTableHeaders = () => {
    return (
      <tr>
        <th>Players</th>
        {chipTypes.map((chip, index) => (
          <th key={index}>{chip.name}</th>
        ))}
        <th>Total Chips</th>
        <th>Total Value</th>
      </tr>
    );
  };

  const renderTableRow = (data, players) => {
    if (!data) return null;
    
    return (
      <tr>
        <td>{players}</td>
        {chipTypes.map((chip, index) => (
          <td key={index}>{data.chipsData[chip.name]}</td>
        ))}
        <td>{data.totalChips}</td>
        <td>${data.totalValue.toLocaleString()}</td>
      </tr>
    );
  };

  return (
    <div>
      <div className="input-section">
        <h3>Game Settings</h3>
        <div className="input-group">
          <label htmlFor="players">Players (2+):</label>
          <input
            type="number"
            id="players"
            min="2"
            value={players}
            onChange={(e) => setPlayers(parseInt(e.target.value))}
          />
        </div>
        <div className="input-group">
          <label htmlFor="buys">Buy-ins (e.g., 1.5):</label>
          <input
            type="number"
            id="buys"
            step="0.1"
            value={buys}
            onChange={(e) => setBuys(parseFloat(e.target.value))}
          />
        </div>

        <h3>Chip Types</h3>
        <div id="chip-types-container">
          {renderChipTypes()}
        </div>
        <div className="button-group">
          <button onClick={handleAddChipType}>Add Chip Type</button>
          <button className="standard-btn" onClick={handleSetStandardChips}>
            Standard Set
          </button>
          <button onClick={() => handleCalculate(players, buys, chipTypes)}>
            Calculate
          </button>
        </div>
      </div>

      {results && (
        <>
          <div className="output-section">
            <h3>First Buy-in (Per Player)</h3>
            <table>
              <thead>
                {renderTableHeaders()}
              </thead>
              <tbody>
                {renderTableRow(results.firstBuy, players)}
              </tbody>
            </table>
          </div>

          <div className="output-section">
            <h3>Last Buy-in (Per Player)</h3>
            <table>
              <thead>
                {renderTableHeaders()}
              </thead>
              <tbody>
                {renderTableRow(results.lastBuy, players)}
              </tbody>
            </table>
          </div>

          <div className="summary">
            Total Chips Used: {results.totalChipsUsed}
          </div>
        </>
      )}
    </div>
  );
}