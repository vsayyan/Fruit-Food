'use client'

import styles from './Header.module.css'

// Լեզուն փոխելը = cookie գրել + reload անել, որ Server Component-երը
// (page.jsx, layout.js) նոր lang-ով նորից fetch անեն json-server-ից։
export default function Langs({ data, lang }) {
  const changeLang = (code) => {
    const date = new Date()
    date.setFullYear(date.getFullYear() + 10)
    document.cookie = `lang=${code}; path=/; expires=${date.toUTCString()}`
    window.location.reload()
  }

  return (
    <div className={styles.langDropdown}>
      <span className={styles.currentLang}>{lang}</span>
      <div className={styles.langMenu}>
        {data.map((item) => (
          <button key={item.id} onClick={() => changeLang(item.code)} className={styles.langOption}>
            {item.label}
          </button>
        ))}
      </div>
    </div>
  )
}
