/**
 * NetGenius Consult - Centralized Analytics & Marketing Pixel System
 * Supports Google Analytics 4 (GA4), Meta Pixel (Facebook Pixel), and LinkedIn Insight Tag.
 * Reads configurations dynamically from Vite environment variables (VITE_*) with safe fallback checks.
 */

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || '';
const META_ID = import.meta.env.VITE_META_PIXEL_ID || '';
const LINKEDIN_ID = import.meta.env.VITE_LINKEDIN_PARTNER_ID || '';

/**
 * Initialize all marketing scripts and inject them into the DOM
 */
export function initTracking() {
  console.log('[NetGenius Analytics] Initializing tracking pixels...');

  // 1. Google Analytics 4 (GA4) Integration
  if (GA_ID) {
    console.log(`[NetGenius Analytics] Loading GA4 (${GA_ID})...`);
    const gaScript = document.createElement('script');
    gaScript.async = true;
    gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(gaScript);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID, {
      page_path: window.location.pathname + window.location.hash
    });
  } else {
    console.warn('[NetGenius Analytics] GTM/GA4 Measurement ID is missing. Define VITE_GA_MEASUREMENT_ID in your .env file.');
  }

  // 2. Meta Pixel (Facebook Pixel) Integration
  if (META_ID) {
    console.log(`[NetGenius Analytics] Loading Meta Pixel (${META_ID})...`);
    (function (f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = !0;
      n.version = '2.0';
      n.queue = [];
      t = b.createElement(e);
      t.async = !0;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

    window.fbq('init', META_ID);
    window.fbq('track', 'PageView');
  } else {
    console.warn('[NetGenius Analytics] Meta Pixel ID is missing. Define VITE_META_PIXEL_ID in your .env file.');
  }

  // 3. LinkedIn Insight Tag Integration
  if (LINKEDIN_ID) {
    console.log(`[NetGenius Analytics] Loading LinkedIn Insight Tag (${LINKEDIN_ID})...`);
    window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
    window._linkedin_data_partner_ids.push(LINKEDIN_ID);

    (function (l) {
      if (!l) return;
      const s = document.getElementsByTagName('script')[0];
      const b = document.createElement('script');
      b.type = 'text/javascript';
      b.async = true;
      b.src = 'https://snap.licdn.com/li.lms-analytics/insight.min.js';
      s.parentNode.insertBefore(b, s);
    })(window._linkedin_data_partner_ids);
  } else {
    console.warn('[NetGenius Analytics] LinkedIn Partner ID is missing. Define VITE_LINKEDIN_PARTNER_ID in your .env file.');
  }
}

/**
 * Trigger page view event (useful for single-page routing updates)
 */
export function trackPageView(path) {
  console.log(`[NetGenius Analytics] Tracking page view: ${path}`);
  
  if (GA_ID && window.gtag) {
    window.gtag('event', 'page_view', {
      page_path: path
    });
  }

  if (META_ID && window.fbq) {
    window.fbq('track', 'PageView');
  }
}

/**
 * Trigger Lead / Form Booking Conversion Event
 * @param {string} serviceName - Name of the service booked (e.g. 'seo', 'ppc')
 */
export function trackLeadEvent(serviceName) {
  console.log(`[NetGenius Analytics] LEAD CONVERSION EVENT TRIGGERED! Service: ${serviceName}`);

  // GA4 Conversion
  if (GA_ID && window.gtag) {
    window.gtag('event', 'generate_lead', {
      event_category: 'engagement',
      event_label: serviceName,
      value: 1.0,
      currency: 'GBP'
    });
  }

  // Meta Pixel Conversion
  if (META_ID && window.fbq) {
    window.fbq('track', 'Lead', {
      content_name: 'Consultation Booking',
      content_category: serviceName,
      value: 1.0,
      currency: 'GBP'
    });
  }

  // LinkedIn Insight tag tracks conversions via custom URL paths or partner actions automatically,
  // but we log it here for direct pipeline validation.
  if (LINKEDIN_ID) {
    console.log(`[NetGenius Analytics] LinkedIn Insight logged conversion for Partner ID: ${LINKEDIN_ID}`);
  }
}

/**
 * Dispatch server-to-server lead event via Cloudflare Pages Function (Meta Conversions API)
 * @param {object} param0 - Leads dataset { name, email, phone, service }
 */
export async function trackServerLead({ name, email, phone, service }) {
  console.log('[NetGenius Analytics] Initiating secure server-to-server Meta CAPI request...');
  try {
    const response = await fetch('/api/track-lead', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        email,
        phone,
        service,
        url: window.location.href,
        userAgent: navigator.userAgent
      })
    });
    const result = await response.json();
    console.log('[NetGenius Analytics] Server CAPI response:', result);
  } catch (error) {
    console.error('[NetGenius Analytics] Server CAPI failed:', error);
  }
}
