import axios from '@/lib/axios'

export async function getLogo() {
  const res = await axios.get('logos')
  return res.data
}

export async function getNavbar(lang) {
  const res = await axios.get(`navbars?lang=${lang}`)
  return res.data
}

export async function getLangs() {
  const res = await axios.get('languages')
  return res.data
}

export async function getFooterLabel(lang) {
  const res = await axios.get(`footer_labels?lang=${lang}`)
  return res.data[0]
}
