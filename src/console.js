import { contact } from './data.js'

// Mensaje para quien abra las herramientas de desarrollador
const art = `
     ██╗██╗
     ██║██║
     ██║██║
██   ██║██║
╚█████╔╝███████╗
 ╚════╝ ╚══════╝`

console.log(`%c${art}`, 'color:#ff6a3d; font: 12px/1.1 monospace')
console.log(
  `%c¿Curioseando el código? / Poking around the code?\n→ ${contact.email}\n→ ${contact.github}\n\nPista / hint: ↑ ↑ ↓ ↓ ← → ← → B A`,
  'color:#9b958a; font: 13px/1.6 monospace',
)
