"use client"

interface UTMParams {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_content?: string
}

const UTM_KEYS = {
  source: "talimci_utm_source",
  medium: "talimci_utm_medium",
  campaign: "talimci_utm_campaign",
  content: "talimci_utm_content",
}

const TTL_DAYS = 30

export function captureUTM() {
  if (typeof window === "undefined") return

  const params = new URLSearchParams(window.location.search)
  const utmData: UTMParams = {}

  // Check if any UTM params exist in URL
  if (params.has("utm_source")) utmData.utm_source = params.get("utm_source")!
  if (params.has("utm_medium")) utmData.utm_medium = params.get("utm_medium")!
  if (params.has("utm_campaign")) utmData.utm_campaign = params.get("utm_campaign")!
  if (params.has("utm_content")) utmData.utm_content = params.get("utm_content")!

  // If we have UTM data, save it
  if (Object.keys(utmData).length > 0) {
    const expires = new Date()
    expires.setDate(expires.getDate() + TTL_DAYS)
    const expiresStr = expires.toUTCString()

    // Save to localStorage
    if (utmData.utm_source) localStorage.setItem(UTM_KEYS.source, utmData.utm_source)
    if (utmData.utm_medium) localStorage.setItem(UTM_KEYS.medium, utmData.utm_medium)
    if (utmData.utm_campaign) localStorage.setItem(UTM_KEYS.campaign, utmData.utm_campaign)
    if (utmData.utm_content) localStorage.setItem(UTM_KEYS.content, utmData.utm_content)

    // Save to cookies
    if (utmData.utm_source) document.cookie = `${UTM_KEYS.source}=${utmData.utm_source}; expires=${expiresStr}; path=/`
    if (utmData.utm_medium) document.cookie = `${UTM_KEYS.medium}=${utmData.utm_medium}; expires=${expiresStr}; path=/`
    if (utmData.utm_campaign)
      document.cookie = `${UTM_KEYS.campaign}=${utmData.utm_campaign}; expires=${expiresStr}; path=/`
    if (utmData.utm_content)
      document.cookie = `${UTM_KEYS.content}=${utmData.utm_content}; expires=${expiresStr}; path=/`
  }
}

export function getStoredUTM(): UTMParams {
  if (typeof window === "undefined") return {}

  return {
    utm_source: localStorage.getItem(UTM_KEYS.source) || undefined,
    utm_medium: localStorage.getItem(UTM_KEYS.medium) || undefined,
    utm_campaign: localStorage.getItem(UTM_KEYS.campaign) || undefined,
    utm_content: localStorage.getItem(UTM_KEYS.content) || undefined,
  }
}
