"use client"

import { useCallback, useEffect, useState } from "react"

import { CookieBanner } from "@/components/cookie-banner"
import { PhonePopup } from "@/components/phone-popup"

/** Keeps cookie bar + phone popup stacked like hnedpenize lead-popup (above bar, no overlap). */
export function BottomChrome() {
  const [cookieBarOpen, setCookieBarOpen] = useState(false)

  const onCookieVisibleChange = useCallback((visible: boolean) => {
    setCookieBarOpen(visible)
  }, [])

  useEffect(() => {
    const root = document.documentElement
    if (cookieBarOpen) {
      root.style.setProperty("--smartfinvest-popup-bottom-mob", "11rem")
      root.style.setProperty("--smartfinvest-popup-bottom-lg", "6rem")
    } else {
      root.style.setProperty("--smartfinvest-popup-bottom-mob", "0px")
      root.style.setProperty("--smartfinvest-popup-bottom-lg", "1.5rem")
    }
    return () => {
      root.style.setProperty("--smartfinvest-popup-bottom-mob", "0px")
      root.style.setProperty("--smartfinvest-popup-bottom-lg", "1.5rem")
    }
  }, [cookieBarOpen])

  return (
    <>
      <PhonePopup />
      <CookieBanner onVisibleChange={onCookieVisibleChange} />
    </>
  )
}
