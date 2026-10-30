import { useEffect } from 'react'
import { texts, skills, projects } from './data.js'
import { useStored, useActiveSection, useRoute } from './hooks.js'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import Section from './components/Section.jsx'
import Projects from './components/Projects.jsx'
import Timeline from './components/Timeline.jsx'
import Contact from './components/Contact.jsx'
import ProjectPage from './components/ProjectPage.jsx'

const ids = ['about', 'projects', 'experience', 'skills', 'contact']
const systemTheme = () => (window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark')

export default function App() {
  const [lang, setLang] = useStored('lang', 'es')
  const [theme, setTheme] = useStored('theme', systemTheme())
  const route = useRoute()
  const project = projects.find(p => p.detail && route === `/proyecto/${p.repo}`)
  const active = useActiveSection(ids, project)
  const t = texts[lang] ?? texts.es

  useEffect(() => { document.documentElement.dataset.theme = theme }, [theme])
  useEffect(() => { document.documentElement.lang = lang }, [lang])
  // al volver de un proyecto con #projects, bajar a esa sección una vez pintada
  useEffect(() => {
    if (!project && location.hash.length > 1) document.getElementById(location.hash.slice(1))?.scrollIntoView()
  }, [project])

  return (
    <>
      <Header t={t} ids={ids} active={active} lang={lang} setLang={setLang} theme={theme} setTheme={setTheme} />
      <main>
        {project ? <ProjectPage p={project} t={t} lang={lang} /> : <>
        <Hero t={t} />

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
              <div className="card">
                {t.about.languages.map(l => <p key={l.name} className="lang-row"><strong>{l.name}</strong><span className="muted">{l.level}</span></p>)}
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
          <div className="grid three">
            {Object.entries(skills).map(([k, list]) => (
              <div key={k} className="card">
                <h3 className="sub">{t.skills[k]}</h3>
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
      <footer className="footer mono small">© {new Date().getFullYear()} Jorge Lei León · {t.footer}</footer>
    </>
  )
}
