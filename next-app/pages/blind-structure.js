import BlindStructureCalculator from '../components/BlindStructureCalculator';

export default function BlindStructurePage() {
  return (
    <div>
      <div className="input-section">
        <h2>Poker Blind Structure Generator</h2>
        <p>
          Create a professional blind structure for your home poker game or tournament.
          Simply enter the number of players, starting chip stack, and desired tournament length.
        </p>
      </div>
      
      <BlindStructureCalculator />
    </div>
  );
}