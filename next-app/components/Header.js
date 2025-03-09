import { useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  return (
    <header>
      <div className="header-content">
        <div className="logo">
          <div className="logo-img">
            <img src="/poker-chips.svg" alt="Poker Chips" width={30} height={30} />
          </div>
          <h1>HowManyChips.com</h1>
        </div>
        
        <div className="nav-links">
          <Link href="/" legacyBehavior><a>Home</a></Link>
          <Link href="/calculator" legacyBehavior><a>Chip Calculator</a></Link>
          <Link href="/blind-structure" legacyBehavior><a>Blind Structure</a></Link>
          <Link href="/payout-calculator" legacyBehavior><a>Payout Calculator</a></Link>
          <Link href="/about" legacyBehavior><a>About</a></Link>
        </div>
        
        <div className="hamburger-menu" onClick={toggleMobileMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>
        
        {mobileMenuOpen && (
          <div className="mobile-menu">
            <Link href="/" legacyBehavior><a onClick={toggleMobileMenu}>Home</a></Link>
            <Link href="/calculator" legacyBehavior><a onClick={toggleMobileMenu}>Chip Calculator</a></Link>
            <Link href="/blind-structure" legacyBehavior><a onClick={toggleMobileMenu}>Blind Structure</a></Link>
            <Link href="/payout-calculator" legacyBehavior><a onClick={toggleMobileMenu}>Payout Calculator</a></Link>
            <Link href="/about" legacyBehavior><a onClick={toggleMobileMenu}>About</a></Link>
          </div>
        )}
      </div>
    </header>
  );
}