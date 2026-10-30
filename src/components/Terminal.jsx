import { useEffect, useRef, useState } from 'react'
import { contact, projects, skills } from '../data.js'

// alias en español e inglés → comando
const aliases = {
  help: 'help', ayuda: 'help', '?': 'help',
  whoami: 'whoami',
  about: 'about', sobre: 'about',
  projects: 'projects', proyectos: 'projects',
  open: 'open', abrir: 'open', cd: 'open',
  skills: 'skills', habilidades: 'skills',
  experience: 'experience', experiencia: 'experience', trayectoria: 'experience',
  contact: 'contact', contacto: 'contact',
  cv: 'cv',
  theme: 'theme', tema: 'theme',
  lang: 'lang', idioma: 'lang',
  clear: 'clear', limpiar: 'clear', cls: 'clear',
  exit: 'exit', salir: 'exit', quit: 'exit',
  ls: 'ls', dir: 'ls',
  sudo: 'sudo',
  oss: 'oss', hola: 'hi', hello: 'hi', hi: 'hi',
}

// Terminal secreta (código Konami o "terminal" en la paleta)
export default function Terminal({ open, setOpen, t, actions }) {
  const ref = useRef(null)
  const input = useRef(null)
  const out = useRef(null)
  const [lines, setLines] = useState([])
  const [value, setValue] = useState('')
  const [history, setHistory] = useState([])
  const [h, setH] = useState(-1)
  const tt = t.terminal

  useEffect(() => {
    const d = ref.current
    if (open && !d.open) {
      d.showModal()
      setLines(l => (l.length ? l : [{ text: tt.welcome }]))
      setTimeout(() => input.current?.focus(), 0)
    }
    if (!open && d.open) d.close()
  }, [open])
  useEffect(() => { out.current?.scrollTo(0, out.current.scrollHeight) }, [lines])

  const exec = raw => {
    const [word = '', ...args] = raw.trim().split(/\s+/)
    const cmd = aliases[word.toLowerCase()]
    const say = (...text) => text.flat()
    switch (cmd) {
      case 'help': return say(tt.help.map(([c, d]) => `  ${c.padEnd(15)}${d}`))
      case 'whoami': return say(`Jorge Lei León — ${t.hero.roles[0]} · ${t.hero.location}`)
      case 'about': return say(t.about.text)
      case 'projects': return say(projects.map((p, i) => `  ${i + 1}. ${p.name.padEnd(28)}${p.tag} · ${p.stack.slice(0, 3).join(', ')}`), '', tt.openHint)
      case 'open': {
        const a = args.join(' ').toLowerCase()
        const p = projects[Number(a) - 1] ?? projects.find(x => a && (x.repo.includes(a) || x.name.toLowerCase().includes(a)))
        if (!p) return say(tt.openHint)
        setTimeout(() => {
          if (p.detail) { setOpen(false); location.hash = `/proyecto/${p.repo}` } else window.open(`${contact.github}/${p.repo}`, '_blank', 'noopener')
        }, 400)
        return say(`${tt.opening} ${p.name}…`)
      }
      case 'skills': return say(Object.entries(skills).map(([k, list]) => `  ${t.skills[k]}: ${list.join(', ')}`))
      case 'experience': return say(t.experience.jobs.map(j => `  ${j.date.padEnd(22)}${j.role} · ${j.org}`))
      case 'contact': return say(`  email     ${contact.email}`, `  linkedin  ${contact.linkedin}`, `  github    ${contact.github}`)
      case 'cv': actions.cv(); return say(tt.downloading)
      case 'theme': actions.theme(); return say('✓')
      case 'lang': actions.lang(); return say('✓')
      case 'clear': setLines([]); return null
      case 'exit': setOpen(false); return null
      case 'ls': return say(tt.ls)
      case 'sudo': return say(tt.sudo, `  → ${contact.email}`)
      case 'oss': return say('Oss!')
      case 'hi': return say('Hola / Hi')
      default: return word ? say(`${tt.notFound} ${word}`, tt.tryHelp) : []
    }
  }

  const submit = e => {
    e.preventDefault()
    const res = exec(value)
    if (res) setLines(l => [...l, { cmd: value }, ...res.map(text => ({ text }))])
    if (value.trim()) setHistory(hs => [value, ...hs])
    setValue('')
    setH(-1)
  }
  const onKey = e => {
    if (e.key === 'ArrowUp' && history.length) { e.preventDefault(); const n = Math.min(h + 1, history.length - 1); setH(n); setValue(history[n]) }
    if (e.key === 'ArrowDown' && h >= 0) { e.preventDefault(); const n = h - 1; setH(n); setValue(n >= 0 ? history[n] : '') }
  }

  return (
    <dialog ref={ref} className="terminal" onClose={() => setOpen(false)} onClick={e => e.target === ref.current && setOpen(false)}>
      <div className="term-window" onClick={() => input.current?.focus()}>
        <p className="term-bar mono">
          <button className="term-close" onClick={() => setOpen(false)} aria-label={t.projects.close} />
          <span>{tt.title}</span>
        </p>
        <div className="term-out mono" ref={out}>
          {lines.map((l, i) => l.cmd !== undefined
            ? <p key={i}><span className="term-prompt">jorge@portfolio:~$</span> {l.cmd}</p>
            : <p key={i}>{l.text || ' '}</p>)}
          <form onSubmit={submit} className="term-line">
            <label className="term-prompt" htmlFor="term-input">jorge@portfolio:~$</label>
            <input id="term-input" ref={input} value={value} onChange={e => setValue(e.target.value)} onKeyDown={onKey}
              autoComplete="off" spellCheck="false" autoCapitalize="off" />
          </form>
        </div>
      </div>
    </dialog>
  )
}
