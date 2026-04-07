import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[72rem] px-4 sm:px-10 lg:px-16 xl:px-20 2xl:px-24",
        className,
      )}
    >
      {children}
    </div>
  )
}
