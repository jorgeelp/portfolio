import { useState } from 'react'
import { useTypewriter, useClock } from '../hooks.js'
import { contact } from '../data.js'
import Icon from './Icon.jsx'

// el foco de la trama de puntos sigue al ratón (solo con ratón, no en táctil)
const follow = e => {
  if (e.pointerType !== 'mouse') return
  const r = e.currentTarget.getBoundingClientRect()
  e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
  e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
}

export default function Hero({ t, lang }) {
  const role = useTypewriter(t.hero.roles)
  const time = useClock('Europe/Madrid', lang)
  const [photo, setPhoto] = useState(true)
  return (
    <section id="top" className="hero" onPointerMove={follow}>
      <div className="hero-spot" aria-hidden="true" />
      <div className="hero-text">
        <h1>Jorge <em>Lei León</em></h1>
        <p className="role mono" aria-label={t.hero.roles.join(', ')}>
          <span className="accent">~/</span> {role}<span className="cursor" aria-hidden="true" />
        </p>
        <p className="meta">
          <Icon name="pin" size={16} /> {t.hero.location}
          <span className="meta-sep" aria-hidden="true">·</span>
          <span className="mono small"><time>{time}</time> {t.hero.localTime}</span>
        </p>
        <div className="hero-actions">
          <a href="#projects" className="btn primary">{t.hero.cta} <Icon name="arrow" size={16} /></a>
          <a href={contact.cv} download className="btn">{t.hero.cv} <Icon name="download" size={16} /></a>
        </div>
        <div className="socials">
          <a href={contact.github} target="_blank" rel="noopener"><Icon name="github" size={16} />GitHub</a>
          <a href={contact.linkedin} target="_blank" rel="noopener"><Icon name="linkedin" size={16} />LinkedIn</a>
          <a href={`mailto:${contact.email}`}><Icon name="mail" size={16} />Email</a>
        </div>
      </div>
      <div className="portrait">
        {/* pon tu foto en public/foto.jpg; si no existe se muestran las iniciales */}
        <div className="portrait-frame">
          {photo ? <img src="./foto.jpg" alt="Jorge Lei León" onError={() => setPhoto(false)} /> : <span>JL</span>}
        </div>
        <span className="portrait-tag mono" aria-hidden="true">{'<dev />'}</span>
      </div>
    </section>
  )
}
