export default function Timeline({ items }) {
  return (
    <ol className="timeline">
      {items.map(it => (
        <li key={it.role + it.date}>
          <p className="tl-date mono small">{it.date}</p>
          <div className="tl-body">
            <h4>{it.role}</h4>
            <p className="muted">{it.org}</p>
            {it.points.length > 0 && <ul>{it.points.map(pt => <li key={pt}>{pt}</li>)}</ul>}
          </div>
        </li>
      ))}
    </ol>
  )
}
