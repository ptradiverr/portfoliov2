import { useEffect, useState } from 'react'
import { projects, type ProjectWriteup } from './projects'
import { useRollingCarousel } from './useRollingCarousel'
import './ScreenCarousel.css'
import './ProjectCarousel.css'

const tags = [...new Set(projects.flatMap((project) => project.tags))].sort((a, b) => a.localeCompare(b))

function ProjectCard({ project, index, duplicate = false, onFocus }: {
  project: ProjectWriteup
  index: number
  duplicate?: boolean
  onFocus?: (element: HTMLAnchorElement) => void
}) {
  return (
    <a
      className="project-tile"
      href={`/projects/${project.slug}`}
      aria-hidden={duplicate ? true : undefined}
      tabIndex={duplicate ? -1 : 0}
      onFocus={(event) => {
        if (event.currentTarget.matches(':focus-visible')) onFocus?.(event.currentTarget)
      }}
    >
      {project.image ? (
        <img
          className={`project-tile-image${project.image.previewFit === 'contain' ? ' project-tile-image-contain' : ''}`}
          src={project.image.src}
          alt=""
          loading="lazy"
        />
      ) : (
        <div className={`project-tile-art screen-color-${index % 4}`} aria-hidden="true">
          <span>PROJECT NOTES</span>
          <span className="project-tile-number">{String(index + 1).padStart(2, '0')}</span>
          <span>{project.tags.join(' / ')}</span>
        </div>
      )}
      <div className="project-tile-copy">
        <h3>{project.title}</h3>
        <p>{project.summary}</p>
        <ul className="project-card-tags" aria-label="Tags">
          {project.tags.map((tag) => <li key={tag}>{tag}</li>)}
        </ul>
        <span className="project-tile-link">Read project <span aria-hidden="true">↗</span></span>
      </div>
    </a>
  )
}

function RollingProjectCards() {
  const { viewportRef, trackRef, centerItem } = useRollingCarousel()
  // Repeat small collections so the loop stays filled while more projects are added.
  const repetitions = projects.length ? Math.ceil(4 / projects.length) : 0
  const cards = Array.from({ length: repetitions }, () => projects).flat()

  return (
    <div className="screen-viewport" ref={viewportRef} aria-roledescription="carousel">
      <div className="screen-track" ref={trackRef}>
        {[0, 1].map((copy) => (
          <div className="screen-group" key={copy} aria-hidden={copy === 1 ? true : undefined}>
            {cards.map((project, index) => (
              <ProjectCard
                key={`${project.slug}-${index}`}
                project={project}
                index={index % projects.length}
                duplicate={copy === 1 || index >= projects.length}
                onFocus={centerItem}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ProjectCarousel() {
  const [tagsOpen, setTagsOpen] = useState(false)
  const [query, setQuery] = useState(() => new URLSearchParams(window.location.search).get('q') ?? '')
  const [selectedTag, setSelectedTag] = useState(() => {
    const tag = new URLSearchParams(window.location.search).get('tag') ?? ''
    return tags.includes(tag) ? tag : ''
  })
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean)
  const filtering = terms.length > 0 || selectedTag !== ''
  const matches = projects.filter((project) => {
    const text = [project.title, project.summary, ...project.tags].join(' ').toLowerCase()
    return (!selectedTag || project.tags.includes(selectedTag)) && terms.every((term) => text.includes(term))
  })

  useEffect(() => {
    const url = new URL(window.location.href)
    if (query.trim()) url.searchParams.set('q', query.trim())
    else url.searchParams.delete('q')
    if (selectedTag) url.searchParams.set('tag', selectedTag)
    else url.searchParams.delete('tag')
    window.history.replaceState(window.history.state, '', url)
  }, [query, selectedTag])

  function clearFilters() {
    setQuery('')
    setSelectedTag('')
  }

  return (
    <section id="projects" className="projects-section project-showcase" aria-labelledby="projects-heading">
      <div className="project-showcase-header">
        <p className="section-label">02 / PROJECTS</p>
        <h2 id="projects-heading">things I've worked on:</h2>
      </div>

      <div className="project-filters">
        <label className="project-search">
          <span>Search articles</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Try networking, Linux, or Wi-Fi…"
            aria-controls="project-results"
          />
        </label>
        <button
          className="project-tag-toggle"
          type="button"
          aria-expanded={tagsOpen}
          aria-controls="project-tag-options"
          onClick={() => setTagsOpen(!tagsOpen)}
        >
          All tags <span aria-hidden="true">{tagsOpen ? '▴' : '▾'}</span>
        </button>
        <div id="project-tag-options" className="project-tag-filters" role="group" aria-label="Filter articles by tag" hidden={!tagsOpen}>
          <button type="button" aria-pressed={selectedTag === ''} aria-controls="project-results" onClick={() => setSelectedTag('')}>Any tag</button>
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              aria-pressed={selectedTag === tag}
              aria-controls="project-results"
              onClick={() => setSelectedTag(selectedTag === tag ? '' : tag)}
            >
              {tag}
            </button>
          ))}
        </div>
        <div className="project-filter-status">
          <p role="status">{matches.length} {matches.length === 1 ? 'article' : 'articles'}{filtering ? ' found' : ''}{selectedTag ? ` · ${selectedTag}` : ''}</p>
          {filtering && <button type="button" onClick={clearFilters}>Clear filters</button>}
        </div>
      </div>

      <div id="project-results">
        {filtering ? (
          matches.length > 0 ? (
            <div className="project-results-grid">
              {matches.map((project) => (
                <ProjectCard key={project.slug} project={project} index={projects.indexOf(project)} />
              ))}
            </div>
          ) : (
            <div className="project-empty">
              <p>No articles match your search and tag. Try another term or clear the filters.</p>
            </div>
          )
        ) : <RollingProjectCards />}
      </div>
    </section>
  )
}
