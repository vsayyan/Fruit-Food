import { cookies } from 'next/headers'

// Լեզուն պահվում ա cookie-ում, ոչ URL-ում (ոչ թե /am/catalog, այլ /catalog +
// cookie: lang=am): ամեն page-ի Server Component-ը սա կանչում ա, որ իմանա
// որ լեզվով request անել axios-ից։
export const displayLang = async () => {
  const cookieStore = await cookies()
  return cookieStore.get('lang')?.value ?? 'am'
}
