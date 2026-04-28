import { NextResponse } from 'next/server'

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'

// ===== SPOTIFY AUTH (Client Credentials Flow) =====
async function getSpotifyToken(): Promise<string | null> {
  const clientId = process.env.SPOTIFY_CLIENT_ID
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET
  if (!clientId || !clientSecret) return null

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64')
    },
    body: 'grant_type=client_credentials'
  })

  if (!res.ok) return null
  const data = await res.json()
  return data.access_token || null
}

// ===== SPOTIFY: Get Playlist Tracks =====
async function getSpotifyPlaylistTracks(playlistId: string, token: string) {
  const res = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}?fields=name,images,tracks.items(track(name,artists(name),album(images)))`, {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  if (!res.ok) return null
  const data = await res.json()

  const tracks = data.tracks?.items
    ?.filter((item: any) => item.track)
    .map((item: any) => ({
      title: item.track.name,
      artist: item.track.artists?.map((a: any) => a.name).join(', ') || '',
      thumbnail: item.track.album?.images?.[0]?.url || ''
    })) || []

  return {
    playlistTitle: data.name || 'Spotify Playlist',
    thumbnail: data.images?.[0]?.url || '',
    tracks
  }
}

// ===== SPOTIFY: Get Single Track =====
async function getSpotifyTrack(trackId: string, token: string) {
  const res = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  if (!res.ok) return null
  const data = await res.json()

  return {
    title: data.name || '',
    artist: data.artists?.map((a: any) => a.name).join(', ') || '',
    thumbnail: data.album?.images?.[0]?.url || ''
  }
}

// ===== YOUTUBE: Get Playlist Tracks by parsing page HTML =====
async function getYouTubePlaylistTracks(listId: string) {
  try {
    const res = await fetch(`https://www.youtube.com/playlist?list=${listId}`, {
      headers: {
        'User-Agent': UA,
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept': 'text/html,application/xhtml+xml'
      }
    })
    if (!res.ok) return null

    const html = await res.text()

    // Extract ytInitialData JSON embedded in the page
    const match = html.match(/var\s+ytInitialData\s*=\s*(\{.+?\});\s*<\/script>/s)
    if (!match) return null

    const data = JSON.parse(match[1])

    // Get playlist title
    const playlistTitle = data?.metadata?.playlistMetadataRenderer?.title || 'YouTube Playlist'

    // Navigate to playlist video items
    const contents = data?.contents
      ?.twoColumnBrowseResultsRenderer?.tabs?.[0]
      ?.tabRenderer?.content
      ?.sectionListRenderer?.contents?.[0]
      ?.itemSectionRenderer?.contents?.[0]
      ?.playlistVideoListRenderer?.contents

    if (!contents || !Array.isArray(contents)) return { playlistTitle, tracks: [] }

    const tracks = contents
      .filter((item: any) => item.playlistVideoRenderer)
      .map((item: any) => {
        const video = item.playlistVideoRenderer
        const title = video.title?.runs?.[0]?.text || ''
        const artist = video.shortBylineText?.runs?.[0]?.text || ''
        const thumbnails = video.thumbnail?.thumbnails || []
        const thumbnail = thumbnails[thumbnails.length - 1]?.url || ''

        // Try to parse "Artist - Song" from the title
        const parsed = parseYouTubeTitle(title)

        return {
          title: parsed.title || title,
          artist: parsed.artist || artist,
          thumbnail
        }
      })

    return { playlistTitle, tracks }
  } catch (err) {
    console.error('YouTube playlist extraction error:', err)
    return null
  }
}

// ===== YOUTUBE: Parse title =====
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

// ===== MAIN HANDLER =====
export async function POST(request: Request) {
  try {
    const { url } = await request.json()
    if (!url) return NextResponse.json({ error: 'URL is required' }, { status: 400 })

    const isPlaylist = url.includes('playlist') || url.includes('list=')
    const isSpotify = url.includes('spotify.com')
    const isYouTube = url.includes('youtube.com') || url.includes('youtu.be') || url.includes('music.youtube.com')

    // ===== SPOTIFY =====
    if (isSpotify) {
      const token = await getSpotifyToken()

      if (isPlaylist) {
        const playlistId = url.match(/playlist\/([a-zA-Z0-9]+)/)?.[1]
        if (playlistId && token) {
          const result = await getSpotifyPlaylistTracks(playlistId, token)
          if (result) return NextResponse.json({ type: 'playlist', ...result })
        }
        return NextResponse.json({ type: 'playlist', tracks: [], playlistTitle: 'Spotify Playlist' })
      }

      // Single track
      const trackId = url.match(/track\/([a-zA-Z0-9]+)/)?.[1]
      if (trackId && token) {
        const result = await getSpotifyTrack(trackId, token)
        if (result) return NextResponse.json({ type: 'track', ...result })
      }

      // Fallback to oEmbed
      const oembedUrl = `https://open.spotify.com/oembed?url=${encodeURIComponent(url)}`
      const oembedRes = await fetch(oembedUrl, { headers: { 'User-Agent': UA } })
      if (oembedRes.ok) {
        const data = await oembedRes.json()
        return NextResponse.json({
          type: 'track',
          title: data.title || '',
          artist: data.author_name || '',
          thumbnail: data.thumbnail_url || ''
        })
      }
    }

    // ===== YOUTUBE / YOUTUBE MUSIC =====
    if (isYouTube) {
      if (isPlaylist) {
        // Extract list ID from various YouTube URL formats
        const listMatch = url.match(/[?&]list=([a-zA-Z0-9_-]+)/)
        const listId = listMatch?.[1]

        if (listId) {
          const result = await getYouTubePlaylistTracks(listId)
          if (result && result.tracks.length > 0) {
            return NextResponse.json({ type: 'playlist', ...result })
          }
        }

        // Fallback to oEmbed for just the title
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
        return NextResponse.json({ type: 'playlist', tracks: [], playlistTitle: 'YouTube Playlist' })
      }

      // Single video
      const normalized = url.replace('music.youtube.com', 'www.youtube.com')
      const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(normalized)}&format=json`
      const res = await fetch(oembedUrl, { headers: { 'User-Agent': UA } })
      if (res.ok) {
        const data = await res.json()
        const parsed = parseYouTubeTitle(data.title || '')
        return NextResponse.json({
          type: 'track',
          title: parsed.title || data.title || '',
          artist: parsed.artist || data.author_name || '',
          thumbnail: data.thumbnail_url || ''
        })
      }
    }

    return NextResponse.json({ error: 'Unsupported service' }, { status: 400 })
  } catch (error: any) {
    console.error('Metadata extraction error:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
