const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'

async function test() {
  const trackId = '60K8IlSVcKAzVkoiWRitGs';
  const res = await fetch(`https://open.spotify.com/embed/track/${trackId}`, {
    headers: { 'User-Agent': UA, 'Accept': 'text/html' }
  });
  const html = await res.text();
  const match = html.match(/<script\s+id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
  const data = JSON.parse(match[1]);
  const entity = data?.props?.pageProps?.state?.data?.entity;
  
  // Print ALL keys of entity
  console.log('Entity keys:', Object.keys(entity || {}));
  console.log('\nFull entity (first 2000 chars):');
  console.log(JSON.stringify(entity, null, 2).substring(0, 2000));
}

test().catch(console.error);
