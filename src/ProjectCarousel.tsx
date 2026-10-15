import { projects } from './projects'
import { useRollingCarousel } from './useRollingCarousel'
import './ScreenCarousel.css'
import './ProjectCarousel.css'

export default function ProjectCarousel() {
  const { viewportRef, trackRef, centerItem } = useRollingCarousel()
  // Repeat small collections so the loop stays filled while more projects are added.
  const repetitions = projects.length ? Math.ceil(4 / projects.length) : 0
  const cards = Array.from({ length: repetitions }, () => projects).flat()

  return (
    <section id="projects" className="projects-section project-showcase" aria-labelledby="projects-heading" aria-roledescription="carousel">
      <div className="project-showcase-header">
        <p className="section-label">02 / PROJECTS</p>
        <h2 id="projects-heading">things I've worked on:</h2>
      </div>

      <div className="screen-viewport" ref={viewportRef}>
        <div className="screen-track" ref={trackRef}>
          {[0, 1].map((copy) => (
            <div className="screen-group" key={copy} aria-hidden={copy === 1 ? true : undefined}>
              {cards.map((project, index) => {
                const duplicate = copy === 1 || index >= projects.length
                return (
                  <a
                    className="project-tile"
                    key={`${project.slug}-${index}`}
                    href={`/projects/${project.slug}`}
                    aria-hidden={duplicate ? true : undefined}
                    tabIndex={duplicate ? -1 : 0}
                    onFocus={(event) => {
                      if (event.currentTarget.matches(':focus-visible')) centerItem(event.currentTarget)
                    }}
                  >
                    {project.image ? (
                      <img className="project-tile-image" src={project.image.src} alt="" loading="lazy" />
                    ) : (
                    <div className={`project-tile-art screen-color-${index % projects.length % 4}`} aria-hidden="true">
                      <span>PROJECT NOTES</span>
                      <span className="project-tile-number">{String(index % projects.length + 1).padStart(2, '0')}</span>
                      <span>{project.tags.join(' / ')}</span>
                    </div>
                    )}
                    <div className="project-tile-copy">
                      <h3>{project.title}</h3>
                      <p>{project.summary}</p>
                      <span className="project-tile-link">Read project <span aria-hidden="true">↗</span></span>
                    </div>
                  </a>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
