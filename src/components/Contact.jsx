import { useState } from 'react'
import { contact } from '../data.js'
import Icon from './Icon.jsx'

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
      <p className="contact-text">{t.contact.text}</p>
      <div className="email-row">
        <a className="email" href={`mailto:${contact.email}`}>{contact.email}</a>
        <button className={copied ? 'icon-btn copied' : 'icon-btn'} onClick={copy} aria-label={t.contact.copy} title={t.contact.copy}>
          <Icon name={copied ? 'check' : 'copy'} />
        </button>
        <span className="copy-status mono small" role="status">{copied ? t.contact.copied : ''}</span>
      </div>
      <div className="hero-actions">
        <a href={`mailto:${contact.email}`} className="btn primary"><Icon name="mail" size={16} /> Email</a>
        <a href={contact.cv} download className="btn">{t.hero.cv} <Icon name="download" size={16} /></a>
        <a href={contact.linkedin} target="_blank" rel="noopener" className="btn"><Icon name="linkedin" size={16} /> LinkedIn</a>
      </div>
    </div>
  )
}
