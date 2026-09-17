import styles from './Footer.module.css'

export default function Footer({ data }) {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.row}>
          <div>
            <p className={styles.title}>{data.title}</p>
            <p className={styles.description}>{data.description}</p>
          </div>

          <div>
            <p>{data.address}</p>
            <p>{data.email}</p>
          </div>

          <div className={styles.social}>
            {data.social_links.map((link) => (
              <a key={link.id} href={link.url} target="_blank" rel="noreferrer">
                <img src={link.image} alt="" width={20} height={20} />
              </a>
            ))}
          </div>
        </div>

        <p className={styles.copyright}>{data.copyright}</p>
      </div>
    </footer>
  )
}
