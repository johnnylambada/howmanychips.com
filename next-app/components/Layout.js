import Head from "next/head";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout({
  children,
  title = "Poker Chip Calculator",
  description = "Plan your poker game with ease—calculate chip distributions for any number of players and buy-ins!",
}) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/poker-chips.svg" />
      </Head>
      <div className="d-flex flex-column min-vh-100">
        <header className="sticky-top bg-danger">
          <Header />
        </header>
        <div className="content-container flex-grow-1 bg-success d-flex justify-content-center">
          <div className="article-container">
            <article className="bg-white mt-3 mb-3 p-3">
              <main>
                <div className="content-area">{children}</div>
              </main>
            </article>          
          </div>
        </div>
        <footer className="sticky-bottom bg-primary">
          <Footer />
        </footer>
      </div>
    </>
  );
}