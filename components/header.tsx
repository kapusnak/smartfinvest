"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function Header() {
  const pathname = usePathname()
  const isHome = pathname === "/"

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-[var(--color-header-tint)] backdrop-blur-sm">
      <div className="mx-auto flex max-w-[72rem] items-center justify-between gap-4 px-4 py-3 sm:px-10 lg:px-16 xl:px-20 2xl:px-24">
        <Link href="/" className="flex min-h-[44px] min-w-0 shrink items-center gap-3">
          <Image
            src="/images/logo-circle.png"
            alt=""
            width={44}
            height={44}
            className="h-11 w-11 rounded-full object-cover"
            priority
          />
          <span className="font-[family-name:var(--font-instrument)] text-base font-semibold leading-tight tracking-tight text-[var(--color-foreground)] sm:text-lg">
            Smart Finvest s.r.o.
          </span>
        </Link>

        {!isHome && (
          <Link
            href="/"
            className="min-h-[44px] content-center text-sm font-medium text-[var(--color-contrast-2)] transition-colors hover:text-[var(--color-primary)] md:text-base"
          >
            Zpět na hlavní stránku
          </Link>
        )}
      </div>
    </header>
  )
}
