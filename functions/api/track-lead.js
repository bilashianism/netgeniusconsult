/**
 * Cloudflare Pages Serverless Function - Meta Conversions API (CAPI) Lead Tracker
 * Endpoint: POST /api/track-lead
 * Securely hashes customer data and sends server-to-server lead events to Meta
 * without exposing your System Access Token to the client browser.
 */

// Helper function to calculate SHA-256 hash using the Web Crypto API
async function sha256(message) {
  if (!message) return '';
  const msgBuffer = new TextEncoder().encode(message.trim().toLowerCase());
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function onRequestPost(context) {
  const PIXEL_ID = '2895764074113054';
  
  // Use environment variable if available in Cloudflare, otherwise fall back to system token
  const ACCESS_TOKEN = context.env.META_ACCESS_TOKEN || 'EAASR0fwIFpYBR94k3WZB5QMMuTtv3QXAZChWjns09cUHoqCKjLR3xdNjXcAPM0vd3eID00dDnXbNu52SLZC2oXwGJWFzI9DO8ZCZCyu2PE0R1XZBuzRpRKjQw6crYKAcL3SwAu0ZBFRbrKsCsaHC7cgAVRgnpLOuwV1UJ1ahjsE6S5PCV3VS4KjZAL2HpHxmJAZDZD';

  try {
    const requestData = await context.request.json();
    const { name, email, phone, service, url, userAgent, clientIp } = requestData;

    if (!email) {
      return new Response(JSON.stringify({ error: 'Email is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Hash PII data on server-side to meet Meta's privacy and matching standards
    const hashedEmail = await sha256(email);
    const hashedPhone = phone ? await sha256(phone) : '';
    
    // Extract first name if full name is provided
    const firstName = name ? name.split(' ')[0] : '';
    const hashedFirstName = firstName ? await sha256(firstName) : '';

    const payload = {
      data: [
        {
          event_name: 'Lead',
          event_time: Math.floor(Date.now() / 1000),
          action_source: 'website',
          event_source_url: url || 'https://netgeniusconsult.co.uk/',
          user_data: {
            em: [hashedEmail],
            ...(hashedPhone && { ph: [hashedPhone] }),
            ...(hashedFirstName && { fn: [hashedFirstName] }),
            client_user_agent: userAgent || context.request.headers.get('user-agent'),
            client_ip_address: clientIp || context.request.headers.get('cf-connecting-ip')
          },
          custom_data: {
            content_category: service || 'general',
            value: 1.0,
            currency: 'GBP'
          }
        }
      ],
      test_event_code: 'TEST59759',
      access_token: ACCESS_TOKEN
    };

    // Forward the conversion event to Meta Conversions API
    const metaResponse = await fetch(`https://graph.facebook.com/v19.0/${PIXEL_ID}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const metaResult = await metaResponse.json();

    return new Response(JSON.stringify({ success: true, metaResult }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
