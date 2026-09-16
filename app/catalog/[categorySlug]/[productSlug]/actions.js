import axios from '@/lib/axios'

export async function getProduct(lang, slug) {
  const res = await axios.get(`products?lang=${lang}&slug=${slug}`)
  return res.data[0] || null
}

export async function getTags(lang, codes) {
  const res = await axios.get(`tags?lang=${lang}`)
  return res.data.filter((tag) => codes.includes(tag.code))
}
