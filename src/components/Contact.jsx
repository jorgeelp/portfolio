import { useState } from 'react'
import { contact } from '../data.js'

export default function Contact({ t }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(contact.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* sin permiso de portapapeles: no hacemos nada */ }
  }
  return (
    <div className="contact">
      <p>{t.contact.text}</p>
      <a className="email mono" href={`mailto:${contact.email}`}>{contact.email}</a>
      <div className="hero-actions center">
        <a href={`mailto:${contact.email}`} className="btn primary">Email</a>
        <a href={contact.cv} download className="btn">{t.hero.cv} ↓</a>
        <button className="btn" onClick={copy}>{copied ? t.contact.copied : t.contact.copy}</button>
        <a href={contact.linkedin} target="_blank" rel="noopener" className="btn">LinkedIn</a>
      </div>
    </div>
  )
}
