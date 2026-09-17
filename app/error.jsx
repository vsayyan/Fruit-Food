'use client'

import styles from './error.module.css'

// Next.js-ը ինքն ա error.jsx-ին տալիս 2 prop. `error` (ինչ եղավ) և
// `reset()` (ֆունկցիա՝ page-ը նորից փորձելու համար, առանց ամբողջ browser-ը reload անելու)
export default function Error({ error, reset }) {
  return (
    <div className={styles.wrapper}>
      <h1>Something went wrong.</h1>
      <p>Try again, or come back later.</p>
      <button onClick={reset} className={styles.retryButton}>
        Try again
      </button>
    </div>
  )
}