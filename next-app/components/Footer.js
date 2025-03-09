import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer>
      <div className="footer-content">
        <p>
          &copy; {currentYear} HowManyChips.com | 
          <span className="footer-links">
            <Link href="/" legacyBehavior><a>Home</a></Link> | 
            <Link href="/calculator" legacyBehavior><a>Chip Calculator</a></Link> | 
            <Link href="/blind-structure" legacyBehavior><a>Blind Structure</a></Link> | 
            <Link href="/payout-calculator" legacyBehavior><a>Payout Calculator</a></Link> | 
            <Link href="/about" legacyBehavior><a>About</a></Link>
          </span>
        </p>
        <div className="footer-logo">
          <Image src="/poker-chips.svg" alt="Poker Chips" width={25} height={25} />
        </div>
      </div>
    </footer>
  );
}