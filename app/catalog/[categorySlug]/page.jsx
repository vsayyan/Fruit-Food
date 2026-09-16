import { notFound } from 'next/navigation'
import { displayLang } from '@/lib/lang'
import { getCategory, getProductsByCategory } from './actions'
import ProductCard from '../_components/ProductCard'
import styles from '../page.module.css'

export default async function CategoryPage({ params }) {
  const { categorySlug } = await params
  const lang = await displayLang()

  const category = await getCategory(lang, categorySlug)
  if (!category) notFound()

  const products = await getProductsByCategory(lang, categorySlug)

  return (
    <div className={`container ${styles.page}`}>
      <h1 className={styles.title}>{category.name}</h1>

      <div className={styles.grid}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
