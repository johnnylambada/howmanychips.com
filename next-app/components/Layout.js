import Head from 'next/head';
import Link from 'next/link';

export default function Layout({ children, title = 'Poker Chip Calculator', description = 'Plan your poker game with ease—calculate chip distributions for any number of players and buy-ins!' }) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header>
        <div className="container">
          <h1>How Many Chips?</h1>
          <p>Plan your poker game with ease—calculate chip distributions for any number of players and buy-ins!</p>
        </div>
      </header>

      <main className="container">
        {children}
      </main>

      <footer>
        <div className="container">
          <p>&copy; {new Date().getFullYear()} How Many Chips. All rights reserved.</p>
          <nav>
            <Link href="/">Home</Link> | 
            <Link href="/calculator"> Chip Calculator</Link> | 
            <Link href="/about"> About</Link>
          </nav>
        </div>
      </footer>
    </>
  );
}