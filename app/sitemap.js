import axios from '@/lib/axios'

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  const staticRoutes = ['', '/catalog', '/about', '/geography', '/contact'].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
  }))

  // Կատալոգի categories/products-ը դինամիկ ավելացնում ենք json-server-ից
  // (Django-ից վերջում) — sitemap-ը ինքն իրեն թարմացնում ա, ոչ ոք ձեռքով
  // չի ավելացնում նոր product-ի URL sitemap-ում
  const { data: categories } = await axios.get('categories?lang=am')
  const { data: products } = await axios.get('products?lang=am')

  const categoryRoutes = categories.map((category) => ({
    url: `${baseUrl}/catalog/${category.slug}`,
    lastModified: new Date(),
  }))

  const productRoutes = products.map((product) => ({
    url: `${baseUrl}/catalog/${product.category_slug}/${product.slug}`,
    lastModified: new Date(),
  }))

  return [...staticRoutes, ...categoryRoutes, ...productRoutes]
}