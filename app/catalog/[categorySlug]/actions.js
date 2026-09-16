import axios from '@/lib/axios'

export async function getCategory(lang, slug) {
  const res = await axios.get(`categories?lang=${lang}&slug=${slug}`)
  return res.data[0] || null
}

export async function getProductsByCategory(lang, categorySlug) {
  const res = await axios.get(`products?lang=${lang}&category_slug=${categorySlug}`)
  return res.data
}
