import { NextResponse } from 'next/server'

// Helper: Parse YouTube-style titles like "Artist - Song Title (Official Video)"
function parseYouTubeTitle(rawTitle: string): { title: string; artist: string } {
  // Remove common suffixes
  let cleaned = rawTitle
    .replace(/\s*[\(\[]?(official\s*(music\s*)?video|official\s*audio|official\s*lyric\s*video|lyric\s*video|lyrics?|mv|m\/v|audio|live|공식\s*뮤직비디오)[\)\]]?\s*/gi, '')
    .replace(/\s*[\(\[].*?[\)\]]\s*$/g, '')
    .trim()

  // Try "Artist - Title" pattern
  if (cleaned.includes(' - ')) {
    const parts = cleaned.split(' - ')
    return { artist: parts[0].trim(), title: parts.slice(1).join(' - ').trim() }
  }
  // Try "Title by Artist"
  if (cleaned.toLowerCase().includes(' by ')) {
    const parts = cleaned.split(/\sby\s/i)
    return { title: parts[0].trim(), artist: parts.slice(1).join(' by ').trim() }
  }
  return { title: cleaned, artist: '' }
}

export async function POST(request: Request) {
  try {
    const { url } = await request.json()
    if (!url) return NextResponse.json({ error: 'URL is required' }, { status: 400 })

    let fetchUrl = ''
    let source: 'youtube' | 'spotify' = 'youtube'

    // YouTube + YouTube Music
    if (url.includes('youtube.com') || url.includes('youtu.be') || url.includes('music.youtube.com')) {
      // Normalize YouTube Music URLs to standard YouTube for oEmbed
      const normalized = url.replace('music.youtube.com', 'www.youtube.com')
      fetchUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(normalized)}&format=json`
      source = 'youtube'
    } else if (url.includes('spotify.com')) {
      fetchUrl = `https://open.spotify.com/oembed?url=${encodeURIComponent(url)}`
      source = 'spotify'
    } else {
      return NextResponse.json({ error: 'Unsupported service. Use YouTube, YouTube Music, or Spotify links.' }, { status: 400 })
    }

    const response = await fetch(fetchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
      }
    })

    if (!response.ok) {
      console.error(`oEmbed fetch failed: ${response.status} for ${fetchUrl}`)
      return NextResponse.json({ error: `Could not fetch metadata (HTTP ${response.status})` }, { status: 502 })
    }

    const data = await response.json()

    let title = ''
    let artist = ''
    const thumbnail = data.thumbnail_url || ''

    if (source === 'youtube') {
      // YouTube oEmbed: title = full video title, author_name = channel name
      const parsed = parseYouTubeTitle(data.title || '')
      title = parsed.title || data.title || ''
      artist = parsed.artist || data.author_name || ''
    } else {
      // Spotify oEmbed: title = track/album name, but we need to extract artist
      const rawTitle = data.title || ''
      // Spotify oEmbed title format is often just the track name
      title = rawTitle
      // Spotify doesn't provide author_name for tracks via oEmbed,
      // but it does include it in the HTML embed description
      artist = data.author_name || ''

      // For Spotify, try to get a cleaner title if it contains " - "
      if (rawTitle.includes(' - ')) {
        const parts = rawTitle.split(' - ')
        title = parts[0].trim()
        if (!artist) artist = parts[1]?.trim() || ''
      }
    }

    return NextResponse.json({
      title: title.trim(),
      artist: artist.trim(),
      thumbnail: thumbnail,
      source: source
    })
  } catch (error: any) {
    console.error('Metadata extraction error:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
