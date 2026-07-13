export async function onRequestGet(context) {
  try {
    const url = new URL(context.request.url);
    const id = url.searchParams.get('id');

    if (!id || typeof id !== 'string') {
      return new Response(JSON.stringify({ success: false, error: 'Invalid or missing report ID.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const kv = context.env.SEO_REPORTS_KV;
    if (!kv) {
      // Mock lookup fallback for local development or missing KV bindings
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Key-Value storage binding (SEO_REPORTS_KV) is not configured. Please bind a KV namespace in your Cloudflare dashboard.' 
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const reportData = await kv.get(`seo_report:${id}`);
    if (!reportData) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'This report has expired (reports are saved for 15 days) or does not exist. Please run a new scan.' 
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      success: true,
      report: JSON.parse(reportData)
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
