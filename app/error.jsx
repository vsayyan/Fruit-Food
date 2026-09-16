'use client'

import styles from './error.module.css'

// Next.js-ը ինքն ա error.jsx-ին տալիս 2 prop. `error` (ինչ եղավ) և
// `reset()` (ֆունկցիա՝ page-ը նորից փորձելու համար, առանց ամբողջ browser-ը reload անելու)
export default function Error({ error, reset }) {
  return (
    <div className={styles.wrapper}>
      <h1>Ինչ-որ բան սխալ գնաց</h1>
      <p>Փորձիր նորից, կամ վերադարձիր հետո։</p>
      <button onClick={reset} className={styles.retryButton}>
        Փորձել կրկին
      </button>
    </div>
  )
}