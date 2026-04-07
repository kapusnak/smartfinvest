"use client"

import Link from "next/link"
import { Building2, Menu, X } from "lucide-react"
import { useState } from "react"

import { SectionRule } from "@/components/section-rule"

const nav = [
  { href: "/#sluzby", label: "Služby" },
  { href: "/#o-nas", label: "O nás" },
  { href: "/#kontakty", label: "Kontakty" },
]

export function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-black/5 bg-[var(--color-background)]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-[72rem] items-center justify-between gap-4 px-4 py-3 sm:px-10 lg:px-16 xl:px-20 2xl:px-24">
        <Link href="/" className="flex min-h-[44px] min-w-0 shrink items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-white md:hidden">
            <Building2 className="h-6 w-6" aria-hidden />
          </span>
          <span className="font-[family-name:var(--font-cardo)] text-lg font-semibold leading-tight tracking-tight text-[#111] sm:text-xl">
            Smart Finvest s.r.o.
          </span>
        </Link>

        <div className="flex shrink-0 items-center gap-2 md:hidden">
          <Link
            href="/#formular"
            className="inline-flex min-h-[44px] max-w-[calc(100vw-8.5rem)] items-center justify-center rounded-full bg-[var(--color-primary)] px-3 py-2 text-center text-[11px] font-bold uppercase leading-snug tracking-wide text-white transition-colors hover:bg-[var(--color-primary-hover)] min-[380px]:max-w-none min-[380px]:px-4 min-[380px]:text-xs"
          >
            Nezávazná poptávka
          </Link>
          <button
            type="button"
            className="flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-lg text-[#111]"
            aria-expanded={open}
            aria-label={open ? "Zavřít menu" : "Otevřít menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Hlavní navigace">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="min-h-[44px] content-center text-body font-medium text-[#636363] transition-colors hover:text-[#111]"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/#formular"
            className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-[var(--color-primary)] px-4 text-body font-semibold text-white transition-colors hover:bg-[var(--color-primary-hover)]"
          >
            Nezávazná poptávka
          </Link>
        </nav>
      </div>

      {open && (
        <div className="bg-[var(--color-background)] md:hidden">
          <div className="px-4 pt-2 sm:px-10 lg:px-16 xl:px-20 2xl:px-24">
            <SectionRule className="bg-black/10" />
          </div>
          <nav
            className="mx-auto flex max-w-[72rem] flex-col gap-1 px-4 py-3 sm:px-10 lg:px-16 xl:px-20 2xl:px-24"
            aria-label="Mobilní navigace"
          >
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="min-h-[48px] content-center rounded-lg px-2 text-body font-medium text-[#111] hover:bg-black/5"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
