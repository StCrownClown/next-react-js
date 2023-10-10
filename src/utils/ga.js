// src/utils/ga.js

import ReactGA from 'react-ga4';

export const initGA = () => {
  ReactGA.initialize('XXXXX');
}

export const logPageView = () => {
  ReactGA.pageview(window.location.pathname + window.location.search);
}

export const eventGA = (action, params) => {
  if (typeof window !== "undefined") {
    window.gtag('event', action, params);
  }
};

export const logEvent = (action, category, label, value) => {
  ReactGA.event({
    action,
    category,
    label,
    value
  });
}

export function loadGoogleAnalytics() {
  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = "https://www.googletagmanager.com/gtag/js?id=XXXXX";
  document.head.appendChild(script1);

  const script2 = document.createElement('script');
  script2.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'XXXXX');
  `;
  document.head.appendChild(script2);
}