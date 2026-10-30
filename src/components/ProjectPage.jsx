import { useEffect, useRef, useState } from 'react'
import { contact } from '../data.js'

// Visor de capturas a pantalla completa; <dialog> ya gestiona Esc y el foco
function Lightbox({ images, index, setIndex, t, lang }) {
  const ref = useRef(null)
  const open = index !== null
  useEffect(() => {
    const d = ref.current
    if (open && !d.open) d.showModal()
    if (!open && d.open) d.close()
  }, [open])
  const go = step => setIndex((index + step + images.length) % images.length)
  const onKey = e => {
    if (e.key === 'ArrowRight') go(1)
    if (e.key === 'ArrowLeft') go(-1)
  }
  const img = open ? images[index] : null
  return (
    <dialog ref={ref} className="lightbox" onClose={() => setIndex(null)} onKeyDown={onKey}
      onClick={e => e.target === ref.current && setIndex(null)}>
      {img && (
        <figure>
          <img src={img.src} alt={img.alt[lang]} className={img.mobile ? 'mobile' : ''} />
          <figcaption>{img.alt[lang]} <span className="muted">· {index + 1}/{images.length}</span></figcaption>
        </figure>
      )}
      <button className="lb-btn lb-close" onClick={() => setIndex(null)} aria-label={t.projects.close}>✕</button>
      <button className="lb-btn lb-prev" onClick={() => go(-1)} aria-label={t.projects.prev}>‹</button>
      <button className="lb-btn lb-next" onClick={() => go(1)} aria-label={t.projects.next}>›</button>
    </dialog>
  )
}

export default function ProjectPage({ p, t, lang }) {
  const [index, setIndex] = useState(null)
  const d = p.detail
  const c = d[lang]
  useEffect(() => { window.scrollTo(0, 0) }, [p])
  return (
    <article className="project-page">
      <a href="#projects" className="back">← {t.projects.back}</a>
      <header className="pp-head">
        <span className="badge">{p.tag}</span>
        <h1>{p.name}</h1>
        <p className="mono small accent">{d.period[lang]}</p>
        {d.role && <p className="role-line">👤 {d.role[lang]}</p>}
        <p className="lead">{c.summary}</p>
        <ul className="chips">{p.stack.map(s => <li key={s}>{s}</li>)}</ul>
        <a href={`${contact.github}/${p.repo}`} target="_blank" rel="noopener" className="btn primary">{t.projects.code} →</a>
      </header>

      <button className="hero-shot" onClick={() => setIndex(0)} aria-label={d.images[0].alt[lang]}>
        <img src={d.images[0].src} alt={d.images[0].alt[lang]} />
      </button>

      <div className="stats facts">
        {d.facts.map(f => <div key={f.value} className="card stat"><strong>{f.value}</strong><span>{f.label[lang]}</span></div>)}
      </div>

      {d.context && (
        <aside className="callout">
          <span className="callout-icon" aria-hidden="true">🏫</span>
          <div>
            <h2>{d.context[lang][0]}</h2>
            <p>{d.context[lang][1]}</p>
          </div>
        </aside>
      )}

      <section className="pp-section">
        <h2 className="sub">{t.projects.problem}</h2>
        <p>{c.problem}</p>
      </section>

      <section className="pp-section">
        <h2 className="sub">{t.projects.features}</h2>
        <ul className="features">{c.features.map(f => <li key={f}>{f}</li>)}</ul>
      </section>

      {d.flow && (
        <section className="pp-section">
          <h2 className="sub">{t.projects.flow}</h2>
          {d.flowIntro && <p className="muted">{d.flowIntro[lang]}</p>}
          <ol className="flow">
            {d.flow.map((st, i) => {
              const img = d.images.findIndex(x => x.src === st.img)
              return (
                <li key={i} className={`flow-step actor-${st.actor}`}>
                  <span className="flow-num mono">{i + 1}</span>
                  <div className="flow-body">
                    <span className="flow-actor mono small">{t.projects.actors[st.actor]}</span>
                    <h3>{st[lang][0]}</h3>
                    <p className="muted">{st[lang][1]}</p>
                  </div>
                  {img >= 0 && (
                    <button className="flow-img" onClick={() => setIndex(img)} aria-label={d.images[img].alt[lang]}>
                      <img src={st.img} alt="" loading="lazy" />
                    </button>
                  )}
                </li>
              )
            })}
          </ol>
        </section>
      )}

      {d.modules && (
        <section className="pp-section">
          <h2 className="sub">{t.projects.allFeatures} <span className="muted small">· {d.modules.reduce((n, m) => n + m[lang].length, 0)}</span></h2>
          <div className="modules">
            {d.modules.map(m => (
              <div key={m.title.es} className="card module">
                <h3>{m.title[lang]}</h3>
                <ul className="features">{m[lang].map(f => <li key={f}>{f}</li>)}</ul>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="pp-section">
        <h2 className="sub">{t.projects.gallery}</h2>
        <div className="gallery">
          {d.images.map((img, i) => (
            <button key={img.src} className={img.mobile ? 'thumb mobile' : 'thumb'} onClick={() => setIndex(i)}>
              <img src={img.src} alt={img.alt[lang]} loading="lazy" />
              <span>{img.alt[lang]}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="pp-section">
        <h2 className="sub">{t.projects.architecture}</h2>
        {d.layers && (
          <ol className="layers" aria-label={t.projects.architecture}>
            {d.layers.map(l => (
              <li key={l.name}>
                <div className="layer card"><strong>{l.name}</strong><span className="mono small muted">{l.note}</span></div>
                {l.side && <div className="layer-side">{l.side.map(x => <span key={x} className="mono small">{x}</span>)}</div>}
              </li>
            ))}
          </ol>
        )}
        <p>{c.architecture}</p>
      </section>

      {d.tables && (
        <section className="pp-section">
          <h2 className="sub">{t.projects.dataModel}</h2>
          <div className="tables">
            {d.tables.map(tb => (
              <div key={tb.name} className="card db-table">
                <h3 className="mono">{tb.name}</h3>
                <ul>{tb.fields.map(f => <li key={f} className={f.includes('→') ? 'fk mono small' : 'mono small'}>{f}</li>)}</ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {c.security && (
        <section className="pp-section">
          <h2 className="sub">{t.projects.security}</h2>
          <ul className="features">{c.security.map(f => <li key={f}>{f}</li>)}</ul>
        </section>
      )}

      {d.code && (
        <section className="pp-section">
          <h2 className="sub">{t.projects.codeTitle}</h2>
          <p>{c.codeText}</p>
          <figure className="code">
            <figcaption className="mono small muted">{d.code.file}</figcaption>
            <pre><code>{d.code.snippet}</code></pre>
          </figure>
        </section>
      )}

      <section className="pp-section">
        <h2 className="sub">{t.projects.challenges}</h2>
        <div className="grid three">
          {c.challenges.map(ch => <div key={ch.title} className="card"><h3>{ch.title}</h3><p className="muted">{ch.text}</p></div>)}
        </div>
      </section>

      {c.next && (
        <section className="pp-section">
          <h2 className="sub">{t.projects.next}</h2>
          <ul className="features">{c.next.map(f => <li key={f}>{f}</li>)}</ul>
        </section>
      )}

      <Lightbox images={d.images} index={index} setIndex={setIndex} t={t} lang={lang} />
    </article>
  )
}
