"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

const SCROLL_HASH_KEY = "smartfinvest-scroll-hash"

/** Persist a section id so we can scroll after soft-navigating to another route. */
export function stashScrollHash(hash: string) {
  const id = hash.replace(/^#/, "").trim()
  if (!id) return
  try {
    sessionStorage.setItem(SCROLL_HASH_KEY, id)
  } catch {
    /* ignore */
  }
}

function scrollToId(id: string) {
  const el = document.getElementById(id)
  if (!el) return false
  el.scrollIntoView({ behavior: "smooth", block: "start" })
  if (window.location.hash !== `#${id}`) {
    window.history.replaceState(null, "", `${window.location.pathname}#${id}`)
  }
  return true
}

/**
 * Next.js App Router often fails to scroll to `#hash` after client navigations.
 * Scrolls on load / route change using the URL hash or a stashed section id.
 */
export function ScrollToHash() {
  const pathname = usePathname()

  useEffect(() => {
    let cancelled = false
    let attempts = 0

    const tryScroll = () => {
      if (cancelled) return
      let id = ""
      try {
        id = sessionStorage.getItem(SCROLL_HASH_KEY) ?? ""
        if (id) sessionStorage.removeItem(SCROLL_HASH_KEY)
      } catch {
        /* ignore */
      }
      if (!id) id = window.location.hash.replace(/^#/, "")
      if (!id) return

      if (scrollToId(id)) return
      if (attempts < 8) {
        attempts += 1
        window.setTimeout(tryScroll, 50 * attempts)
      }
    }

    const raf = requestAnimationFrame(() => {
      window.setTimeout(tryScroll, 0)
    })
    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
    }
  }, [pathname])

  return null
}
