import { displayLang } from '@/lib/lang'
import { getContactPageContent } from './actions'
import ContactForm from './_components/ContactForm'
import styles from './page.module.css'

export default async function ContactPage() {
  const lang = await displayLang()
  const content = await getContactPageContent(lang)

  return (
    <div className={`container ${styles.page}`}>
      <h1 className={styles.title}>{content.title}</h1>
      <p className={styles.description}>{content.description}</p>
      <ContactForm labels={content} />
    </div>
  )
}
