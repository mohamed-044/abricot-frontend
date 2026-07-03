'use client'

import { X } from 'lucide-react'
import { useEffect } from 'react'
import styles from './Modal.module.css'

export default function Modal({ isOpen, onClose, title, children }) {
  useEffect(() => {
    const handleKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  if (!isOpen) return null

  return (
    <div className={styles.overlay}>
      {/* Overlay */}
      <div
        className={styles.backdrop}
        onClick={onClose}
      />
      {/* Contenu */}
      <div className={styles.content}>
        <button
          onClick={onClose}
          className={styles.closeBtn}
        >
          <X size={18} />
        </button>
        <h2 className={styles.title}>{title}</h2>
        {children}
      </div>
    </div>
  )
}