import { useEffect, useState } from 'react'
import './App.css'
import ScreenCarousel from './ScreenCarousel'

type Car = {
  image: string
  name: string
  info: string
}

/* type Project = {
  title: string
  description: string
  image: string
  link: string
} */

const tagline = '... and this is my website'
const showCarPanels = false

function App() {
  const cars: Car[] = [
    {
      image: '/cars/rcf.jpg',
      name: '2015 Lexus RC F',
      info: 'Ultrasonic Blue Mica · 5.0L naturally aspirated V8 · 472 hp',
    },
    {
      image: '/cars/is350.jpg',
      name: '✖ Lexus IS 350',
      info: 'Ultra White · 3.5L naturally aspirated V6 · 311 hp',
    },
    {
      image: '/cars/honda.jpg',
      name: '✖ 2015 Honda CRV',
      info: 'The OG',
    },
  ]

/*   const projects: Project[] = [
    {
      title: 'Wi-Fi 7 MLO Research',
      description:
        '802.11be Multi-Link Operation in a classroom environment.',
      image: '/projects/wifi7.jpg',
      link: '#',
    },
    {
      title: 'Portfolio',
      description:
        'My personal portfolio and experiments on the web.',
      image: '/projects/portfolio.jpg',
      link: '#',
    },
    {
      title: 'Homelab',
      description:
        'Networking, virtualization, containers, and infrastructure.',
      image: '/projects/homelab.jpg',
      link: '#',
    },
  ] */

  const [currentCar, setCurrentCar] = useState(0)
  const [hoveredCar, setHoveredCar] = useState<Car | null>(null)
  const [mousePosition, setMousePosition] = useState({
    x: 0,
    y: 0,
  })
/*   const [currentProject, setCurrentProject] = useState(0) */

  useEffect(() => {
    if (!showCarPanels || hoveredCar) return

    const interval = setInterval(() => {
      setCurrentCar((current) => (current + 1) % cars.length)
    }, 4500)

    return () => clearInterval(interval)
  }, [hoveredCar, cars.length])

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <nav className="site-nav" aria-label="Main navigation">
          <a href="#about">About</a>
          <a href="#projects">Projects</a>
          <a href="#contact">Contact</a>
        </nav>

        <div className="media-cards">
          {/* CURRENTLY READING */}
          <aside
            className="currently-reading"
            aria-label="Currently reading"
          >
            <div className="book-cover">
              <a
                href="https://openlibrary.org/works/OL20153626W/Bullshit_Jobs"
                target="_blank"
                rel="noreferrer"
                aria-label="Open Can't Even on Open Library"
              >
                <img
                  src="/bookart/bsjobs.jpg"
                  alt="Bullsh*t jobs book cover"
                />
              </a>
            </div>

            <p>Currently reading</p>
          </aside>

          <div className="background-card" aria-hidden="true" />

          {/* CURRENTLY PLAYING */}
          <aside
            className="currently-playing"
            aria-label="Currently playing"
          >
            <div className="game-cover">
              <a
                href="https://store.steampowered.com/app/1961950/CHAOSHEAD_NOAH/"
                target="_blank"
                rel="noreferrer"
                aria-label="Open Chaos;Head Noah on Steam"
              >
                <img
                  src="/gameart/chaoshead.jpg"
                  alt="Chaos;Head game cover"
                />
              </a>
            </div>

            <p>Currently playing</p>
          </aside>
        </div>

        {/* CAROUSEL */}
        {showCarPanels && <div className="car-carousel">
          {cars.map((car, index) => {
            const position =
              (index - currentCar + cars.length) % cars.length

            return (
              <figure
                key={car.image}
                className={`car-card car-position-${position}`}
                onMouseEnter={() => setHoveredCar(car)}
                onMouseLeave={() => setHoveredCar(null)}
                onMouseMove={(e) => {
                  setMousePosition({
                    x: e.clientX,
                    y: e.clientY,
                  })
                }}
              >
                <img src={car.image} alt={car.name} />
              </figure>
            )
          })}
        </div>}

        {/* CAR TOOLTIP */}
        {showCarPanels && hoveredCar && (
          <div
            className="car-tooltip"
            style={{
              left: mousePosition.x + 18,
              top: mousePosition.y + 18,
            }}
          >
            <strong>{hoveredCar.name}</strong>
            <span>{hoveredCar.info}</span>
          </div>
        )}

        {/* HERO INTRO */}
        <div className="intro">
          <h1 className="hero-title">hi, i'm Ruibing</h1>

          <p className="hero-tagline" aria-label={tagline}>
            {Array.from(tagline).map((letter, index) => (
              <span
                aria-hidden="true"
                key={`${letter}-${index}`}
                style={{
                  animationDelay: `${700 + index * 55}ms`,
                }}
              >
                {letter}
              </span>
            ))}
          </p>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="about-section">
        <div className="about-content">
          <p className="section-label">ABOUT</p>

          <h2>
            i like building things
            <br />
            and figuring out how
            <br />
            they work.
          </h2>

          <div className="about-text">
            <p>
              I'm a cybersecurity and networking student who enjoys
              working within the domains of infrastructure, security,
              and technology.
            </p>

            <p>
              I spend a lot of my time working with networks, cloud
              infrastructure, and the systems that connect
              everything together. I'm especially interested in
              understanding how things work underneath the surface
              and then building something with that knowledge.
            </p>

            <p>
              Outside of school and work, you'll usually find me
              working on tech projects, reading, gaming, or finding
              something new to learn.
            </p>
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="projects-section">
        <div className="projects-content">
          <p className="section-label">02 / PROJECTS</p>

          <h2>things I've worked on:</h2>

{/*           <div className="project-carousel">
            {projects.map((project, index) => {
              const position =
                (index - currentProject + projects.length) %
                projects.length

              return (
                <a
                  key={project.title}
                  href={project.link}
                  target="_blank"
                  rel="noreferrer"
                  className={`project-card project-position-${position}`}
                >
                  <div className="project-image">
                    <img
                      src={project.image}
                      alt={project.title}
                    />
                  </div>

                  <div className="project-info">
                    <span className="project-number">
                      {String(index + 1).padStart(2, '0')}
                    </span>

                    <div>
                      <h3>{project.title}</h3>
                      <p>{project.description}</p>
                    </div>

                    <span className="project-arrow">↗</span>
                  </div>
                </a>
              )
            })}
          </div>

          <div className="project-controls">
            <button
              onClick={() =>
                setCurrentProject(
                  (currentProject - 1 + projects.length) %
                    projects.length
                )
              }
              aria-label="Previous project"
            >
              ←
            </button>

            <span>
              {String(currentProject + 1).padStart(2, '0')} /{' '}
              {String(projects.length).padStart(2, '0')}
            </span>

            <button
              onClick={() =>
                setCurrentProject(
                  (currentProject + 1) % projects.length
                )
              }
              aria-label="Next project"
            >
              →
            </button>
          </div> */}
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="contact-section">
        <div className="contact-content">
          <p className="section-label">CONTACT</p>

          <h2>find me @</h2>

          <div className="contact-links">
            {/* LINKEDIN */}
            <a
              href="https://www.linkedin.com/in/ruibingfeng/"
              target="_blank"
              rel="noreferrer"
              className="contact-link"
            >
              <img src="/icons/linkedin.png" alt="" />
              <span>LinkedIn</span>
              <span className="contact-arrow">↗</span>
            </a>

            {/* GITHUB */}
            <a
              href="https://www.github.com/ptradiverr"
              target="_blank"
              rel="noreferrer"
              className="contact-link"
            >
              <img src="/icons/github.png" alt="" />
              <span>GitHub</span>
              <span className="contact-arrow">↗</span>
            </a>

            {/* EMAIL */}
            <a
              href="mailto:ruibing@rfeng.me"
              className="contact-link"
            >
              <span className="email-icon">✉</span>
              <span>Email</span>
              <span className="contact-arrow">↗</span>
            </a>
          </div>
        </div>

        {/*
        <div className="other-links-section">
          <p className="other-links-title">other links</p>

          <div className="other-links">
            <a
              href="https://steamcommunity.com/id/7deag-/"
              target="_blank"
              rel="noreferrer"
              className="other-link"
            >
              <span>Steam</span>
              <span className="contact-arrow">↗</span>
            </a>
          </div>
        </div>
        */}
      </section>
      <ScreenCarousel />
    </>
  )
}

export default App
