import { useState } from 'react'

export default function InteractiveNotebook({ src, title }: { src: string; title: string }) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div className="writeup-interactive">
      <div className="writeup-interactive-toolbar">
        <span>{title}</span>
        <a href={src} target="_blank" rel="noopener noreferrer">Open in a new tab ↗</a>
      </div>
      {loaded ? (
        <iframe
          className="writeup-interactive-frame"
          src={src}
          title={title}
          sandbox="allow-scripts allow-downloads"
        />
      ) : (
        <div className="writeup-interactive-intro">
          <p>Watch packets move, advance one ACK at a time, and explore the live equations.</p>
          <button type="button" onClick={() => setLoaded(true)}>Launch interactive notebook →</button>
        </div>
      )}
    </div>
  )
}
