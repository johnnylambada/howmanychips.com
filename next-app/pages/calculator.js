import ChipCalculator from '../components/ChipCalculator';

export default function CalculatorPage() {
  return (
    <div>
      <div className="input-section">
        <h2>Poker Chip Calculator</h2>
        <p>Use this calculator to determine the optimal chip distribution for your poker game.</p>
      </div>
      
      <ChipCalculator />
    </div>
  );
}