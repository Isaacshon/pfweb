import { NextResponse } from 'next/server'

// Helper: Parse YouTube-style titles like "Artist - Song Title (Official Video)"
function parseYouTubeTitle(rawTitle: string): { title: string; artist: string } {
  let cleaned = rawTitle
    .replace(/\s*[\(\[]?(official\s*(music\s*)?video|official\s*audio|official\s*lyric\s*video|lyric\s*video|lyrics?|mv|m\/v|audio|live|공식\s*뮤직비디오)[\)\]]?\s*/gi, '')
    .replace(/\s*[\(\[].*?[\)\]]\s*$/g, '')
    .trim()

  if (cleaned.includes(' - ')) {
    const parts = cleaned.split(' - ')
    return { artist: parts[0].trim(), title: parts.slice(1).join(' - ').trim() }
  }
  if (cleaned.toLowerCase().includes(' by ')) {
    const parts = cleaned.split(/\sby\s/i)
    return { title: parts[0].trim(), artist: parts.slice(1).join(' by ').trim() }
  }
  return { title: cleaned, artist: '' }
}

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'

// Extract Spotify playlist tracks by parsing the embed page HTML
async function extractSpotifyPlaylistTracks(playlistId: string) {
  try {
    // Fetch the embed page which contains track data
    const embedUrl = `https://open.spotify.com/embed/playlist/${playlistId}`
    const res = await fetch(embedUrl, {
      headers: { 'User-Agent': UA, 'Accept': 'text/html' }
    })
    if (!res.ok) return null

    const html = await res.text()

    // Try to find JSON data in the HTML
    // Spotify embed pages contain track data in various formats
    const tracks: { title: string; artist: string; thumbnail: string }[] = []

    // Method 1: Look for resourceEntities or trackList in embedded scripts
    const scriptMatches = html.match(/<script[^>]*>([\s\S]*?)<\/script>/gi)
    if (scriptMatches) {
      for (const script of scriptMatches) {
        const content = script.replace(/<\/?script[^>]*>/gi, '')
        
        // Look for track data patterns
        if (content.includes('"track"') || content.includes('"name"')) {
          try {
            // Try to find JSON objects with track data
            const jsonMatches = content.match(/\{[^{}]*"name"\s*:\s*"[^"]+?"[^{}]*"artists?"[^{}]*\}/g)
            if (jsonMatches) {
              for (const jsonStr of jsonMatches) {
                try {
                  const obj = JSON.parse(jsonStr)
                  if (obj.name) {
                    tracks.push({
                      title: obj.name,
                      artist: Array.isArray(obj.artists) 
                        ? obj.artists.map((a: any) => a.name).join(', ')
                        : (obj.artist || ''),
                      thumbnail: obj.coverArt?.sources?.[0]?.url || obj.images?.[0]?.url || ''
                    })
                  }
                } catch {}
              }
            }
          } catch {}
        }
      }
    }

    // Method 2: If above didn't work, try to extract from meta tags and structured data
    if (tracks.length === 0) {
      // Look for og:description which sometimes lists tracks
      const descMatch = html.match(/<meta[^>]*property="og:description"[^>]*content="([^"]*)"/)
      const titleMatch = html.match(/<meta[^>]*property="og:title"[^>]*content="([^"]*)"/)
      const imgMatch = html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]*)"/)
      
      if (descMatch) {
        // Spotify descriptions often list songs
        const desc = descMatch[1]
        // Split by common separators and extract track info
        const items = desc.split(/[·•,]/).map(s => s.trim()).filter(Boolean)
        for (const item of items) {
          if (item.length > 2 && item.length < 100) {
            tracks.push({ title: item, artist: '', thumbnail: imgMatch?.[1] || '' })
          }
        }
      }
    }

    return tracks.length > 0 ? tracks : null
  } catch (err) {
    console.error('Spotify playlist extraction error:', err)
    return null
  }
}

export async function POST(request: Request) {
  try {
    const { url } = await request.json()
    if (!url) return NextResponse.json({ error: 'URL is required' }, { status: 400 })

    const isPlaylist = url.includes('playlist') || url.includes('list=')
    let source: 'youtube' | 'spotify' = 'youtube'

    if (url.includes('spotify.com')) source = 'spotify'

    // ===== PLAYLIST HANDLING =====
    if (isPlaylist) {
      if (source === 'spotify') {
        const playlistId = url.match(/playlist\/([a-zA-Z0-9]+)/)?.[1]
        
        if (playlistId) {
          // Try to extract individual tracks
          const tracks = await extractSpotifyPlaylistTracks(playlistId)
          
          if (tracks && tracks.length > 0) {
            return NextResponse.json({
              type: 'playlist',
              tracks: tracks.map(t => ({
                title: t.title,
                artist: t.artist,
                thumbnail: t.thumbnail
              }))
            })
          }
          
          // Fallback: use oEmbed for at least the playlist name
          const oembedUrl = `https://open.spotify.com/oembed?url=${encodeURIComponent(url)}`
          const oembedRes = await fetch(oembedUrl, { headers: { 'User-Agent': UA } })
          if (oembedRes.ok) {
            const data = await oembedRes.json()
            return NextResponse.json({
              type: 'playlist',
              playlistTitle: data.title || 'Spotify Playlist',
              thumbnail: data.thumbnail_url || '',
              tracks: [] // No individual tracks available
            })
          }
        }
      }
      
      // YouTube playlist - use oEmbed for title
      if (source === 'youtube') {
        const normalized = url.replace('music.youtube.com', 'www.youtube.com')
        const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(normalized)}&format=json`
        const res = await fetch(oembedUrl, { headers: { 'User-Agent': UA } })
        if (res.ok) {
          const data = await res.json()
          return NextResponse.json({
            type: 'playlist',
            playlistTitle: data.title || 'YouTube Playlist',
            thumbnail: data.thumbnail_url || '',
            tracks: []
          })
        }
      }

      return NextResponse.json({ type: 'playlist', tracks: [], playlistTitle: 'Playlist' })
    }

    // ===== SINGLE TRACK HANDLING =====
    let fetchUrl = ''
    if (url.includes('youtube.com') || url.includes('youtu.be') || url.includes('music.youtube.com')) {
      const normalized = url.replace('music.youtube.com', 'www.youtube.com')
      fetchUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(normalized)}&format=json`
      source = 'youtube'
    } else if (url.includes('spotify.com')) {
      fetchUrl = `https://open.spotify.com/oembed?url=${encodeURIComponent(url)}`
      source = 'spotify'
    } else {
      return NextResponse.json({ error: 'Unsupported service' }, { status: 400 })
    }

    const response = await fetch(fetchUrl, { headers: { 'User-Agent': UA } })
    if (!response.ok) {
      return NextResponse.json({ error: `Could not fetch metadata (HTTP ${response.status})` }, { status: 502 })
    }

    const data = await response.json()
    let title = ''
    let artist = ''
    const thumbnail = data.thumbnail_url || ''

    if (source === 'youtube') {
      const parsed = parseYouTubeTitle(data.title || '')
      title = parsed.title || data.title || ''
      artist = parsed.artist || data.author_name || ''
    } else {
      title = data.title || ''
      artist = data.author_name || ''
      if (title.includes(' - ')) {
        const parts = title.split(' - ')
        title = parts[0].trim()
        if (!artist) artist = parts[1]?.trim() || ''
      }
    }

    return NextResponse.json({
      type: 'track',
      title: title.trim(),
      artist: artist.trim(),
      thumbnail
    })
  } catch (error: any) {
    console.error('Metadata extraction error:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
