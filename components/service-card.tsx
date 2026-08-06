"use client"

import { useEffect, useId, useRef, useState, type KeyboardEvent, type MouseEvent } from "react"
import Image from "next/image"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

type Partner = { href: string; label: string; logo: string; width: number }

export function ServiceCard({
  icon,
  title,
  short,
  details,
  partner,
}: {
  icon: string
  title: string
  short: string
  details: string
  partner: Partner | null
}) {
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const contentRef = useRef<HTMLDivElement>(null)
  const [contentHeight, setContentHeight] = useState(0)

  useEffect(() => {
    const el = contentRef.current
    if (!el) return
    const update = () => setContentHeight(el.scrollHeight)
    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const toggle = () => setOpen((v) => !v)

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      toggle()
    }
  }

  const stopCardToggle = (e: MouseEvent) => {
    e.stopPropagation()
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-expanded={open}
      aria-controls={panelId}
      onClick={toggle}
      onKeyDown={onKeyDown}
      className={cn(
        "flex h-full cursor-pointer flex-col rounded-2xl bg-white p-6 text-center ring-1 ring-black/[0.04] transition-[box-shadow,transform,ring-color] duration-300 ease-out motion-reduce:transition-none sm:p-7",
        "shadow-[0_10px_36px_-16px_rgba(17,17,17,0.22)]",
        "hover:-translate-y-1.5 hover:shadow-[0_28px_64px_-14px_rgba(17,17,17,0.42)] hover:ring-[var(--color-primary)]/25",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2",
        open && "-translate-y-1.5 shadow-[0_28px_64px_-14px_rgba(17,17,17,0.42)] ring-[var(--color-primary)]/25",
      )}
    >
      <div className="mx-auto flex size-24 items-center justify-center rounded-[28px] bg-[var(--color-primary)]/10">
        <Image
          src={icon}
          alt=""
          width={72}
          height={72}
          className="h-11 w-11 object-contain brightness-0 opacity-80"
        />
      </div>

      <h2 className="mt-5 font-[family-name:var(--font-instrument)] text-[1.35rem] font-semibold leading-snug text-[var(--color-contrast-2)]">
        {title}
      </h2>
      <p className="mt-3 text-body-foreground">{short}</p>

      <span className="mt-5 inline-flex min-h-10 items-center justify-center gap-1.5 self-center text-sm font-medium text-[var(--color-primary)]">
        {open ? "Skrýt" : "Více informací"}
        <ChevronDown
          className={cn(
            "h-4 w-4 transition-transform duration-300 ease-out motion-reduce:transition-none",
            open && "rotate-180",
          )}
          aria-hidden
          strokeWidth={2.25}
        />
      </span>

      <div
        id={panelId}
        role="region"
        style={{ maxHeight: open ? contentHeight : 0 }}
        className="w-full overflow-hidden transition-[max-height] duration-300 ease-out motion-reduce:transition-none"
      >
        <div ref={contentRef} className="space-y-4 pt-5 text-left text-body-muted">
          <p>{details}</p>
          {partner ? (
            <div className="flex flex-col items-center gap-3 pt-1" onClick={stopCardToggle}>
              <a
                href={partner.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[var(--color-primary)] underline-offset-2 hover:underline"
              >
                Partner: {partner.label}
              </a>
              <Image
                src={partner.logo}
                alt={partner.label}
                width={partner.width}
                height={80}
                className="h-auto object-contain"
                style={{ width: partner.width }}
              />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
