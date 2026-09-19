'use client'

import styles from './error.module.css'

const TEXT = {
  am: { title: 'Ինչ-որ բան սխալ գնաց', body: 'Փորձիր նորից, կամ վերադարձիր հետո։', button: 'Փորձել կրկին' },
  ru: { title: 'Что-то пошло не так', body: 'Попробуйте снова или вернитесь позже.', button: 'Попробовать снова' },
  en: { title: 'Something went wrong', body: 'Try again, or come back later.', button: 'Try again' },
}

// Client Component-ը `next/headers`-ի cookies() չի կարող կանչել (server-only),
// ուստի lang-ը կարդում ենք ուղիղ browser-ի document.cookie-ից
function getClientLang() {
  if (typeof document === 'undefined') return 'am'
  const match = document.cookie.match(/(?:^|; )lang=([^;]*)/)
  return match ? decodeURIComponent(match[1]) : 'am'
}

// Next.js-ը ինքն ա error.jsx-ին տալիս 2 prop. `error` (ինչ եղավ) և
// `reset()` (ֆունկցիա՝ page-ը նորից փորձելու համար, առանց ամբողջ browser-ը reload անելու)
export default function Error({ error, reset }) {
  const text = TEXT[getClientLang()] || TEXT.am

  return (
    <div className={styles.wrapper}>
      <h1>{text.title}</h1>
      <p>{text.body}</p>
      <button onClick={reset} className={styles.retryButton}>
        {text.button}
      </button>
    </div>
  )
}