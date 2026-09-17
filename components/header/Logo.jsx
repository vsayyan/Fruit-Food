import Link from 'next/link'
import styles from './Header.module.css'

export default function Logo({ data }) {
  return (
    <Link href="/" className={styles.logo}>
      {data.title}
    </Link>
  )
}
