import styles from './loading.module.css'

export default function LoadingPage() {
  return (
    <div className={styles.loadingView}>
      <div className={styles.ldsSpinner}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} />
        ))}
      </div>
    </div>
  )
}