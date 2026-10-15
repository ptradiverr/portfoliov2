import { useState } from 'react'
import { useRollingCarousel } from './useRollingCarousel'
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
  const { viewportRef, trackRef, centerItem } = useRollingCarousel()

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
                    onClick={(event) => centerItem(event.currentTarget)}
                    onFocus={(event) => {
                      if (event.currentTarget.matches(':focus-visible')) centerItem(event.currentTarget)
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
