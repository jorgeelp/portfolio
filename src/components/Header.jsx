import { useEffect, useState } from 'react'
import Icon from './Icon.jsx'
import { modKey } from './CommandPalette.jsx'

export default function Header({ t, ids, active, lang, setLang, theme, setTheme, onPalette }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const on = () => setScrolled(scrollY > 8)
    on()
    addEventListener('scroll', on, { passive: true })
    return () => removeEventListener('scroll', on)
  }, [])
  // Esc cierra el menú móvil
  useEffect(() => {
    if (!open) return
    const on = e => e.key === 'Escape' && setOpen(false)
    addEventListener('keydown', on)
    return () => removeEventListener('keydown', on)
  }, [open])

  return (
    <header className={`header${scrolled || open ? ' scrolled' : ''}`}>
      <a href="#top" className="brand" onClick={() => setOpen(false)}>
        <span className="brand-mark mono">JL</span>
        <span className="brand-name">Jorge Lei León</span>
      </a>
      <nav className={open ? 'nav open' : 'nav'} aria-label="Secciones">
        {ids.map((id, i) => (
          <a key={id} href={`#${id}`} className={active === id ? 'active' : ''} onClick={() => setOpen(false)}>
            <span className="nav-index mono">0{i + 1}</span>{t.nav[id]}
          </a>
        ))}
      </nav>
      <div className="toggles">
        <button className="kbd-btn" onClick={onPalette} aria-label={t.palette.open} title={`${t.palette.open} (${modKey} K)`}>
          <Icon name="search" size={16} /><kbd className="mono">{modKey} K</kbd>
        </button>
        <button className="lang-toggle mono" onClick={() => setLang(lang === 'es' ? 'en' : 'es')} aria-label="Language">
          <span className={lang === 'es' ? 'on' : ''}>ES</span><span className={lang === 'en' ? 'on' : ''}>EN</span>
        </button>
        <button className="icon-btn" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label={t.theme}>
          <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
        </button>
        <button className={open ? 'menu-btn open' : 'menu-btn'} aria-label="Menú" aria-expanded={open} onClick={() => setOpen(!open)}>
          <span /><span />
        </button>
      </div>
    </header>
  )
}
