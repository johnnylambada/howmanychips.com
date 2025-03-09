import { useState, useEffect } from 'react';
import { calculatePayouts, getPayoutStructures } from '../lib/payout';

export default function PayoutCalculator() {
  const [players, setPlayers] = useState(9);
  const [buyIn, setBuyIn] = useState(50);
  const [structureType, setStructureType] = useState('top-three');
  const [showCustom, setShowCustom] = useState(false);
  const [customPercentages, setCustomPercentages] = useState([50, 30, 20]);
  const [payoutResults, setPayoutResults] = useState(null);
  const [error, setError] = useState(null);
  
  const payoutStructures = getPayoutStructures();
  
  // Calculate payouts when inputs change
  useEffect(() => {
    try {
      const results = calculatePayouts(
        players, 
        buyIn, 
        structureType,
        showCustom ? customPercentages : null
      );
      setPayoutResults(results);
      setError(null);
    } catch (err) {
      setError(err.message);
      setPayoutResults(null);
    }
  }, [players, buyIn, structureType, showCustom, customPercentages]);
  
  // Handle structure type change
  const handleStructureChange = (e) => {
    const newType = e.target.value;
    setStructureType(newType);
    
    // Toggle custom percentages mode
    setShowCustom(newType === 'custom');
    
    // Initialize custom percentages based on current structure
    if (newType === 'custom' && !showCustom) {
      setCustomPercentages([50, 30, 20]);
    }
  };
  
  // Handle changes to custom percentages
  const handleCustomPercentageChange = (index, value) => {
    const newPercentages = [...customPercentages];
    newPercentages[index] = parseFloat(value) || 0;
    setCustomPercentages(newPercentages);
  };
  
  // Add an additional payout position
  const addPayoutPosition = () => {
    setCustomPercentages([...customPercentages, 0]);
  };
  
  // Remove a payout position
  const removePayoutPosition = (index) => {
    const newPercentages = [...customPercentages];
    newPercentages.splice(index, 1);
    setCustomPercentages(newPercentages);
  };
  
  // Format currency
  const formatCurrency = (amount) => {
    return '$' + amount.toLocaleString();
  };
  
  return (
    <div>
      <div className="input-section">
        <h3>Tournament Details</h3>
        
        <div className="input-group">
          <label htmlFor="players">Number of Players:</label>
          <input
            type="number"
            id="players"
            min="2"
            max="1000"
            value={players}
            onChange={(e) => setPlayers(parseInt(e.target.value) || 9)}
          />
        </div>
        
        <div className="input-group">
          <label htmlFor="buyIn">Buy-in Amount ($):</label>
          <input
            type="number"
            id="buyIn"
            min="1"
            step="1"
            value={buyIn}
            onChange={(e) => setBuyIn(parseInt(e.target.value) || 50)}
          />
        </div>
        
        <div className="input-group">
          <label htmlFor="structure">Payout Structure:</label>
          <select
            id="structure"
            value={structureType}
            onChange={handleStructureChange}
          >
            {payoutStructures.map(structure => (
              <option key={structure.id} value={structure.id}>
                {structure.name}
              </option>
            ))}
            <option value="custom">Custom Percentages</option>
          </select>
        </div>
        
        {showCustom && (
          <div className="input-section" style={{ background: '#f0f0f0', padding: '15px', marginTop: '10px' }}>
            <h4>Custom Percentages</h4>
            <p style={{ fontSize: '0.9em' }}>Total: {customPercentages.reduce((a, b) => a + b, 0).toFixed(1)}% (should equal 100%)</p>
            
            {customPercentages.map((percentage, index) => (
              <div key={index} className="input-group" style={{ marginBottom: '8px' }}>
                <label htmlFor={`custom-${index}`}>{ordinalSuffix(index + 1)} Place (%):</label>
                <input
                  type="number"
                  id={`custom-${index}`}
                  min="0"
                  max="100"
                  step="0.1"
                  value={percentage}
                  onChange={(e) => handleCustomPercentageChange(index, e.target.value)}
                  style={{ width: '80px' }}
                />
                {customPercentages.length > 1 && (
                  <button 
                    className="remove-btn" 
                    onClick={() => removePayoutPosition(index)}
                    style={{ marginLeft: '10px', padding: '5px 10px' }}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            
            <button 
              onClick={addPayoutPosition}
              style={{ marginTop: '10px', padding: '5px 15px' }}
            >
              Add Position
            </button>
          </div>
        )}
      </div>

      {error ? (
        <div className="input-section" style={{ color: 'red' }}>
          <p>{error}</p>
        </div>
      ) : payoutResults && (
        <>
          <div className="input-section">
            <h3>Tournament Summary</h3>
            <p>Total Prize Pool: <strong>{formatCurrency(payoutResults.prizePool)}</strong></p>
            <p>Paying Positions: <strong>{payoutResults.payouts.length}</strong></p>
          </div>
          
          <div className="output-section">
            <h3>Payout Structure</h3>
            <table>
              <thead>
                <tr>
                  <th>Position</th>
                  <th>Percentage</th>
                  <th>Payout</th>
                </tr>
              </thead>
              <tbody>
                {payoutResults.payouts.map((payout) => (
                  <tr key={payout.position}>
                    <td>{ordinalSuffix(payout.position)}</td>
                    <td>{payout.percentage.toFixed(1)}%</td>
                    <td>{formatCurrency(payout.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="input-section">
            <h3>Tips</h3>
            <ul style={{ paddingLeft: '20px' }}>
              <li>In home games, a flatter payout structure (more paying positions) typically keeps more players happy</li>
              <li>For competitive tournaments, a top-heavy structure creates more excitement at the final table</li>
              <li>Consider setting aside 5-10% of the prize pool for dealers or food if appropriate</li>
              <li>Use our <a href="/blind-structure">Blind Structure Generator</a> to plan your tournament blind levels</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

// Helper function to add ordinal suffix to numbers (1st, 2nd, 3rd, etc.)
function ordinalSuffix(num) {
  const j = num % 10;
  const k = num % 100;
  
  if (j === 1 && k !== 11) {
    return num + "st";
  }
  if (j === 2 && k !== 12) {
    return num + "nd";
  }
  if (j === 3 && k !== 13) {
    return num + "rd";
  }
  return num + "th";
}