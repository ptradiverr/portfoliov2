import { useEffect, useRef } from 'react'

const RESUME_DELAY_MS = 1800
const SPEED_PX_PER_MS = 0.04

export function useRollingCarousel() {
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const positionRef = useRef(0)
  const motionRef = useRef<{ from: number; to: number; start: number } | null>(null)

  function centerItem(button: HTMLElement) {
    const viewport = viewportRef.current
    const group = trackRef.current?.firstElementChild
    if (!viewport || !group) return

    const bounds = viewport.getBoundingClientRect()
    const card = button.getBoundingClientRect()
    const loopWidth = group.getBoundingClientRect().width
    if (!loopWidth) return

    // Center the nearest identical copy rather than traversing a whole loop.
    const distance = bounds.left + bounds.width / 2 - (card.left + card.width / 2)
    const shortestDistance = distance - Math.round(distance / loopWidth) * loopWidth
    positionRef.current = viewport.scrollLeft
    motionRef.current = {
      from: viewport.scrollLeft,
      to: viewport.scrollLeft - shortestDistance,
      start: performance.now(),
    }
  }

  useEffect(() => {
    const track = trackRef.current
    const viewport = viewportRef.current
    if (!track || !viewport) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let loopWidth = 0
    let previousTime = performance.now()
    let pauseUntil = 0
    let pointerDown = false
    let lastWrittenPosition = viewport.scrollLeft
    let frame = 0

    function writePosition() {
      viewport!.scrollLeft = positionRef.current
      // Read back the browser's rounded value; keep fractional autoplay progress
      // separately so slow motion works even when scrollLeft rounds to pixels.
      lastWrittenPosition = viewport!.scrollLeft
    }

    function measure() {
      const nextWidth = track!.firstElementChild?.getBoundingClientRect().width ?? 0
      if (!nextWidth) return
      positionRef.current = loopWidth ? positionRef.current * nextWidth / loopWidth : nextWidth
      loopWidth = nextWidth
      motionRef.current = null
      writePosition()
    }

    function pause() {
      pauseUntil = performance.now() + RESUME_DELAY_MS
    }

    function onPointerDown() {
      pointerDown = true
      motionRef.current = null
      pause()
    }

    function onPointerEnd() {
      if (!pointerDown) return
      pointerDown = false
      pause()
    }

    function onWheel() {
      motionRef.current = null
      pause()
    }

    function onScroll() {
      // Native touch, momentum, trackpad, and keyboard scrolling own the position
      // during interaction. Autoplay's own scroll events must not pause it.
      if (viewport!.scrollLeft === lastWrittenPosition) return
      lastWrittenPosition = viewport!.scrollLeft
      // Focus centering may already have adopted this native scroll position.
      if (lastWrittenPosition === positionRef.current) return
      positionRef.current = lastWrittenPosition
      motionRef.current = null
      pause()
    }

    function tick(now: number) {
      const elapsed = Math.max(0, Math.min(now - previousTime, 50))
      previousTime = now
      // A native scroll can arrive before its asynchronously dispatched event.
      if (viewport!.scrollLeft !== lastWrittenPosition) onScroll()

      const motion = motionRef.current
      if (motion && !pointerDown) {
        const progress = reducedMotion.matches ? 1 : Math.min((now - motion.start) / 650, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        positionRef.current = motion.from + (motion.to - motion.from) * eased
        if (progress === 1) motionRef.current = null
      } else if (!pointerDown && now >= pauseUntil && !reducedMotion.matches &&
                 !viewport!.contains(document.activeElement) && !document.hidden) {
        positionRef.current += elapsed * SPEED_PX_PER_MS
      }

      if (loopWidth > 0) {
        // Three copies leave native swipe space on both sides. Wrap by a whole
        // group, preserving the same visible cards and any centering animation.
        const lower = loopWidth / 2
        const wrapped = ((positionRef.current - lower) % loopWidth + loopWidth) % loopWidth + lower
        const shift = wrapped - positionRef.current
        positionRef.current = wrapped
        if (motionRef.current && Math.abs(shift) > 0.01) {
          motionRef.current.from += shift
          motionRef.current.to += shift
        }
        if (Math.abs(viewport!.scrollLeft - positionRef.current) > 0.01) writePosition()
      }
      frame = requestAnimationFrame(tick)
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(track)
    observer.observe(viewport)
    viewport.addEventListener('scroll', onScroll, { passive: true })
    viewport.addEventListener('pointerdown', onPointerDown, { passive: true })
    viewport.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('pointerup', onPointerEnd, { passive: true })
    window.addEventListener('pointercancel', onPointerEnd, { passive: true })
    frame = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      viewport.removeEventListener('scroll', onScroll)
      viewport.removeEventListener('pointerdown', onPointerDown)
      viewport.removeEventListener('wheel', onWheel)
      window.removeEventListener('pointerup', onPointerEnd)
      window.removeEventListener('pointercancel', onPointerEnd)
      motionRef.current = null
    }
  }, [])

  return { viewportRef, trackRef, centerItem }
}
