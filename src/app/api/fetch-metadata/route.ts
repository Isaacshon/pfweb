import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { url } = await request.json()
    
    if (!url) return NextResponse.json({ error: 'URL is required' }, { status: 400 })

    let fetchUrl = ''
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      fetchUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`
    } else if (url.includes('spotify.com')) {
      fetchUrl = `https://open.spotify.com/oembed?url=${encodeURIComponent(url)}`
    } else {
      return NextResponse.json({ error: 'Unsupported service' }, { status: 400 })
    }

    const response = await fetch(fetchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    })
    
    if (!response.ok) {
      console.error(`Fetch failed for ${fetchUrl}: ${response.status}`)
      throw new Error(`Failed to fetch metadata: ${response.status}`)
    }
    
    const data = await response.json()
    
    // Some oEmbed APIs return different structures
    const title = data.title || data.name || ''
    const artist = data.author_name || data.artist_name || ''

    return NextResponse.json({
      title: title.trim(),
      artist: artist.trim(),
      thumbnail: data.thumbnail_url || ''
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
