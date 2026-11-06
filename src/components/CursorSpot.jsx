import { useEffect, useRef } from 'react'

// Foco de puntos de color que sigue al ratón por toda la web (solo con ratón, no en táctil)
export default function CursorSpot() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    let frame = 0
    const move = e => {
      if (e.pointerType !== 'mouse') return
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        el.style.setProperty('--mx', `${e.clientX}px`)
        el.style.setProperty('--my', `${e.clientY}px`)
        el.classList.add('on')
      })
    }
    // al salir de la ventana el foco se apaga
    const leave = () => el.classList.remove('on')
    addEventListener('pointermove', move, { passive: true })
    document.documentElement.addEventListener('pointerleave', leave)
    return () => {
      cancelAnimationFrame(frame)
      removeEventListener('pointermove', move)
      document.documentElement.removeEventListener('pointerleave', leave)
    }
  }, [])
  return <div ref={ref} className="cursor-spot" aria-hidden="true" />
}
