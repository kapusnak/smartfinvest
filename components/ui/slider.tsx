"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

function Slider({ className, defaultValue, value, min = 0, max = 100, ...props }: React.ComponentProps<typeof SliderPrimitive.Root>) {
  const values = React.useMemo(
    () =>
      Array.isArray(value) ? value : Array.isArray(defaultValue) ? defaultValue : [min, max],
    [value, defaultValue, min, max],
  )

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn(
        "relative flex w-full touch-none select-none items-center data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col data-[disabled]:opacity-50",
        "data-[orientation=horizontal]:min-h-11",
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-[var(--color-surface-muted)]"
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className="absolute h-full bg-[var(--color-primary)] data-[orientation=vertical]:w-full"
        />
      </SliderPrimitive.Track>
      {Array.from({ length: values.length }, (_, index) => (
        <SliderPrimitive.Thumb
          key={index}
          data-slot="slider-thumb"
          className="block size-5 shrink-0 rounded-full border-2 border-[var(--color-primary)] bg-white shadow-sm outline-none ring-[var(--color-primary)]/25 transition-[box-shadow,transform] hover:ring-4 focus-visible:ring-4 disabled:pointer-events-none disabled:opacity-50 [-webkit-tap-highlight-color:transparent] touch-manipulation md:size-[1.125rem]"
        />
      ))}
    </SliderPrimitive.Root>
  )
}

export { Slider }
