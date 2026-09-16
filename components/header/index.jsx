import Logo from './Logo'
import Navbar from './Navbar'
import Langs from './Langs'
import styles from './header.module.css'

export default function Header({ data }) {
  return (
    <header className={styles.header}>
      <div className="container">
        <div className={styles.row}>
          <Logo data={data.logo} />
          <Navbar data={data.navbar} />
          <Langs data={data.langs} lang={data.lang} />
        </div>
      </div>
    </header>
  )
}
