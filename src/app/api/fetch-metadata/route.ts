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

    const response = await fetch(fetchUrl)
    if (!response.ok) throw new Error('Failed to fetch metadata')
    
    const data = await response.json()
    
    // oEmbed returns title and author_name
    return NextResponse.json({
      title: data.title || '',
      artist: data.author_name || '',
      thumbnail: data.thumbnail_url || ''
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
