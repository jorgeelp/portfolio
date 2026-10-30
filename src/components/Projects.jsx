import { contact, projects } from '../data.js'
import { useRepo } from '../hooks.js'

function Project({ p, t, lang }) {
  const repo = useRepo(contact.githubUser, p.repo)
  return (
    <article className="card project">
      {p.detail && (
        <a href={`#/proyecto/${p.repo}`} className="project-cover" tabIndex={-1} aria-hidden="true">
          <img src={p.detail.images[0].src} alt="" loading="lazy" />
        </a>
      )}
      <div className="project-top">
        <span className="folder" aria-hidden="true">{'{ }'}</span>
        <span className="badge">{p.tag}</span>
      </div>
      <h3>{p.name}</h3>
      <p>{p.desc[lang]}</p>
      <ul className="chips">{p.stack.map(s => <li key={s}>{s}</li>)}</ul>
      <div className="project-foot">
        <span className="project-links">
          {p.detail && <a href={`#/proyecto/${p.repo}`}>{t.projects.more} →</a>}
          <a href={`${contact.github}/${p.repo}`} target="_blank" rel="noopener">{t.projects.code} ↗</a>
        </span>
        {repo && (
          <span className="muted mono small">
            {repo.language && `${repo.language} · `}{t.projects.updated} {new Date(repo.pushed_at).toLocaleDateString(lang, { month: 'short', year: 'numeric' })}
          </span>
        )}
      </div>
    </article>
  )
}

export default function Projects({ t, lang }) {
  return <div className="grid">{projects.map(p => <Project key={p.repo} p={p} t={t} lang={lang} />)}</div>
}
