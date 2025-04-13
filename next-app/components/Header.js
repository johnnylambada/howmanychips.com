import Link from 'next/link';

export default function Header() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark w-100">
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center w-100">
          <div className="d-flex align-items-center">
            <Link className="navbar-brand" href="/" legacyBehavior>
              <a className="d-flex align-items-center">
                <div className="logo-img">
                  <img src="/poker-chips.svg" alt="Poker Chips" width={30} height={30} />
                </div>
                <h1 className="ms-2 mb-0">HowManyChips.com</h1>
              </a>
            </Link>
          </div>
          <div className="d-flex align-items-center w-100 justify-content-end">
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse w-100" id="navbarNav">
              <div className="navbar-nav w-100 justify-content-end">
                <Link href="/" legacyBehavior><a className="nav-link mx-3">Home</a></Link>
                <Link href="/calculator" legacyBehavior><a className="nav-link mx-3">Chip Calculator</a></Link>
                <Link href="/blind-structure" legacyBehavior><a className="nav-link mx-3">Blind Structure</a></Link>
                <Link href="/payout-calculator" legacyBehavior><a className="nav-link mx-3">Payout Calculator</a></Link>
                <Link href="/about" legacyBehavior><a className="nav-link mx-3">About</a></Link>
              </div>
                    </div>
                </div>
            </div>
        </div>
    </nav>
  );
}
