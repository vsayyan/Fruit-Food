import Link from 'next/link'
import styles from './header.module.css'

export default function Navbar({ data }) {
  return (
    <nav className={styles.nav}>
      {data.map((item) => (
        <Link key={item.id} href={item.url} className={styles.navLink}>
          {item.title}
        </Link>
      ))}
    </nav>
  )
}
