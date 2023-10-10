// src/app/_app.js

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactGA from 'react-ga';

ReactGA.initialize('XXXXX');
ReactGA.pageview("index");

function App({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
  }, [router.events]);

  return (
    <div className="container-fluid">
      <Component {...pageProps} />
    </div>
  );
}

export default App;
