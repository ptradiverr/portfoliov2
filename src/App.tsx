import './App.css'

const tagline = '... and this is my website'

function App() {
  return (
    <div className="hero">
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
              <img src="/gameart/chaoshead.jpg" alt="Chaos;Head game cover" />
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
    </div>
  )
}

export default App
