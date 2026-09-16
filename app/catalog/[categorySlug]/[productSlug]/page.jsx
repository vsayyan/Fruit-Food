import { notFound } from 'next/navigation'
import { displayLang } from '@/lib/lang'
import { getProduct, getTags } from './actions'
import styles from './page.module.css'

export default async function ProductPage({ params }) {
  const { productSlug } = await params
  const lang = await displayLang()

  const product = await getProduct(lang, productSlug)
  if (!product) notFound()

  const tags = await getTags(lang, product.tags)

  return (
    <div className={`container ${styles.page}`}>
      <div className={styles.gallery}>
        {product.images.map((image, i) => (
          <img key={i} src={image} alt={product.name} className={styles.image} />
        ))}
      </div>

      <div className={styles.info}>
        <p className={styles.sku}>{product.sku} · {product.variants.length}</p>
        <h1 className={styles.title}>{product.name}</h1>
        <p className={styles.weight}>{product.weight_value}{product.weight_unit}</p>

        <div className={styles.variants}>
          {product.variants.map((variant) => (
            <span key={variant.id} className={styles.variant}>{variant.flavor}</span>
          ))}
        </div>

        <p className={styles.description}>{product.description}</p>

        <div className={styles.tags}>
          {tags.map((tag) => (
            <span key={tag.code} className={styles.tag}>{tag.label}</span>
          ))}
        </div>

        <details className={styles.composition}>
          <summary>Բաղադրություն</summary>
          <p>{product.composition}</p>
        </details>
      </div>
    </div>
  )
}
