import { useEffect, useRef, useState } from 'react'

// Estado que se guarda en localStorage (idioma, tema)
export function useStored(key, initial) {
  const [value, setValue] = useState(() => {
    try { return localStorage.getItem(key) ?? initial } catch { return initial }
  })
  useEffect(() => { try { localStorage.setItem(key, value) } catch {} }, [key, value])
  return [value, setValue]
}

// Añade la clase "visible" cuando el elemento entra en pantalla
export function useReveal() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add('visible'); io.disconnect() }
    }, { threshold: 0.15 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return ref
}

// Ruta actual del hash: '#/proyecto/x' → '/proyecto/x'; anclas normales (#about) → ''
export function useRoute() {
  const read = () => (location.hash.startsWith('#/') ? location.hash.slice(1) : '')
  const [route, setRoute] = useState(read)
  useEffect(() => {
    const on = () => setRoute(read())
    addEventListener('hashchange', on)
    return () => removeEventListener('hashchange', on)
  }, [])
  return route
}

// Devuelve el id de la sección visible para resaltar el menú; `dep` vuelve a observar al cambiar de página
export function useActiveSection(ids, dep) {
  const [active, setActive] = useState(ids[0])
  useEffect(() => {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => e.isIntersecting && setActive(e.target.id))
    }, { rootMargin: '-45% 0px -50% 0px' })
    ids.forEach(id => { const el = document.getElementById(id); if (el) io.observe(el) })
    return () => io.disconnect()
  }, [ids, dep])
  return active
}

// Escribe y borra cada frase en bucle
export function useTypewriter(words, speed = 70, pause = 1600) {
  const [text, setText] = useState('')
  const [i, setI] = useState(0)
  const [deleting, setDeleting] = useState(false)
  useEffect(() => { setText(''); setI(0); setDeleting(false) }, [words])
  useEffect(() => {
    const word = words[i % words.length]
    if (!deleting && text === word) { const t = setTimeout(() => setDeleting(true), pause); return () => clearTimeout(t) }
    if (deleting && text === '') { setDeleting(false); setI(i + 1); return }
    const t = setTimeout(() => setText(word.slice(0, text.length + (deleting ? -1 : 1))), deleting ? speed / 2 : speed)
    return () => clearTimeout(t)
  }, [text, deleting, i, words, speed, pause])
  return text
}

// Datos públicos de un repo de GitHub; null si falla (sin conexión, límite de la API...)
export function useRepo(user, repo) {
  const [data, setData] = useState(null)
  useEffect(() => {
    let alive = true
    fetch(`https://api.github.com/repos/${user}/${repo}`)
      .then(r => (r.ok ? r.json() : null))
      .then(d => alive && d && setData(d))
      .catch(() => {})
    return () => { alive = false }
  }, [user, repo])
  return data
}
