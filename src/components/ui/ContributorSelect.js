'use client'

import { useState } from 'react'
import { searchUsers } from '@/services/userService'
import { X } from 'lucide-react'
import styles from './ContributorSelect.module.css'

export default function ContributorSelect({ value = [], onChange }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  const handleSearch = async (q) => {
    setQuery(q)
    if (q.length < 2) return setResults([])
    setLoading(true)
    try {
      const users = await searchUsers(q)
      setResults(users.filter((u) => !value.includes(u.email)))
    } finally {
      setLoading(false)
    }
  }

  const add = (user) => {
    onChange([...value, user.email])
    setQuery('')
    setResults([])
  }

  const remove = (email) => {
    onChange(value.filter((e) => e !== email))
  }

  return (
    <div>
      {/* Tags sélectionnés */}
      {value.length > 0 && (
        <div className={styles.tagsWrapper}>
          {value.map((email) => (
            <span
              key={email}
              className={styles.tag}
            >
              {email}
              <button onClick={() => remove(email)}>
                <X size={10} />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Input recherche */}
      <div className={styles.searchWrapper}>
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Choisir un ou plusieurs collaborateurs"
          className={styles.searchInput}
        />

        {/* Dropdown résultats */}
        {results.length > 0 && (
          <div className={styles.dropdown}>
            {results.map((user) => (
              <button
                key={user.id}
                onClick={() => add(user)}
                className={styles.dropdownItem}
              >
                <span className={styles.dropdownName}>{user.name}</span>
                <span className={styles.dropdownEmail}>{user.email}</span>
              </button>
            ))}
          </div>
        )}

        {loading && (
          <p className={styles.loadingText}>Recherche...</p>
        )}
      </div>
    </div>
  )
}