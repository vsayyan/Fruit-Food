import Link from 'next/link'
import { displayLang } from '@/lib/lang'
import styles from './not-found.module.css'

const TEXT = {
  am: { title: '404', subtitle: 'Էջը չի գտնվել', button: 'Վերադառնալ գլխավոր' },
  ru: { title: '404', subtitle: 'Страница не найдена', button: 'На главную' },
  en: { title: '404', subtitle: 'Page Not Found', button: 'Go Back Home' },
}

export default async function NotFound() {
  const lang = await displayLang()
  const text = TEXT[lang] || TEXT.am

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{text.title}</h1>
      <h2 className={styles.subtitle}>{text.subtitle}</h2>

      <Link href="/" className={styles.homeButton}>
        {text.button}
      </Link>
    </div>
  )
}