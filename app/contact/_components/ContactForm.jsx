'use client'

import { useState } from 'react'
import { submitContact } from '../actions'
import styles from './ContactForm.module.css'

export default function ContactForm({ labels }) {
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    try {
      await submitContact(form)
      setStatus('sent')
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <label className={styles.field}>
        {labels.name_label}
        <input name="name" value={form.name} onChange={handleChange} required />
      </label>

      <label className={styles.field}>
        {labels.email_label}
        <input type="email" name="email" value={form.email} onChange={handleChange} required />
      </label>

      <label className={styles.field}>
        {labels.subject_label}
        <input name="subject" value={form.subject} onChange={handleChange} required />
      </label>

      <label className={styles.field}>
        {labels.message_label}
        <textarea name="message" value={form.message} onChange={handleChange} required />
      </label>

      <button type="submit" disabled={status === 'sending'} className={styles.submit}>
        {labels.submit_label}
      </button>

      {status === 'sent' && <p className={styles.success}>✓</p>}
      {status === 'error' && <p className={styles.errorMsg}>✕</p>}
    </form>
  )
}
