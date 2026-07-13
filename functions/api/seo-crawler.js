export async function onRequestPost(context) {
  try {
    const { url } = await context.request.json();
    
    if (!url || typeof url !== 'string') {
      return new Response(JSON.stringify({ success: false, error: 'Please enter a valid website URL.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Clean up domain/url formatting
    let targetUrl = url.trim();
    if (!/^https?:\/\//i.test(targetUrl)) {
      targetUrl = 'https://' + targetUrl;
    }

    // Set a strict 6-second fetch timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(targetUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5'
      }
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: `Could not complete crawl: Server returned status code ${response.status}` 
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const html = await response.text();

    // 1. Title Extraction
    const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1].replace(/<[^>]*>/g, '').trim() : '';

    // 2. Description Extraction
    let description = '';
    const descRegexes = [
      /<meta[^>]*name=["']description["'][^>]*content=["']([\s\S]*?)["'][^>]*>/i,
      /<meta[^>]*content=["']([\s\S]*?)["'][^>]*name=["']description["'][^>]*>/i,
      /<meta[^>]*property=["']og:description["'][^>]*content=["']([\s\S]*?)["'][^>]*>/i
    ];
    for (const r of descRegexes) {
      const match = html.match(r);
      if (match && match[1]) {
        description = match[1].trim();
        break;
      }
    }

    // 3. Canonical Tag Extraction
    const canonicalMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([\s\S]*?)["'][^>]*>/i);
    const canonical = canonicalMatch ? canonicalMatch[1].trim() : '';

    // 4. Schema JSON-LD detection
    const hasSchema = html.toLowerCase().includes('application/ld+json');

    // 5. Heading Extraction (H1s & H2s)
    const h1s = [];
    const h1Regex = /<h1[^>]*>([\s\S]*?)<\/h1>/gi;
    let match;
    while ((match = h1Regex.exec(html)) !== null) {
      const text = match[1].replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
      if (text) h1s.push(text);
    }

    const h2s = [];
    const h2Regex = /<h2[^>]*>([\s\S]*?)<\/h2>/gi;
    while ((match = h2Regex.exec(html)) !== null) {
      const text = match[1].replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
      if (text) h2s.push(text);
    }

    // 6. Image & Alt Tags Audit
    let totalImages = 0;
    let missingAltCount = 0;
    const imgRegex = /<img[^>]*>/gi;
    const imgMatches = html.match(imgRegex) || [];
    totalImages = imgMatches.length;

    imgMatches.forEach(imgHtml => {
      const altMatch = imgHtml.match(/alt=["']([\s\S]*?)["']/i);
      if (!altMatch || !altMatch[1].trim()) {
        missingAltCount++;
      }
    });

    return new Response(JSON.stringify({
      success: true,
      url: targetUrl,
      title,
      description,
      canonical,
      hasSchema,
      h1s,
      h2s,
      totalImages,
      missingAltCount,
      pageSizeBytes: html.length
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    let errorMsg = 'An error occurred while crawling the website.';
    if (err.name === 'AbortError') {
      errorMsg = 'Target website took too long to load. Request timed out after 6 seconds.';
    } else if (err.message.includes('fetch failed')) {
      errorMsg = 'Could not resolve domain name. Check the website URL and try again.';
    } else {
      errorMsg = err.message;
    }

    return new Response(JSON.stringify({ success: false, error: errorMsg }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
