'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export const DynamicFavicon = () => {
  const [faviconUrl, setFaviconUrl] = useState<string | null>(null)

  useEffect(() => {
    const fetchBranding = async () => {
      const { data } = await supabase
        .from('site_settings')
        .select('*')
        .eq('key', 'page_content')
        .single()
      
      if (data?.value?.branding?.faviconUrl) {
        setFaviconUrl(data.value.branding.faviconUrl)
      } else {
        // Fallback to site_settings separate key if we move it there later
        const { data: brandingData } = await supabase
          .from('site_settings')
          .select('*')
          .eq('key', 'site_settings')
          .single()
        
        if (brandingData?.value?.faviconUrl) {
          setFaviconUrl(brandingData.value.faviconUrl)
        }
      }
    }
    fetchBranding()
  }, [])

  if (!faviconUrl) return null

  return (
    <link rel="icon" href={faviconUrl} />
  )
}
