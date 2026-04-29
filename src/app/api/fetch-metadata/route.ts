import { NextResponse } from 'next/server'

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'

// ===== SPOTIFY: Get individual track album art from embed =====
async function getSpotifyTrackArt(trackId: string): Promise<string> {
  try {
    const res = await fetch(`https://open.spotify.com/embed/track/${trackId}`, {
      headers: { 'User-Agent': UA, 'Accept': 'text/html' }
    })
    if (!res.ok) return ''
    const html = await res.text()
    const match = html.match(/<script\s+id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/)
    if (!match) return ''
    const data = JSON.parse(match[1])
    const images = data?.props?.pageProps?.state?.data?.entity?.visualIdentity?.image
    if (images && images.length > 0) {
      // Pick the 300px version (index 0) or largest available
      const best = images.find((img: any) => img.maxHeight === 300) || images[0]
      return best?.url || ''
    }
    return ''
  } catch { return '' }
}

// ===== SPOTIFY: Extract playlist tracks from embed page =====
async function getSpotifyPlaylistTracks(playlistId: string) {
  try {
    const embedUrl = `https://open.spotify.com/embed/playlist/${playlistId}`
    const res = await fetch(embedUrl, {
      headers: { 'User-Agent': UA, 'Accept': 'text/html' }
    })
    if (!res.ok) return null

    const html = await res.text()
    const nextDataMatch = html.match(/<script\s+id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/)
    if (!nextDataMatch) return null

    const nextData = JSON.parse(nextDataMatch[1])
    const entity = nextData?.props?.pageProps?.state?.data?.entity
    if (!entity) return null

    const trackList = entity.trackList || []
    const playlistCover = entity.coverArt?.sources?.[0]?.url || ''

    // Fetch individual album art for each track in parallel
    const trackItems = trackList.filter((t: any) => t.entityType === 'track')
    const albumArts = await Promise.all(
      trackItems.map((t: any) => {
        const id = t.uri?.split(':')?.[2]
        return id ? getSpotifyTrackArt(id) : Promise.resolve('')
      })
    )

    const tracks = trackItems.map((t: any, i: number) => ({
      title: t.title || '',
      artist: t.subtitle || '',
      thumbnail: albumArts[i] || playlistCover // Fallback to playlist cover
    }))

    return {
      playlistTitle: entity.name || entity.title || 'Spotify Playlist',
      thumbnail: playlistCover,
      tracks
    }
  } catch (err) {
    console.error('Spotify embed extraction error:', err)
    return null
  }
}


// ===== SPOTIFY: Extract single track from embed page =====
async function getSpotifyTrack(trackId: string) {
  try {
    const embedUrl = `https://open.spotify.com/embed/track/${trackId}`
    const res = await fetch(embedUrl, {
      headers: { 'User-Agent': UA, 'Accept': 'text/html' }
    })
    if (!res.ok) return null

    const html = await res.text()
    const nextDataMatch = html.match(/<script\s+id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/)
    if (!nextDataMatch) return null

    const nextData = JSON.parse(nextDataMatch[1])
    const entity = nextData?.props?.pageProps?.state?.data?.entity
    if (!entity) return null

    const albumArt = entity.visualIdentity?.image?.find((img: any) => img.maxHeight === 300)?.url
      || entity.visualIdentity?.image?.[0]?.url
      || entity.coverArt?.sources?.[0]?.url || ''

    return {
      title: entity.name || entity.title || '',
      artist: entity.subtitle || entity.artists?.map((a: any) => a.name).join(', ') || '',
      thumbnail: albumArt
    }
  } catch (err) {
    console.error('Spotify track extraction error:', err)
    return null
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
    const match = html.match(/var\s+ytInitialData\s*=\s*(\{[\s\S]+?\});\s*<\/script>/)
    if (!match) return null

    const data = JSON.parse(match[1])
    const playlistTitle = data?.metadata?.playlistMetadataRenderer?.title || 'YouTube Playlist'

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
  // Only remove obvious marketing suffixes, preserve other parentheticals
  let cleaned = rawTitle
    .replace(/\s*[\(\[]?(official\s*(music\s*)?video|official\s*audio|official\s*lyric\s*video|lyric\s*video|lyrics?|mv|m\/v|audio|live|공식\s*뮤직비디오)[\)\]]?\s*/gi, '')
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
      if (isPlaylist) {
        const playlistId = url.match(/playlist\/([a-zA-Z0-9]+)/)?.[1]
        if (playlistId) {
          const result = await getSpotifyPlaylistTracks(playlistId)
          if (result && result.tracks.length > 0) {
            return NextResponse.json({ type: 'playlist', ...result })
          }
        }
        // Fallback: oEmbed for playlist info
        const oembedRes = await fetch(`https://open.spotify.com/oembed?url=${encodeURIComponent(url)}`, { headers: { 'User-Agent': UA } })
        if (oembedRes.ok) {
          const data = await oembedRes.json()
          return NextResponse.json({ type: 'playlist', tracks: [], playlistTitle: data.title || 'Spotify Playlist', thumbnail: data.thumbnail_url || '' })
        }
        return NextResponse.json({ type: 'playlist', tracks: [], playlistTitle: 'Spotify Playlist' })
      }

      // Single track
      const trackId = url.match(/track\/([a-zA-Z0-9]+)/)?.[1]
      if (trackId) {
        const result = await getSpotifyTrack(trackId)
        if (result) return NextResponse.json({ type: 'track', ...result })
      }

      // Fallback: oEmbed
      const oembedRes = await fetch(`https://open.spotify.com/oembed?url=${encodeURIComponent(url)}`, { headers: { 'User-Agent': UA } })
      if (oembedRes.ok) {
        const data = await oembedRes.json()
        return NextResponse.json({ type: 'track', title: data.title || '', artist: data.author_name || '', thumbnail: data.thumbnail_url || '' })
      }
    }

    // ===== YOUTUBE / YOUTUBE MUSIC =====
    if (isYouTube) {
      if (isPlaylist) {
        const listMatch = url.match(/[?&]list=([a-zA-Z0-9_-]+)/)
        const listId = listMatch?.[1]
        if (listId) {
          const result = await getYouTubePlaylistTracks(listId)
          if (result && result.tracks.length > 0) {
            return NextResponse.json({ type: 'playlist', ...result })
          }
        }
        // Fallback: oEmbed
        const normalized = url.replace('music.youtube.com', 'www.youtube.com')
        const oembedRes = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(normalized)}&format=json`, { headers: { 'User-Agent': UA } })
        if (oembedRes.ok) {
          const data = await oembedRes.json()
          return NextResponse.json({ type: 'playlist', playlistTitle: data.title || 'YouTube Playlist', thumbnail: data.thumbnail_url || '', tracks: [] })
        }
        return NextResponse.json({ type: 'playlist', tracks: [], playlistTitle: 'YouTube Playlist' })
      }

      // Single video
      const normalized = url.replace('music.youtube.com', 'www.youtube.com')
      const oembedRes = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(normalized)}&format=json`, { headers: { 'User-Agent': UA } })
      if (oembedRes.ok) {
        const data = await oembedRes.json()
        const parsed = parseYouTubeTitle(data.title || '')
        return NextResponse.json({ type: 'track', title: parsed.title || data.title || '', artist: parsed.artist || data.author_name || '', thumbnail: data.thumbnail_url || '' })
      }
    }

    return NextResponse.json({ error: 'Unsupported service' }, { status: 400 })
  } catch (error: any) {
    console.error('Metadata extraction error:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
