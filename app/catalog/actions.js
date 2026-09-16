import axios from '@/lib/axios'

export async function getCategories(lang) {
  const res = await axios.get(`categories?lang=${lang}`)
  return res.data
}

export async function getProducts(lang, categorySlug) {
  const query = categorySlug
    ? `products?lang=${lang}&category_slug=${categorySlug}`
    : `products?lang=${lang}`
  const res = await axios.get(query)
  return res.data
}
