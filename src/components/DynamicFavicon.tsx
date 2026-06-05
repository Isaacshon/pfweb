'use client'

import { useState } from 'react'
import { getSiteSettingValue, useLiveSiteSettings } from '@/lib/liveSiteSettings'

export const DynamicFavicon = () => {
  const [faviconUrl, setFaviconUrl] = useState<string | null>(null)

  useLiveSiteSettings((settingsData) => {
    const pageContent = getSiteSettingValue(settingsData, 'page_content')
    const adminSettings = getSiteSettingValue(settingsData, 'admin_settings')

    if (pageContent?.branding?.faviconUrl) {
      setFaviconUrl(pageContent.branding.faviconUrl)
      return
    }

    if (adminSettings?.faviconUrl) {
      setFaviconUrl(adminSettings.faviconUrl)
    }
  })

  if (!faviconUrl) return null

  return (
    <link rel="icon" href={faviconUrl} />
  )
}
