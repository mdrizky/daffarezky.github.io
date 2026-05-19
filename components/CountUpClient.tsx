"use client"

import React, { useEffect, useRef, useState } from "react"

type Props = {
  end: number
  duration?: number
  className?: string
  suffix?: string
}

export default function CountUpClient({ end, duration = 1500, className, suffix = "" }: Props) {
  const [value, setValue] = useState(0)
  const startRef = useRef<number | null>(null)
  const start = 0
  const diff = end - start

  useEffect(() => {
    let raf = 0
    startRef.current = null

    function step(timestamp: number) {
      if (!startRef.current) startRef.current = timestamp
      const progress = Math.min((timestamp - startRef.current) / duration, 1)
      const current = Math.floor(start + diff * progress)
      setValue(current)
      if (progress < 1) raf = requestAnimationFrame(step)
    }

    raf = requestAnimationFrame(step)

    return () => cancelAnimationFrame(raf)
  }, [end, duration, diff])

  return (
    <span className={className}>
      {value}
      {suffix}
    </span>
  )
}
