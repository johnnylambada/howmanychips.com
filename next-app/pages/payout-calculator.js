import PayoutCalculator from '../components/PayoutCalculator';

export default function PayoutCalculatorPage() {
  return (
    <div>
      <div className="input-section">
        <h2>Tournament Payout Calculator</h2>
        <p>
          Calculate prize pool distributions for your poker tournament quickly and easily.
          Simply enter the number of players, buy-in amount, and select a payout structure.
        </p>
      </div>
      
      <PayoutCalculator />
    </div>
  );
}