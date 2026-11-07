import { useEffect, useRef } from 'react'
import renderMathInElement from 'katex/contrib/auto-render'
import 'katex/dist/katex.min.css'

export default function Latex({ children }: { children: string }) {
  const element = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!element.current) return

    // Reset the text before rendering, including when React reruns the effect.
    element.current.textContent = children
    renderMathInElement(element.current, {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '\\(', right: '\\)', display: false },
        { left: '$', right: '$', display: false },
        { left: '\\[', right: '\\]', display: true },
      ],
      throwOnError: false,
    })
  }, [children])

  return <span ref={element} />
}
