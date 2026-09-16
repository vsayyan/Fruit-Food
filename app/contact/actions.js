import axios from '@/lib/axios'

export async function getContactPageContent(lang) {
  const res = await axios.get(`contact_page_contents?lang=${lang}`)
  return res.data[0]
}

// json-server-ը ինքն ա ընդունում POST-ը ու contact_messages collection-ում
// նոր տող ստեղծում — ուղիղ այն ինչ Django-ի POST /api/v1/contact/ ա անելու
export async function submitContact(data) {
  const res = await axios.post('contact_messages', data)
  return res.data
}
