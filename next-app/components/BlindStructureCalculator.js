import { useState, useEffect } from 'react';
import { generateBlindStructure, recommendStartingStack } from '../lib/blinds';

export default function BlindStructureCalculator() {
  const [players, setPlayers] = useState(8);
  const [startingStack, setStartingStack] = useState(1500);
  const [durationHours, setDurationHours] = useState(2);
  const [initialSmallBlind, setInitialSmallBlind] = useState(5);
  const [blindStructure, setBlindStructure] = useState([]);
  const [error, setError] = useState(null);
  const [totalChips, setTotalChips] = useState(0);

  // Calculate blind structure whenever inputs change
  useEffect(() => {
    try {
      const structure = generateBlindStructure(players, startingStack, durationHours, initialSmallBlind);
      setBlindStructure(structure);
      setTotalChips(players * startingStack);
      setError(null);
    } catch (err) {
      setError(err.message);
      setBlindStructure([]);
    }
  }, [players, startingStack, durationHours, initialSmallBlind]);

  // Handle preset durations
  const handlePresetDuration = (hours) => {
    setDurationHours(hours);
    // Also recommend a good starting stack for this duration
    setStartingStack(recommendStartingStack(hours));
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
            max="100"
            value={players}
            onChange={(e) => setPlayers(parseInt(e.target.value) || 8)}
          />
        </div>
        
        <div className="input-group">
          <label htmlFor="startingStack">Starting Stack:</label>
          <input
            type="number"
            id="startingStack"
            min="100"
            max="100000"
            step="100"
            value={startingStack}
            onChange={(e) => setStartingStack(parseInt(e.target.value) || 1500)}
          />
        </div>
        
        <div className="input-group">
          <label htmlFor="durationHours">Tournament Length (hours):</label>
          <input
            type="number"
            id="durationHours"
            min="0.5"
            max="12"
            step="0.5"
            value={durationHours}
            onChange={(e) => setDurationHours(parseFloat(e.target.value) || 2)}
          />
        </div>
        
        <div className="input-group">
          <label htmlFor="initialSmallBlind">Initial Small Blind:</label>
          <input
            type="number"
            id="initialSmallBlind"
            min="1"
            max="100"
            value={initialSmallBlind}
            onChange={(e) => setInitialSmallBlind(parseInt(e.target.value) || 5)}
          />
        </div>
        
        <h4>Presets</h4>
        <div className="button-group">
          <button onClick={() => handlePresetDuration(1)}>Quick Game (1h)</button>
          <button onClick={() => handlePresetDuration(2)}>Standard (2h)</button>
          <button onClick={() => handlePresetDuration(4)}>Tournament (4h)</button>
          <button onClick={() => handlePresetDuration(6)}>Long Event (6h)</button>
        </div>
      </div>

      {error ? (
        <div className="input-section" style={{ color: 'red' }}>
          <p>{error}</p>
        </div>
      ) : (
        <>
          <div className="input-section">
            <h3>Tournament Summary</h3>
            <p>Total chips needed: <strong>{totalChips.toLocaleString()}</strong></p>
            <p>Number of blind levels: <strong>{blindStructure.length}</strong></p>
            <p>Level duration: <strong>{blindStructure.length > 0 ? blindStructure[0].durationMinutes : 0} minutes</strong></p>
          </div>
          
          <div className="output-section">
            <h3>Blind Structure</h3>
            <table>
              <thead>
                <tr>
                  <th>Level</th>
                  <th>Start Time</th>
                  <th>Small Blind</th>
                  <th>Big Blind</th>
                </tr>
              </thead>
              <tbody>
                {blindStructure.map((level) => (
                  <tr key={level.level}>
                    <td>{level.level}</td>
                    <td>{level.startTime}</td>
                    <td>{level.smallBlind}</td>
                    <td>{level.bigBlind}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="input-section">
            <h3>Tips</h3>
            <ul style={{ paddingLeft: '20px' }}>
              <li>For home games, 15-20 minute blind levels work well</li>
              <li>A good starting stack should allow players to play at least 30-40 hands</li>
              <li>Consider adding antes in later levels to increase pot sizes</li>
              <li>Use our <a href="/calculator">Chip Calculator</a> to determine optimal chip distribution</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}