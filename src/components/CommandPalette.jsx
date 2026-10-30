import { useEffect, useMemo, useRef, useState } from 'react'
import { contact, projects } from '../data.js'
import Icon from './Icon.jsx'

// sin tildes y en minúsculas, para que "sobre mi" encuentre "Sobre mí"
const norm = s => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()
const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform)
export const modKey = isMac ? '⌘' : 'Ctrl'

// Paleta de comandos (Ctrl/⌘ + K): saltar a secciones y proyectos, y acciones rápidas
export default function CommandPalette({ open, setOpen, t, ids, actions }) {
  const ref = useRef(null)
  const input = useRef(null)
  const [q, setQ] = useState('')
  const [sel, setSel] = useState(0)

  useEffect(() => {
    const d = ref.current
    if (open && !d.open) { setQ(''); setSel(0); d.showModal(); input.current?.focus() }
    if (!open && d.open) d.close()
  }, [open])

  const items = useMemo(() => [
    ...ids.map(id => ({ group: 'nav', label: t.nav[id], icon: 'arrow', run: () => { location.hash = id } })),
    ...projects.filter(p => p.detail).map(p => ({ group: 'projects', label: p.name, icon: 'arrow', run: () => { location.hash = `/proyecto/${p.repo}` } })),
    { group: 'actions', label: t.palette.theme, icon: 'sun', key: 'T', run: actions.theme },
    { group: 'actions', label: t.palette.lang, icon: 'globe', key: 'L', run: actions.lang },
    { group: 'actions', label: t.palette.copyEmail, icon: 'copy', run: actions.copyEmail },
    { group: 'actions', label: t.palette.cv, icon: 'download', run: actions.cv },
    // oculto: solo aparece si alguien busca "terminal"
    { group: 'actions', label: t.palette.terminal, icon: 'terminal', hidden: true, run: actions.terminal },
    { group: 'links', label: 'GitHub', icon: 'github', run: () => window.open(contact.github, '_blank', 'noopener') },
    { group: 'links', label: 'LinkedIn', icon: 'linkedin', run: () => window.open(contact.linkedin, '_blank', 'noopener') },
  ], [t, ids, actions])

  const list = items.filter(it => (q ? norm(it.label).includes(norm(q)) : !it.hidden))
  const run = it => { setOpen(false); setTimeout(it.run, 0) }
  const onKey = e => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSel(s => (s + 1) % Math.max(list.length, 1)) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSel(s => (s - 1 + list.length) % Math.max(list.length, 1)) }
    if (e.key === 'Enter' && list[sel]) run(list[sel])
  }

  return (
    <dialog ref={ref} className="palette" onClose={() => setOpen(false)} onClick={e => e.target === ref.current && setOpen(false)}>
      <div className="palette-box">
        <label className="palette-search">
          <Icon name="search" />
          <input ref={input} value={q} onChange={e => { setQ(e.target.value); setSel(0) }} onKeyDown={onKey}
            placeholder={t.palette.placeholder} aria-label={t.palette.placeholder} autoComplete="off" spellCheck="false" />
          <kbd className="mono">Esc</kbd>
        </label>
        <div className="palette-list" role="listbox">
          {list.length === 0 && <p className="palette-empty muted">{t.palette.empty}</p>}
          {list.map((it, i) => (
            <div key={it.group + it.label}>
              {(i === 0 || list[i - 1].group !== it.group) && <p className="palette-group mono">{t.palette.groups[it.group]}</p>}
              <button role="option" aria-selected={i === sel} className={i === sel ? 'palette-item on' : 'palette-item'}
                onMouseMove={() => setSel(i)} onClick={() => run(it)}>
                <Icon name={it.icon} size={16} />
                <span>{it.label}</span>
                {it.key && <kbd className="mono">{it.key}</kbd>}
              </button>
            </div>
          ))}
        </div>
        <p className="palette-foot mono">{t.palette.hint}</p>
      </div>
    </dialog>
  )
}
