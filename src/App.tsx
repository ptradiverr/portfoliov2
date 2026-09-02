import './App.css'

const tagline = '... and this is my website'

function App() {
  return (
    <>
      <section className="hero">
        <nav className="site-nav" aria-label="Main navigation">
          <a href="#about">About</a>
          <a href="#projects">Projects</a>
          <a href="#contact">Contact</a>
        </nav>

        <div className="media-cards">
          <aside className="currently-reading" aria-label="Currently reading">
            <div className="book-cover">
              <a
                href="https://openlibrary.org/books/OL29848846M/Can%27t_Even"
                target="_blank"
                rel="noreferrer"
                aria-label="Open Can't Even on Open Library"
              >
                <img src="/bookart/canteven.jpg" alt="Can't Even book cover" />
              </a>
            </div>
            <p>Currently reading</p>
          </aside>

          <div className="background-card" aria-hidden="true" />

          <aside className="currently-playing" aria-label="Currently playing">
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

        <figure className="car-card">
          <img src="/cars/car.jpg" alt="Car" />
        </figure>

        <div className="intro">
          <h1 className="hero-title">hi, i'm Ruibing</h1>

          <p className="hero-tagline" aria-label={tagline}>
            {Array.from(tagline).map((letter, index) => (
              <span
                aria-hidden="true"
                key={`${letter}-${index}`}
                style={{ animationDelay: `${700 + index * 55}ms` }}
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
          <p className="section-label">01 / ABOUT</p>

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
              working within the domains of infrastructure, security, and
              technology.
            </p>

            <p>
              I spend a lot of my time working with networks, cloud
              infrastructure, cybersecurity, and the systems that connect
              everything together. I'm especially interested in understanding
              how things work underneath the surface and then building
              something with that knowledge.
            </p>

            <p>
              Outside of school and work, you'll usually find me working on
              tech projects, reading, gaming, or finding something
              new to learn.
            </p>
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="projects-section">
        <p className="section-label">02 / PROJECTS</p>
        <h2>things I've worked on:</h2>
      </section>

<section id="contact" className="contact-section">
  <div className="contact-content">
    <p className="section-label">03 / CONTACT</p>

    <h2>
      reach me @
    </h2>

    <div className="contact-links">
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
</section>
    </>
  )
}

export default App