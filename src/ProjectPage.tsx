import { useEffect } from 'react'
import { projects } from './projects'
import './ProjectPage.css'

export default function ProjectPage({ slug }: { slug: string }) {
  const project = projects.find((entry) => entry.slug === slug)

  useEffect(() => {
    document.title = `${project?.title ?? 'Project not found'} | Ruibing`
  }, [project])

  return (
    <main className="project-page">
      <nav className="writeup-nav" aria-label="Project navigation">
        <a href="/#projects">← Back to projects</a>
        <a href="/#contact">Get in touch ↗</a>
      </nav>

      {project ? (
        <article>
          <header className="writeup-header">
            <p className="writeup-label">PROJECT NOTES</p>
            <h1>{project.title}</h1>
            <p className="writeup-summary">{project.summary}</p>
            {project.tags.length > 0 && (
              <ul className="writeup-tags" aria-label="Tools and technologies">
                {project.tags.map((tag) => <li key={tag}>{tag}</li>)}
              </ul>
            )}
          </header>

          <div className="writeup-body">
            {project.image && (
              <figure className="writeup-figure">
                <img className="writeup-image" src={project.image.src} alt={project.image.alt} />
                {project.image.caption && <figcaption>{project.image.caption}</figcaption>}
              </figure>
            )}
            {project.sections.map((section, index) => (
              <section className="writeup-section" key={index} aria-labelledby={`writeup-section-${index}`}>
                <div className="writeup-section-heading">
                  <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                  <h2 id={`writeup-section-${index}`}>{section.heading}</h2>
                </div>
                <div className="writeup-copy">
                  {section.paragraphs.map((paragraph, paragraphIndex) => (
                    <p key={paragraphIndex}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </article>
      ) : (
        <header className="writeup-header">
          <h1>Project not found.</h1>
          <p className="writeup-summary">This project page isn’t available. Head back to projects to explore more.</p>
        </header>
      )}

      <footer className="writeup-footer">
        <a href="/#projects">← Back to projects</a>
      </footer>
    </main>
  )
}
