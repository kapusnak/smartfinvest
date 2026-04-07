"use client"

import type React from "react"
import { useRef, useCallback } from "react"

const LOCK_THRESHOLD_PX = 10

/**
 * On touch devices: vertical drag scrolls the page; horizontal drag moves the slider.
 */
export function SliderTouchLock({
  minIndex,
  maxIndex,
  valueIndex,
  onValueChange,
  children,
}: {
  minIndex: number
  maxIndex: number
  valueIndex: number
  onValueChange: (index: number) => void
  children: React.ReactNode
}) {
  const trackRef = useRef<HTMLDivElement>(null)
  const startRef = useRef<{ x: number; y: number } | null>(null)
  const lockedRef = useRef<"horizontal" | "vertical" | null>(null)

  const clampIndex = useCallback(
    (i: number) => Math.max(minIndex, Math.min(maxIndex, Math.round(i))),
    [minIndex, maxIndex],
  )

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const t = e.touches[0]
    if (!t) return
    startRef.current = { x: t.clientX, y: t.clientY }
    lockedRef.current = null
  }, [])

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      const t = e.touches[0]
      const track = trackRef.current
      if (!t || !track) return

      const dx = t.clientX - (startRef.current?.x ?? t.clientX)
      const dy = t.clientY - (startRef.current?.y ?? t.clientY)

      if (lockedRef.current === null) {
        const adx = Math.abs(dx)
        const ady = Math.abs(dy)
        if (adx + ady < LOCK_THRESHOLD_PX) return
        lockedRef.current = adx >= ady ? "horizontal" : "vertical"
      }

      if (lockedRef.current === "vertical") return

      e.preventDefault()
      const rect = track.getBoundingClientRect()
      const ratio = (t.clientX - rect.left) / rect.width
      const index = clampIndex(ratio * (maxIndex - minIndex) + minIndex)
      onValueChange(index)
    },
    [minIndex, maxIndex, clampIndex, onValueChange],
  )

  const handleTouchEnd = useCallback(() => {
    startRef.current = null
    lockedRef.current = null
  }, [])

  return (
    <div
      ref={trackRef}
      className="relative w-full"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      style={{ touchAction: "pan-y" }}
    >
      {children}
      <div
        className="pointer-events-none absolute inset-0 z-10 [@media(hover:none)]:pointer-events-auto"
        aria-hidden
      />
    </div>
  )
}
