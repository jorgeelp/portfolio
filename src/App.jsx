import { useEffect, useMemo, useState } from 'react'
import { texts, skills, projects, contact } from './data.js'
import { useStored, useActiveSection, useRoute } from './hooks.js'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import Section from './components/Section.jsx'
import Projects from './components/Projects.jsx'
import Timeline from './components/Timeline.jsx'
import Contact from './components/Contact.jsx'
import ProjectPage from './components/ProjectPage.jsx'
import NotFound from './components/NotFound.jsx'
import CommandPalette from './components/CommandPalette.jsx'
import Terminal from './components/Terminal.jsx'

const ids = ['about', 'projects', 'experience', 'skills', 'contact']
const systemTheme = () => (window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark')
const konami = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a']

export default function App() {
  const [lang, setLang] = useStored('lang', 'es')
  const [theme, setTheme] = useStored('theme', systemTheme())
  const [palette, setPalette] = useState(false)
  const [terminal, setTerminal] = useState(false)
  const [toast, setToast] = useState(null)
  const route = useRoute()
  const project = projects.find(p => p.detail && route === `/proyecto/${p.repo}`)
  const notFound = route !== '' && !project
  const active = useActiveSection(ids, route)
  const t = texts[lang] ?? texts.es

  useEffect(() => { document.documentElement.dataset.theme = theme }, [theme])
  useEffect(() => { document.documentElement.lang = lang }, [lang])
  // al volver de un proyecto con #projects, bajar a esa sección una vez pintada
  useEffect(() => {
    if (!project && location.hash.length > 1) document.getElementById(location.hash.slice(1))?.scrollIntoView()
  }, [project])
  useEffect(() => {
    if (!toast) return
    const id = setTimeout(() => setToast(null), 2200)
    return () => clearTimeout(id)
  }, [toast])

  const say = text => setToast({ text, n: Date.now() })
  const actions = useMemo(() => ({
    theme: () => setTheme(th => (th === 'dark' ? 'light' : 'dark')),
    lang: () => setLang(l => (l === 'es' ? 'en' : 'es')),
    copyEmail: () => navigator.clipboard?.writeText(contact.email).then(() => say(t.toast.copied), () => {}),
    cv: () => Object.assign(document.createElement('a'), { href: contact.cv, download: '' }).click(),
    terminal: () => setTerminal(true),
  }), [t])

  // atajos: Ctrl/⌘+K paleta, T tema, L idioma, código Konami → terminal, escribir "oss" → saludo
  useEffect(() => {
    const keys = []
    const on = e => {
      if (document.querySelector('dialog[open]') && !(e.key.toLowerCase() === 'k' && (e.ctrlKey || e.metaKey) && !terminal)) return
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setPalette(p => !p); return }
      if (e.ctrlKey || e.metaKey || e.altKey || e.target.closest?.('input, textarea, select, [contenteditable]')) return
      const k = e.key.toLowerCase()
      keys.push(k)
      keys.splice(0, keys.length - 10)
      if (konami.every((x, i) => keys[i] === x)) { keys.length = 0; setTerminal(true); return }
      if (keys.slice(-3).join('') === 'oss') say(t.toast.oss)
      if (k === 't') { actions.theme(); say(t.toast.theme) }
      if (k === 'l') { actions.lang(); say(texts[lang === 'es' ? 'en' : 'es'].toast.lang) }
    }
    addEventListener('keydown', on)
    return () => removeEventListener('keydown', on)
  }, [t, lang, actions, terminal])

  return (
    <>
      <Header t={t} ids={ids} active={project || notFound ? null : active} lang={lang} setLang={setLang} theme={theme} setTheme={setTheme} onPalette={() => setPalette(true)} />
      <main>
        {project ? <ProjectPage p={project} t={t} lang={lang} /> : notFound ? <NotFound t={t} /> : <>
        <Hero t={t} lang={lang} />

        <Section id="about" index={1} title={t.about.title}>
          <div className="about">
            <div>
              <p className="lead">{t.about.text}</p>
              <ul className="chips">{t.about.traits.map(x => <li key={x}>{x}</li>)}</ul>
              <p className="muted">{t.about.hobbies}</p>
            </div>
            <div className="side">
              <div className="stats">
                {t.about.stats.map(s => <div key={s.label} className="card stat"><strong>{s.value}</strong><span>{s.label}</span></div>)}
              </div>
              <div className="card langs">
                {t.about.languages.map(l => <p key={l.name} className="lang-row"><strong>{l.name}</strong><span className="muted mono small">{l.level}</span></p>)}
              </div>
            </div>
          </div>
        </Section>

        <Section id="projects" index={2} title={t.projects.title}>
          <Projects t={t} lang={lang} />
        </Section>

        <Section id="experience" index={3} title={t.experience.title}>
          <div className="two-col">
            <div><h3 className="sub">{t.experience.work}</h3><Timeline items={t.experience.jobs} /></div>
            <div><h3 className="sub">{t.experience.education}</h3><Timeline items={t.experience.studies} /></div>
          </div>
        </Section>

        <Section id="skills" index={4} title={t.skills.title}>
          <div className="skills">
            {Object.entries(skills).map(([k, list]) => (
              <div key={k} className="skill-group">
                <h3 className="sub">{t.skills[k]} <span className="mono small muted">{list.length}</span></h3>
                <ul className="chips">{list.map(s => <li key={s}>{s}</li>)}</ul>
              </div>
            ))}
          </div>
        </Section>

        <Section id="contact" index={5} title={t.contact.title}>
          <Contact t={t} />
        </Section>
        </>}
      </main>
      <footer className="footer mono small">
        <span>© {new Date().getFullYear()} Jorge Lei León</span>
        <span>{t.footer}</span>
        <button className="to-top icon-btn" onClick={() => scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Top">↑</button>
      </footer>

      <CommandPalette open={palette} setOpen={setPalette} t={t} ids={ids} actions={actions} />
      <Terminal open={terminal} setOpen={setTerminal} t={t} actions={actions} />
      {toast && <p key={toast.n} className="toast mono" role="status">{toast.text}</p>}
    </>
  )
}
