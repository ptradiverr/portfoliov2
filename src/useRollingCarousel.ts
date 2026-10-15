import { useEffect, useRef } from 'react'

export function useRollingCarousel() {
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const offsetRef = useRef(0)
  const motionRef = useRef<{ from: number; to: number; start: number } | null>(null)

  function centerItem(button: HTMLElement) {
    const viewport = viewportRef.current
    const track = trackRef.current
    if (!viewport || !track) return

    const bounds = viewport.getBoundingClientRect()
    const card = button.getBoundingClientRect()
    const loopWidth = track.getBoundingClientRect().width / 2
    if (!loopWidth) return

    // Use the nearest repeated copy, including when keyboard focus is offscreen.
    const distance = bounds.left + bounds.width / 2 - (card.left + card.width / 2)
    const shortestDistance = distance - Math.round(distance / loopWidth) * loopWidth
    const now = performance.now()
    motionRef.current = {
      from: offsetRef.current,
      to: offsetRef.current + shortestDistance,
      start: now,
    }
  }

  useEffect(() => {
    const track = trackRef.current
    const viewport = viewportRef.current
    if (!track || !viewport) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let loopWidth = track.getBoundingClientRect().width / 2
    let previousTime = performance.now()
    let frame = 0
    const observer = new ResizeObserver(() => {
      loopWidth = track.getBoundingClientRect().width / 2
      motionRef.current = null
    })
    observer.observe(track)

    function tick(now: number) {
      const elapsed = Math.min(now - previousTime, 50)
      previousTime = now
      const motion = motionRef.current
      if (motion) {
        const progress = reducedMotion.matches ? 1 : Math.min((now - motion.start) / 650, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        offsetRef.current = motion.from + (motion.to - motion.from) * eased
        if (progress === 1) motionRef.current = null
      } else if (!reducedMotion.matches) {
        offsetRef.current -= elapsed * 0.04
      }

      if (loopWidth > 0) {
        // Keep two identical groups in view for seamless movement in either direction.
        offsetRef.current = ((offsetRef.current % loopWidth) - loopWidth) % loopWidth
        track!.style.transform = `translateX(${offsetRef.current}px)`
      }
      // Keyboard focus must not introduce a second, native scroll offset.
      viewport!.scrollLeft = 0
      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [])

  return { viewportRef, trackRef, centerItem }
}
