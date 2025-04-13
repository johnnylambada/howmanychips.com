import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
  const [showMore, setShowMore] = useState(false);

  return (
    <div>
        <div className="input-section">
          <h2>Welcome to How Many Chips</h2>
          <p>
            Planning a poker game but not sure how to distribute your chips? You've come to the right place!
          </p>
          <p>
            Our calculator helps you figure out the optimal chip distribution for your home poker game.
          </p>

          <div className="button-group" style={{ marginTop: '20px' }}>
            <Link href="/calculator" legacyBehavior>
              <a><button>Chip Calculator</button></a>
            </Link>
            {' '}
            <Link href="/blind-structure" legacyBehavior>
              <a><button>Blind Structure</button></a> 
            </Link>
            {' '}
          <Link href="/payout-calculator" legacyBehavior>
              <a><button>Payout Calculator</button></a>
            </Link>
          </div>
        </div>
        
        <div className="input-section">
          <h3>Why use a poker chip calculator?</h3>
          <p>A good chip distribution is essential for a smooth poker game:</p>
          <ul style={{ paddingLeft: '20px', marginBottom: '20px' }}>
            <li>Ensure you have enough chips for all players</li>
            <li>Distribute chips evenly among players</li>
            <li>Calculate fractional buy-ins for tournament play</li>
            <li>Optimize your chip colors based on available quantities</li>
          </ul> 

          {showMore ? (
            <>
              <h3>More About Poker Chips</h3>
              <p>
                Most home poker games use a standard set of chips in various colors, each representing
                a different value. Common chip values include:
              </p>
              <ul style={{ paddingLeft: '20px', marginBottom: '20px' }}>
                <li>White: $1</li>
                <li>Red: $5</li>
                <li>Blue: $10</li>
                <li>Green: $25 or $50</li>
                <li>Black: $100</li>
              </ul>
              <p>
                With our calculator, you can customize your chip values and quantities to match 
                your actual collection.
              </p>
              <button onClick={() => setShowMore(false)}>Show Less</button>
            </>
          ) : (
            <button onClick={() => setShowMore(true)}>Show More</button>
          )}
        </div>
      </div>
  );
}