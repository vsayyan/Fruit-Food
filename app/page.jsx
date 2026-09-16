import { displayLang } from '@/lib/lang'
import { getProducts } from './catalog/actions'
import ProductCard from './catalog/_components/ProductCard'
import styles from './page.module.css'

export default async function HomePage() {
  const lang = await displayLang()
  const products = await getProducts(lang)

  return (
    <div className={`container ${styles.page}`}>
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>Բնական որակ, ստեղծված Հայաստանում</h1>
      </section>

      <section>
        <h2 className={styles.sectionTitle}>Արտադրանք</h2>
        <div className={styles.grid}>
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  )
}
