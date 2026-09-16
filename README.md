# Fruit Food — Frontend (v2 — json-server + axios)

> ⚠️ **ԿԱՐԵՎՈՐ.** Ուղիղ `main`-ի մեջ ՈՉ ՈՔ commit/push չի անում, նույնիսկ փոքր փոփոխության համար։ Ամեն մարդ իր task-ը սկսելուց **առաջինը** ստեղծում ա նոր branch (`git checkout -b feature/<անուն>`), աշխատում ա այնտեղ, ու վերջում բացում PR դեպի `main`։ `main`-ը push անելուց առաջ միշտ pull արա (`git pull origin main`), որ ուրիշի փոփոխությունը չկորչի։ Ով ուղիղ `main`-ի մեջ commit անի, իր փոփոխությունը կարող ա overwrite անի ուրիշի աշխատանքը։ Մանրամասն flow-ը՝ §3-ում։

Multi-language (`am`/`ru`/`en`) site. Next.js 16 App Router + React 19, plain JavaScript, JSX, plain CSS Modules։ Ոչ `src/`, `@/*` alias, `create-next-app` config՝ տես §0։

## Ինչու փոխեցինք architecture-ը

Հին տարբերակում `data/*.json`-ը ուղղակի **import** էր արվում component-ների մեջ (`import products from '@/data/products.json'`)։ Սա աշխատում էր, բայց.
- Չէր նմանվում իրական backend-ի աշխատանքին (իրական API-ն HTTP request ա, ոչ local import)
- Multi-language-ը `{ am, ru, en }` object-ի տեսքով էր, ինչը իրական DB-ում (Django-ում) այդպես չի պահվում. իրական DB-ն ամեն լեզվի համար **առանձին տող** ունի

**Նոր տարբերակում.**
- `db.json`-ը սպասարկվում ա որպես **իրական HTTP API** `json-server`-ով (`localhost:8000`)
- Frontend-ը իրեն **axios**-ով request ա անում, ուղիղ այնպես, ինչպես Django-ի հետ կանի վերջում
- Ամեն տող ունի `lang` field (`"lang": "am"`), ֆիլտրվում ա query param-ով (`?lang=am`) — ուղիղ այնպես, ինչպես Django REST-ում կաշխատեր
- Լեզուն **cookie**-ում ա, ոչ URL-ում (ոչ թե `/am/catalog`, այլ `/catalog` + լեզուն cookie-ից)

```
Component (.jsx)
      ↓
  lib/axios.js  ← axios instance, baseURL = NEXT_PUBLIC_API_URL
      ↓                                          ↓
 (այժմ) json-server (db.json, port 8000)   (վերջում) Django REST API
```

Ինտեգրման ժամանակ **ոչինչ չի փոխվի** frontend-ի կոդում, միայն `.env.local`-ում `NEXT_PUBLIC_API_URL`-ը կփոխվի `localhost:8000`-ից Django-ի հասցեին։

## 0. Setup

```bash
npx create-next-app@latest .
```
Պատասխաններ. TypeScript—No · Linter—ESLint · React Compiler—Yes · Tailwind—No · `src/`—No · App Router—Yes · import alias—No (default `@/*`) · AGENTS.md—No

Հետո.
```bash
npm install axios json-server concurrently
cp .env.example .env.local
npm run dev
```
`npm run dev`-ը **միաժամանակ** կանգնացնում ա 2 սերվեր (concurrently-ի շնորհիվ). `json-server` (`:8000`, սպասարկում ա `db.json`-ը որպես API) և `next dev` (`:3000`)։ Երկուսն էլ պետք ա աշխատեն։ Բացիր `localhost:3000`։

## 1. Folder structure

```
db.json                          Mock "DB" — ամեն collection = ապագա Django model
.env.example                     NEXT_PUBLIC_API_URL=http://localhost:8000 (copy → .env.local)
app/
  layout.js + actions.js         ROOT layout. logo/navbar/langs/footer fetch այստեղ
  page.jsx + page.module.css     Home
  catalog/
    actions.js                   getProducts(), getCategories()
    page.jsx                     Ամբողջ արտադրանքը
    _components/
      ProductCard.jsx + .module.css
    [categorySlug]/
      actions.js                 getCategory(), getProductsByCategory()
      page.jsx                   Կատեգորիայի էջ
      [productSlug]/
        actions.js                getProduct(), getTags()
        page.jsx + page.module.css   Single product page
  contact/
    actions.js                   getContactPageContent(), submitContact()
    page.jsx + page.module.css
    _components/
      ContactForm.jsx + .module.css
components/
  header/   index.jsx, Logo.jsx, Navbar.jsx, Langs.jsx, header.module.css
  footer/   index.jsx, footer.module.css
lib/
  axios.js  axios instance
  lang.js   displayLang() — cookie-ից կարդում ա լեզուն
styles/
  globals.css   գույներ/spacing/radius/font-size scale, .container, .visuallyHidden
```

**Կանոն.** Ամեն route իր **սեփական `actions.js`**-ն ունի (ոչ մեկ ընդհանուր `lib/api.js`, ինչպես հին տարբերակում) — 11 հոգի են աշխատում, ընդհանուր ֆայլը կստեղծեր անընդհատ merge conflict։ Page-ի միայն այդ page-ի component-ները `_components/`-ում են (underscore = Next.js-ը route չի համարում)։ Global component (Header/Footer)՝ վերևի `components/`-ում, առանց underscore-ի։

## 2. Հիմնական կանոններ

1. **Տվյալը՝ axios-ով, սեփական `actions.js`-ից.** Component-ում `.json` import չկա ընդհանրապես (ամեն ինչ HTTP request ա, ինչպես իրական backend-ի հետ կլինի)։
2. **Ամեն component-ն ունի իր `.module.css`-ը**, camelCase class-եր, ոչ Tailwind/inline
3. **Գույն/spacing/չափ ՄԻՇՏ CSS variable-ից** (`globals.css`)
4. **Multi-language.** Ամեն `db.json`-ի collection-ում `"lang": "am"/"ru"/"en"` field, ֆիլտրում ես query param-ով (`?lang=${lang}`)։ Component-ը միշտ arendy filtered տվյալ ա ստանում (արդեն մեկ լեզվով), ոչ թե `{am,ru,en}` object
5. **Ամեն task՝ նոր branch, PR դեպի `main`**, push-ից առաջ՝ `npm run lint:fix && npm run build`

## 3. db.json-ի ձևաչափ

```json
{
  "products": [
    { "id": 1, "lang": "am", "slug": "chrer-200", "category_slug": "dried-fruits", "name": "Չրեր", "...": "..." },
    { "id": 2, "lang": "ru", "slug": "chrer-200", "category_slug": "dried-fruits", "name": "Сухофрукты", "...": "..." },
    { "id": 3, "lang": "en", "slug": "chrer-200", "category_slug": "dried-fruits", "name": "Dried fruits", "...": "..." }
  ]
}
```

Կանոններ.
1. Field անուն՝ **snake_case** (`category_slug`, ոչ `categorySlug`)
2. **Ամեն լեզվի համար առանձին տող**, ոչ `{am,ru,en}` object ներսում (`variants`-ի պես nested array-ի ներսի տեքստը արդեն plain string ա, քանի որ ամբողջ product-ի տողն արդեն մեկ լեզվով ա)
3. id/slug՝ lowercase kebab-case
4. json-server query՝ `GET /products?lang=am&category_slug=dried-fruits` — 2 filter-ը միասին AND ա
5. Նոր collection ավելացնելիս՝ ուղղակի նոր key `db.json`-ում, json-server-ը ինքն ա `/collection-name` endpoint ստեղծում, ոչինչ configure անել պետք չի

## 4. Ով ինչ ա անում

| Բաժին | Ով | Ուր |
|---|---|---|
| Team lead / ինտեգրում | Vahe | ամբողջ repo-ի review |
| Backend (Django, վերջում) | Narek | `/backend`, model-երը՝ `db.json`-ի collection-ներից |
| Header + Footer + Intro | Vahag (40) | `components/header`, `components/footer`, home-ի hero |
| Արտադրանք preview + stats | Ashot | `app/page.jsx`-ի "Արտադրանք" հատված + stats collection |
| Փիլիսոփայություն + FAQ | Saten | `app/about/_components/`, `faq` collection |
| Կատալոգ (3 էջ) | Elina | `app/catalog/*` (արդեն կա full pattern՝ list/category/product) |
| Single product page | Arnak + Vahag | `app/catalog/[categorySlug]/[productSlug]/*` (արդեն կա) |
| Կապ | Vahram | `app/contact/*` (արդեն կա, submitContact() POST-ով) |
| Աշխարհագրություն | Sergey | `app/geography/*`, `export_countries` collection |
| Բնություն/որակ/brand | Milena | `app/about/*`-ի հատված |
| Ararat valley/trust/full range | Hamlet | `app/about/*`-ի հատված |
| Արտահանում | Jor | `app/about` կամ `geography`-ի export հատված |

## 5. Ինտեգրման քայլ (նախագծի վերջում)

1. Narek-ը գրում ա Django models՝ **ուղիղ `db.json`-ի collection-ների անուններով ու field-երով** (collection = model, field = column, `lang` = language column DB-ում)
2. Django-ի REST endpoints-ը կրկնում են json-server-ի query pattern-ը (`?lang=am&category_slug=...`)
3. `.env.local`-ում `NEXT_PUBLIC_API_URL`-ը փոխվում ա Django-ի հասցեին
4. Component/actions.js-երը **ընդհանրապես չեն փոփոխվում**

## 6. Ինչ դեռ չկա

`about`/`geography` page-երը (միայն actions/data structure-ն ա պատրաստ) · language switcher-ը dropdown ա, ոչ ամբողջական design · `next/image` (հիմա `<img>`) · loading/error states page-երում
