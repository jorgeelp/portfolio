import { useEffect } from 'react'
import Icon from './Icon.jsx'

// 404 con guiño al proyecto de la biblioteca: una ficha de préstamo de un libro que nunca vuelve
export default function NotFound({ t }) {
  const n = t.notFound
  useEffect(() => { window.scrollTo(0, 0) }, [])
  return (
    <section className="not-found">
      <div className="nf-text">
        <p className="nf-code">404</p>
        <h1>{n.title}</h1>
        <p className="muted">{n.text}</p>
        <a href="#top" className="btn primary"><Icon name="back" size={16} /> {n.back}</a>
      </div>
      <div className="nf-card" aria-hidden="true">
        <p className="nf-card-head mono">Biblioteca · Jorge Lei León</p>
        <dl className="mono">
          {n.fields.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
        </dl>
        <span className="nf-stamp mono">{n.fields[1][1]}</span>
      </div>
    </section>
  )
}
