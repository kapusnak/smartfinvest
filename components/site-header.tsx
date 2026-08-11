"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Menu, X } from "lucide-react"

import { Container } from "@/components/container"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "/#sluzby", label: "Vymáhání pohledávek" },
  { href: "/reseni-pro-klienty", label: "Řešení pro klienty" },
  { href: "/#kontakty", label: "Kontakt" },
] as const

export function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const linkClass = (href: string) =>
    cn(
      "text-sm font-medium transition-colors hover:text-[var(--color-primary)]",
      href === "/reseni-pro-klienty" && pathname === "/reseni-pro-klienty"
        ? "text-[var(--color-primary)]"
        : "text-[var(--color-foreground)]",
    )

  return (
    <header className="sticky top-0 z-40 border-b border-black/[0.06] bg-white/95 backdrop-blur-sm">
      <Container className="flex h-16 items-center justify-between gap-4 md:h-[4.25rem]">
        <Link href="/" className="flex shrink-0 items-center" onClick={() => setOpen(false)}>
          <Image
            src="/images/new-logo.png"
            alt="Smart Finvest s.r.o."
            width={160}
            height={51}
            className="h-9 w-auto sm:h-10"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Hlavní navigace">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className={linkClass(link.href)}>
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-lg text-[var(--color-foreground)] transition-colors hover:bg-black/[0.04] md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Zavřít menu" : "Otevřít menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" strokeWidth={2.25} /> : <Menu className="h-5 w-5" strokeWidth={2.25} />}
        </button>
      </Container>

      {open ? (
        <nav
          id="mobile-nav"
          className="border-t border-black/[0.06] bg-white md:hidden"
          aria-label="Mobilní navigace"
        >
          <Container className="flex flex-col gap-1 py-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-lg px-3 py-3 text-base font-medium transition-colors hover:bg-[var(--color-surface-cream)]",
                  linkClass(link.href),
                )}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </Container>
        </nav>
      ) : null}
    </header>
  )
}
