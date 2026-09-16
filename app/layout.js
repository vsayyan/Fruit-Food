import { Noto_Sans_Armenian } from 'next/font/google'
import { displayLang } from '@/lib/lang'
import { getLogo, getNavbar, getLangs, getFooterLabel } from './actions'
import Header from '@/components/header'
import Footer from '@/components/footer'
import '@/styles/globals.css'

const notoSansArmenian = Noto_Sans_Armenian({
  subsets: ['armenian', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-main',
})

export const metadata = {
  title: { default: 'Fruit Food', template: '%s | Fruit Food' },
  description: 'Հայաստանյան բնական չրագործեր և միրգային քաղցրավենիք 1995 թվականից',
}

export default async function RootLayout({ children }) {
  const lang = await displayLang()

  const logo = await getLogo()
  const navbar = await getNavbar(lang)
  const langs = await getLangs()
  const footerLabel = await getFooterLabel(lang)

  return (
  <html lang={lang} className={notoSansArmenian.variable}>
    <body className="layout">
      <Header data={{ logo, navbar, langs, lang }} />
      <main className="main-content">{children}</main>
      <Footer data={footerLabel} />
    </body>
  </html>
  )
}
