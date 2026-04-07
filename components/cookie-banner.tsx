"use client"

import { startTransition, useEffect, useState } from "react"
import Link from "next/link"

import { SectionRule } from "@/components/section-rule"

const STORAGE_KEY = "smartfinvest-cookie-consent"

type CookieBannerProps = {
  /** Fires when the bar is shown or hidden (e.g. to offset the phone popup above it). */
  onVisibleChange?: (visible: boolean) => void
}

export function CookieBanner({ onVisibleChange }: CookieBannerProps) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    startTransition(() => {
      try {
        if (!localStorage.getItem(STORAGE_KEY)) {
          setShow(true)
        }
      } catch {
        setShow(true)
      }
    })
  }, [])

  useEffect(() => {
    onVisibleChange?.(show)
  }, [show, onVisibleChange])

  function accept() {
    try {
      localStorage.setItem(STORAGE_KEY, "accepted")
    } catch {
      /* ignore */
    }
    setShow(false)
  }

  if (!show) return null

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-banner-title"
      className="fixed bottom-0 left-0 right-0 z-50 bg-[#f9f9f9] px-6 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] sm:px-10 sm:pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:pt-4 lg:px-16 xl:px-20 2xl:px-24"
    >
      <SectionRule className="mb-4 bg-black/12 sm:mb-5" />
      <div className="mx-auto flex max-w-[72rem] flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-body-muted">
          <p id="cookie-banner-title" className="font-medium text-[var(--color-foreground)]">
            Cookies a soukromí
          </p>
          <p className="mt-1.5">
            Používáme cookies nezbytné pro fungování webu a (po vašem souhlasu) analytické nástroje. Více v{" "}
            <Link href="/zasady-cookies" className="text-[var(--color-primary)] underline-offset-2 hover:underline">
              Zásadách cookies
            </Link>{" "}
            a{" "}
            <Link href="/ochrana-osobnich-udaju" className="text-[var(--color-primary)] underline-offset-2 hover:underline">
              ochraně osobních údajů
            </Link>
            .
          </p>
        </div>
        <button
          type="button"
          onClick={accept}
          className="h-12 min-h-[48px] shrink-0 rounded-xl bg-[var(--color-primary)] px-6 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-primary-hover)]"
        >
          Rozumím
        </button>
      </div>
    </div>
  )
}
