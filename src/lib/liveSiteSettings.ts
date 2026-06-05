'use client'

import { useCallback, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'

export type SiteSettingRow = {
  key: string
  value: any
}

const LIVE_SETTINGS_CHANNEL = 'pf-site-settings'
const LIVE_SETTINGS_STORAGE_KEY = 'pf_site_settings_published_at'
const DEFAULT_POLL_MS = 10000
const SITE_SETTING_KEYS = [
  'page_content',
  'map_address',
  'hero_video',
  'about_image',
  'admin_settings',
]

export function getSiteSettingValue(rows: SiteSettingRow[], key: string) {
  return rows.find((row) => row.key === key)?.value
}

export function notifySiteSettingsPublished() {
  if (typeof window === 'undefined') return

  const stamp = Date.now().toString()

  try {
    window.localStorage.setItem(LIVE_SETTINGS_STORAGE_KEY, stamp)
  } catch {
    // Ignore blocked storage; BroadcastChannel and polling still cover updates.
  }

  try {
    const channel = new BroadcastChannel(LIVE_SETTINGS_CHANNEL)
    channel.postMessage({ type: 'site-settings-published', stamp })
    channel.close()
  } catch {
    // Some browsers do not support BroadcastChannel.
  }
}

export function useLiveSiteSettings(
  onSettings: (rows: SiteSettingRow[]) => void,
  options: { pollMs?: number } = {}
) {
  const onSettingsRef = useRef(onSettings)
  const realtimeChannelNameRef = useRef(`site-settings-live-${Math.random().toString(36).slice(2)}`)
  const pollMs = options.pollMs ?? DEFAULT_POLL_MS

  useEffect(() => {
    onSettingsRef.current = onSettings
  }, [onSettings])

  const refresh = useCallback(async () => {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .in('key', SITE_SETTING_KEYS)

    if (!error && data) {
      onSettingsRef.current(data as SiteSettingRow[])
    }
  }, [])

  useEffect(() => {
    let stopped = false

    const refreshIfActive = () => {
      if (!stopped) {
        void refresh()
      }
    }

    refreshIfActive()

    const intervalId = window.setInterval(refreshIfActive, pollMs)
    const handleFocus = () => refreshIfActive()
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') refreshIfActive()
    }
    const handleStorage = (event: StorageEvent) => {
      if (event.key === LIVE_SETTINGS_STORAGE_KEY) refreshIfActive()
    }

    window.addEventListener('focus', handleFocus)
    window.addEventListener('storage', handleStorage)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    let broadcastChannel: BroadcastChannel | null = null
    try {
      broadcastChannel = new BroadcastChannel(LIVE_SETTINGS_CHANNEL)
      broadcastChannel.onmessage = refreshIfActive
    } catch {
      broadcastChannel = null
    }

    const realtimeChannel = supabase
      .channel(realtimeChannelNameRef.current)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'site_settings', filter: 'key=eq.page_content' }, refreshIfActive)
      .subscribe()

    return () => {
      stopped = true
      window.clearInterval(intervalId)
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('storage', handleStorage)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      broadcastChannel?.close()
      void supabase.removeChannel(realtimeChannel)
    }
  }, [pollMs, refresh])

  return refresh
}
