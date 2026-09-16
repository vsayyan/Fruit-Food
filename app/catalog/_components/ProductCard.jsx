import Link from 'next/link'
import styles from './ProductCard.module.css'

export default function ProductCard({ product }) {
  return (
    <Link
      href={`/catalog/${product.category_slug}/${product.slug}`}
      className={styles.card}
    >
      <img src={product.images[0]} alt={product.name} className={styles.image} />
      <h3 className={styles.title}>{product.name}</h3>
      <div className={styles.meta}>
        <span>{product.weight_value}{product.weight_unit}</span>
        <span>{product.variants.length}</span>
      </div>
    </Link>
  )
}
