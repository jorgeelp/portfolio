import { useState } from 'react'
import { useTypewriter } from '../hooks.js'
import { contact } from '../data.js'

export default function Hero({ t }) {
  const role = useTypewriter(t.hero.roles)
  const [photo, setPhoto] = useState(true)
  return (
    <section id="top" className="hero">
      <div className="hero-text">
        <p className="mono accent">{t.hero.hello}</p>
        <h1>Jorge Lei León</h1>
        <p className="role mono" aria-label={t.hero.roles.join(', ')}>&gt; {role}<span className="cursor">_</span></p>
        <p className="muted">📍 {t.hero.location}</p>
        <div className="hero-actions">
          <a href="#projects" className="btn primary">{t.hero.cta}</a>
          <a href={contact.cv} download className="btn">{t.hero.cv} ↓</a>
        </div>
        <div className="socials">
          <a href={contact.github} target="_blank" rel="noopener">GitHub</a>
          <a href={contact.linkedin} target="_blank" rel="noopener">LinkedIn</a>
          <a href={`mailto:${contact.email}`}>Email</a>
        </div>
      </div>
      <div className="avatar">
        {/* pon tu foto en public/foto.jpg; si no existe se muestran las iniciales */}
        {photo ? <img src="./foto.jpg" alt="Jorge Lei León" onError={() => setPhoto(false)} /> : <span>JL</span>}
      </div>
    </section>
  )
}
