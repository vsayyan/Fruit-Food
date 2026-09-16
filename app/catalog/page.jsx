import { displayLang } from '@/lib/lang'
import { getProducts } from './actions'
import ProductCard from './_components/ProductCard'
import styles from './page.module.css'

export const metadata = {
  title: 'Ամբողջ արտադրանքը',
}

export default async function CatalogPage() {
  const lang = await displayLang()
  const products = await getProducts(lang)

  return (
    <div className={`container ${styles.page}`}>
      <h1 className={styles.title}>Ամբողջ արտադրանքը</h1>

      <div className={styles.grid}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
