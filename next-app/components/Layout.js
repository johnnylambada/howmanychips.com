import Head from 'next/head';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';

export default function Layout({ children, title = 'Poker Chip Calculator', description = 'Plan your poker game with ease—calculate chip distributions for any number of players and buy-ins!' }) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <div className="page-content">
        <div className="container">
          <div className="main-content">
            <div className="content-area">
              {children}
            </div>
            <Sidebar />
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}