import { useReveal } from '../hooks.js'

export default function Section({ id, title, index, children }) {
  const ref = useReveal()
  return (
    <section id={id} ref={ref} className="section reveal">
      <h2 className="section-title"><span className="mono">0{index}.</span> {title}</h2>
      {children}
    </section>
  )
}
