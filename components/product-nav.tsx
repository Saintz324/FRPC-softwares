"use client"

import { SiteNav } from './site-nav'

export function ProductNav({ externalUrl, tryLabel = 'Experimentar' }: { externalUrl: string; tryLabel?: string }) {
  return <SiteNav badgeLabel={tryLabel} badgeHref={externalUrl} badgeExternal />
}
