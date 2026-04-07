"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import { Phone, X } from "lucide-react"

import { sendPopupPhone } from "@/lib/emailjs"
import { PhoneDigitsInput } from "@/components/phone-digits-input"
import { toFullPhone } from "@/lib/phone-420"
import { cn } from "@/lib/utils"

const POPUP_DISMISSED_KEY = "docasnyvykup-phone-popup-dismissed"
const SHOW_DELAY_MS = 15_000
/** Must match `slide-in-bottom` in globals.css */
const SLIDE_IN_DURATION_MS = 450
/** Repeat shake while idle; first run right after slide completes */
const SHAKE_INTERVAL_MS = 6000
const SHAKE_DURATION_MS = 500

export function PhonePopup() {
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)
  const [closed, setClosed] = useState(false)
  const [entranceDone, setEntranceDone] = useState(false)
  const [engaged, setEngaged] = useState(false)
  const [digits, setDigits] = useState("")
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle")
  const shakeTargetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let cancelled = false
    try {
      if (localStorage.getItem(POPUP_DISMISSED_KEY) === "1") {
        setClosed(true)
        return
      }
    } catch {
      /* storage unavailable — still allow popup */
    }
    const t = setTimeout(() => {
      if (!cancelled) setVisible(true)
    }, SHOW_DELAY_MS)
    return () => {
      cancelled = true
      clearTimeout(t)
    }
  }, [])

  /** Desktop: no slide animation — treat entrance as done immediately */
  useEffect(() => {
    if (!visible || closed) return
    const mq = window.matchMedia("(min-width: 1024px)")
    const apply = () => {
      if (mq.matches) setEntranceDone(true)
    }
    apply()
    mq.addEventListener("change", apply)
    return () => mq.removeEventListener("change", apply)
  }, [visible, closed])

  /** Mobile fallback if `animationend` does not fire */
  useEffect(() => {
    if (!visible || closed || entranceDone) return
    const mq = window.matchMedia("(min-width: 1024px)")
    if (mq.matches) return
    const t = window.setTimeout(() => setEntranceDone(true), SLIDE_IN_DURATION_MS + 80)
    return () => clearTimeout(t)
  }, [visible, closed, entranceDone])

  /** Repeating shake (DOM class restart) — never fight the slide animation on the same node */
  useEffect(() => {
    if (!visible || closed || !entranceDone || engaged) return

    const el = shakeTargetRef.current
    if (!el) return

    const runShake = () => {
      const node = shakeTargetRef.current
      if (!node) return
      node.classList.remove("animate-shake")
      void node.offsetWidth
      node.classList.add("animate-shake")
      window.setTimeout(() => {
        node.classList.remove("animate-shake")
      }, SHAKE_DURATION_MS)
    }

    runShake()
    const id = window.setInterval(runShake, SHAKE_INTERVAL_MS)
    return () => {
      window.clearInterval(id)
      shakeTargetRef.current?.classList.remove("animate-shake")
    }
  }, [visible, closed, entranceDone, engaged])

  function markEngaged() {
    setEngaged(true)
  }

  function handleSlideInEnd(e: React.AnimationEvent<HTMLDivElement>) {
    if (e.target !== e.currentTarget) return
    if (e.animationName !== "slide-in-bottom") return
    setEntranceDone(true)
  }

  useEffect(() => {
    if (digits.length > 0) setEngaged(true)
  }, [digits])

  function dismiss() {
    try {
      localStorage.setItem(POPUP_DISMISSED_KEY, "1")
    } catch {
      /* ignore */
    }
    setClosed(true)
    setVisible(false)
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const phone = toFullPhone(digits)
    if (!phone) {
      setStatus("error")
      return
    }
    setStatus("sending")
    try {
      await sendPopupPhone(phone, pathname ?? "")
      setStatus("success")
      setTimeout(() => dismiss(), 1500)
    } catch {
      setStatus("error")
    }
  }

  if (!visible || closed) return null

  return (
    <>
      {/* Below cookie bar (z-50), above page — same role as hnedpenize lead-popup backdrop */}
      <button
        type="button"
        aria-label="Zavřít nabídku"
        className="fixed inset-0 z-[48] bg-black/20 lg:hidden"
        onClick={dismiss}
      />

      <div
        className={cn(
          "fixed left-0 right-0 z-[52] w-full max-h-[33vh] rounded-t-2xl bg-[#f1b24a] shadow-2xl",
          "bottom-[var(--docasnyvykup-popup-bottom-mob)]",
          !entranceDone && "max-lg:animate-slide-in-bottom",
          "lg:bottom-[var(--docasnyvykup-popup-bottom-lg)] lg:left-auto lg:right-6 lg:max-h-none lg:w-[380px] lg:rounded-2xl",
        )}
        onAnimationEnd={handleSlideInEnd}
      >
        <button
          type="button"
          onClick={dismiss}
          className="absolute right-3 top-3 z-10 inline-flex min-h-10 min-w-10 items-center justify-center rounded-full p-2 text-[var(--color-foreground)]/55 transition-colors hover:bg-black/10 hover:text-[var(--color-foreground)]"
          aria-label="Zavřít"
        >
          <X className="pointer-events-none h-5 w-5 shrink-0" strokeWidth={2} aria-hidden />
        </button>

        <div ref={shakeTargetRef} className="p-4 pb-6 lg:p-6">
          <h3 className="pr-10 text-lg font-bold leading-snug text-[var(--color-foreground)] lg:text-2xl">
            Potřebujete poradit?
          </h3>
          <p className="mt-1.5 text-body-foreground">
            Nechte nám telefon, ozveme se vám a nezávazně vše prokonzultujeme.
          </p>

          <form
            onSubmit={onSubmit}
            onPointerDownCapture={markEngaged}
            onFocusCapture={markEngaged}
            className="mt-3 flex flex-col gap-2.5 lg:gap-3"
          >
            <div className="relative flex h-10 w-full items-center rounded-lg bg-white focus-within:ring-2 focus-within:ring-[var(--color-primary)] lg:h-12">
              <Phone
                className="pointer-events-none absolute left-3 top-1/2 z-[1] h-4 w-4 -translate-y-1/2 text-[var(--color-muted)]"
                aria-hidden
              />
              <PhoneDigitsInput
                aria-label="Telefonní číslo (9 číslic bez předvolby)"
                className="h-full min-h-0 flex-1 pl-10 pr-4"
                inputClassName="h-full text-[var(--color-foreground)] placeholder:text-[var(--color-muted-light)]"
                prefixClassName="text-[var(--color-muted)]"
                value={digits}
                onChange={setDigits}
                required
              />
            </div>
            {status === "error" && (
              <p className="text-xs font-medium leading-snug text-red-900 md:text-sm">
                Zadejte platné číslo (9 číslic).
              </p>
            )}
            <button
              type="submit"
              disabled={status === "sending"}
              className="flex h-10 min-h-[48px] w-full items-center justify-center rounded-lg bg-[var(--color-primary)] text-sm font-semibold text-white transition-colors hover:bg-[var(--color-primary-hover)] disabled:opacity-70 lg:h-12 lg:text-base"
            >
              {status === "sending" ? "Odesílám…" : status === "success" ? "Odesláno" : "Zavolejte mi"}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
