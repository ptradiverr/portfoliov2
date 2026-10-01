import { useEffect, useRef, useState } from 'react'
import './ScreenCarousel.css'

type ScreenPick = {
  title: string
  kind: 'Movie' | 'TV show'
  cover?: string
}

// Add your titles and local cover paths here, e.g. cover: '/screenart/title.jpg'.
const screenPicks: ScreenPick[] = [
  { title: 'Malcolm in the Middle', kind: 'TV show', cover: '/screenart/malcolmmiddle.jpg' },
  { title: 'Dexter', kind: 'TV show', cover: '/screenart/dexter.jpg' },
  { title: 'Movie pick 02', kind: 'Movie' },
  { title: 'TV pick 02', kind: 'TV show' },
  { title: 'Movie pick 03', kind: 'Movie' },
  { title: 'TV pick 03', kind: 'TV show' },
  { title: 'Movie pick 04', kind: 'Movie' },
  { title: 'TV pick 04', kind: 'TV show' },
]

function Cover({ pick, index }: { pick: ScreenPick; index: number }) {
  const [failed, setFailed] = useState(false)

  return (
    <div className={`screen-cover screen-color-${index % 4}`}>
      {pick.cover && !failed ? (
        <img
          src={pick.cover}
          alt={`${pick.title} cover`}
          loading="lazy"
          width="400"
          height="600"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="screen-placeholder">
          <span className="screen-placeholder-label">{pick.kind}</span>
          <span className="screen-placeholder-number" aria-hidden="true">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className="screen-placeholder-note">
            {pick.cover ? 'Cover unavailable' : 'Cover coming soon'}
          </span>
        </div>
      )}
    </div>
  )
}

export default function ScreenCarousel() {
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const offsetRef = useRef(0)
  const motionRef = useRef<{ from: number; to: number; start: number } | null>(null)

  function centerCover(button: HTMLButtonElement) {
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

  return (
    <section className="screen-section" aria-labelledby="screen-heading" aria-roledescription="carousel">
      <div className="screen-header">
        <h2 id="screen-heading">good flix</h2>
      </div>

      <div className="screen-viewport" ref={viewportRef}>
        <div className="screen-track" ref={trackRef}>
          {[0, 1].map((copy) => (
            <div className="screen-group" key={copy} aria-hidden={copy === 1 ? true : undefined}>
              {screenPicks.map((pick, index) => (
                <figure className="screen-card" key={pick.title}>
                  <button
                    className="screen-cover-button"
                    type="button"
                    aria-label={`Center ${pick.title}`}
                    tabIndex={copy === 1 ? -1 : 0}
                    onClick={(event) => centerCover(event.currentTarget)}
                    onFocus={(event) => {
                      if (event.currentTarget.matches(':focus-visible')) centerCover(event.currentTarget)
                    }}
                  >
                    <Cover pick={pick} index={index} />
                  </button>
                  <figcaption>
                    <h3>{pick.title}</h3>
                    <span>{pick.kind}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
