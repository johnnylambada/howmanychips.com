import { useEffect } from 'react';
import Head from 'next/head';

export default function Footer() {
  useEffect(() => {
    // Initialize AdSense ads after component mounts
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }, []);

  return (
    <>
      <Head>
        {/* AdSense script in Head */}
        <script 
          async 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2535381193236595"
          crossOrigin="anonymous"
        />
      </Head>
      <footer>
        <div className="footer-ad-container">
          <ins className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client="ca-pub-2535381193236595"
            data-ad-slot="3940256099" 
            data-ad-format="auto"
            data-full-width-responsive="true">
          </ins>
        </div>
      </footer>
    </>
  );
}
