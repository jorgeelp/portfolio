import { useReveal } from '../hooks.js'

export default function Section({ id, title, index, children }) {
  const ref = useReveal()
  return (
    <section id={id} ref={ref} className="section reveal">
      <header className="section-head">
        <span className="section-index mono">0{index}</span>
        <h2 className="section-title">{title}</h2>
      </header>
      <div className="section-body">{children}</div>
    </section>
  )
}
