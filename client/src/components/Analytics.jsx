import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

export default function Analytics() {
  const gaId = import.meta.env.VITE_GA_ID;
  const pixelId = import.meta.env.VITE_FB_PIXEL_ID;
  const location = useLocation();

  useEffect(() => {
    // Track our custom internal page views
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path: location.pathname,
        userAgent: navigator.userAgent
      })
    }).catch(err => console.error('Failed to track view', err));
  }, [location.pathname]);

  return (
    <Helmet>
      {/* Google Analytics */}
      {gaId && (
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}></script>
      )}
      {gaId && (
        <script>
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}');
          `}
        </script>
      )}

      {/* Facebook Pixel */}
      {pixelId && (
        <script>
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${pixelId}');
            fbq('track', 'PageView');
          `}
        </script>
      )}
      {pixelId && (
        <noscript>
          {`<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1" />`}
        </noscript>
      )}
    </Helmet>
  );
}
