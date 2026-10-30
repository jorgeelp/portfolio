import { contact, projects } from '../data.js'
import { useRepo } from '../hooks.js'
import Icon from './Icon.jsx'

function Project({ p, t, lang, n }) {
  const repo = useRepo(contact.githubUser, p.repo)
  const href = p.detail ? `#/proyecto/${p.repo}` : `${contact.github}/${p.repo}`
  return (
    <article className={p.detail ? 'project featured' : 'project'}>
      <a href={href} className="project-cover" tabIndex={-1} aria-hidden="true"
        {...(!p.detail && { target: '_blank', rel: 'noopener' })}>
        {p.detail?.images.length
          ? <img src={p.detail.images[0].src} alt="" loading="lazy" />
          : p.detail?.logo
            ? <span className="cover-logo"><img src={p.detail.logo} alt="" loading="lazy" /></span>
            : <span className="cover-placeholder mono">{'{ }'}</span>}
      </a>
      <div className="project-body">
        <div className="project-top">
          <span className="mono small muted">{String(n).padStart(2, '0')}</span>
          <span className="badge mono">{p.tag}</span>
        </div>
        <h3>{p.name}</h3>
        <p>{p.desc[lang]}</p>
        <ul className="chips">{p.stack.map(s => <li key={s}>{s}</li>)}</ul>
        <div className="project-foot">
          <span className="project-links">
            {p.detail && <a href={`#/proyecto/${p.repo}`} className="link-arrow">{t.projects.more} <Icon name="arrow" size={16} /></a>}
            <a href={`${contact.github}/${p.repo}`} target="_blank" rel="noopener" className="link-arrow">{t.projects.code} <Icon name="external" size={16} /></a>
          </span>
          {repo && (
            <span className="muted mono small">
              {repo.language && `${repo.language} · `}{t.projects.updated} {new Date(repo.pushed_at).toLocaleDateString(lang, { month: 'short', year: 'numeric' })}
            </span>
          )}
        </div>
      </div>
    </article>
  )
}

export default function Projects({ t, lang }) {
  // primero los que tienen página de detalle con capturas, luego los que no tienen
  const rank = p => (p.detail ? (p.detail.images.length ? 2 : 1) : 0)
  const list = [...projects].sort((a, b) => rank(b) - rank(a))
  return <div className="projects">{list.map((p, i) => <Project key={p.repo} p={p} t={t} lang={lang} n={i + 1} />)}</div>
}
