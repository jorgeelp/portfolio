import { useState } from 'react'

export default function Header({ t, ids, active, lang, setLang, theme, setTheme }) {
  const [open, setOpen] = useState(false)
  return (
    <header className="header">
      <a href="#top" className="logo mono">&lt;JL /&gt;</a>
      <button className="menu-btn" aria-label="Menú" aria-expanded={open} onClick={() => setOpen(!open)}>
        <span /><span /><span />
      </button>
      <nav className={open ? 'nav open' : 'nav'} aria-label="Secciones">
        {ids.map(id => (
          <a key={id} href={`#${id}`} className={active === id ? 'active' : ''} onClick={() => setOpen(false)}>{t.nav[id]}</a>
        ))}
        <div className="toggles">
          <button onClick={() => setLang(lang === 'es' ? 'en' : 'es')} aria-label="Language">{lang === 'es' ? 'EN' : 'ES'}</button>
          <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label={t.theme}>{theme === 'dark' ? '☀' : '☾'}</button>
        </div>
      </nav>
    </header>
  )
}
