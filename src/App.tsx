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
          <div className="book-cover" role="img" aria-label="Book cover placeholder">
            <span>Book<br />cover</span>
          </div>
          <p>Currently reading</p>
        </aside>
        <aside className="currently-playing" aria-label="Currently playing">
          <div className="game-cover" role="img" aria-label="Game cover placeholder">
            <span>Game<br />cover</span>
          </div>
          <p>Currently playing</p>
        </aside>
      </div>
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
