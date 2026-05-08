"use client"

import { SiteNav } from './site-nav'
import { useLang } from './language-provider'

export function ProductNav() {
  const { lang } = useLang()
  const isPt = lang === 'pt'
  return <SiteNav badgeLabel={isPt ? 'Pedir Orçamento' : 'Request Quote'} badgeHref="/pricing" />
}
