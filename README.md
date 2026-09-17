# Fruit Food — Frontend

> ⚠️ **ԿԱՐԴԱ ՍԿՍԵԼՈՒՑ ԱՌԱՋ**
> 1. Ուղիղ `main`-ի մեջ **ոչ ոք** commit/push չի անում։ Ամեն մարդ աշխատում ա **իր branch-ում** ու ուղարկում ա **Pull Request (PR)**։ Ինտեգրումը (merge դեպի `main`) անում ա միայն **Vahe**-ն։
> 2. `db_orinak_example`-ը **չես փոխում**։ Դա ընդհանուր օրինակ ա։ Ամեն մարդ իր համակարգչում ունի **իր սեփական `db.json`**-ը (git-ի մեջ չի գնում)։
> 3. Քո նոր տվյալները (collection-ները) ուղարկում ես առանձին ֆայլով՝ `db_parts/<քո-անուն>.json`։ Մանրամասն՝ [§5](#5-քո-dbjson-ը) և [§7](#7-git--ինչպես-աշխատել-ու-ուղարկել)։

Այս պրոեկտը **վերջնական օրինակն** ա. արդեն աշխատող էջերը (header/footer, home, catalog, product, contact) ցույց են տալիս, թե ինչպես պետք ա գրվի ամեն նոր էջ։ Քո task-ը սկսելուց առաջ բաց արա դրանցից մեկը ու նույն pattern-ով գրիր։

**Stack.** Next.js 16 (App Router) + React 19 · plain JavaScript (`.jsx`) · CSS Modules · axios · json-server (mock API)

---

## 1. Ինչպես ա աշխատում

```
page.jsx (Server Component)
      ↓  displayLang()  ← lib/lang.js, լեզուն cookie-ից (am / ru / en)
      ↓
actions.js  (տվյալ բերող ֆունկցիաներ, ամեն route-ի մոտ իրենը)
      ↓
lib/axios.js  ← baseURL = NEXT_PUBLIC_API_URL
      ↓
(հիմա)   json-server  →  db.json            http://localhost:8000
(վերջում) Django REST API                    Narek
```

- `db.json`-ը json-server-ով դառնում ա **իրական HTTP API**. ամեն collection = endpoint (`/products`, `/faq`, ...)
- Ամեն տող ունի `lang` field, ֆիլտրվում ա query-ով՝ `products?lang=am`
- Լեզուն **cookie**-ում ա, ոչ URL-ում (`/catalog`, ոչ թե `/am/catalog`)
- Django-ին անցնելիս frontend-ի կոդը **չի փոխվում**, փոխվում ա միայն `.env.local`-ի `NEXT_PUBLIC_API_URL`-ը

## 2. Setup (առաջին անգամ)

Պետք ա՝ **Node.js 20+** և **git**։

```bash
git clone git@github.com:vsayyan/Fruit-Food.git
cd Fruit-Food
npm install
cp .env.example .env.local
cp db_orinak_example db.json
npm run dev
```

`npm run dev`-ը միաժամանակ միացնում ա 2 սերվեր.
- `json-server` → http://localhost:8000 (կարդում ա **`db.json`**-ը, ոչ թե `db_orinak_example`-ը)
- `next dev` → http://localhost:3000 ← սա բաց արա browser-ում

Ստուգելու համար, որ API-ն աշխատում ա, բաց արա http://localhost:8000/products?lang=am

> Windows-ում `cp`-ի փոխարեն՝ `copy .env.example .env.local` և `copy db_orinak_example db.json`

Եթե էջը error ա տալիս՝ ամենահավանականն այն ա, որ `db.json` չկա, կամ json-server-ը չի միացել (նայիր terminal-ը)։

## 3. Folder structure

```
db_orinak_example              Ընդհանուր օրինակ DB (ՉԵՍ ՓՈԽՈՒՄ, ինտեգրում ա անում Vahe-ն)
db.json                        Քո լոկալ DB-ն (copy օրինակից, git-ում չկա)
db_parts/<անուն>.json          Քո նոր collection-ները՝ ուղարկելու համար (§5)
.env.example                   copy → .env.local

app/
  layout.jsx + actions.js      Root layout. logo / navbar / langs / footer-ի տվյալը այստեղ ա fetch արվում
  globals.css                  Գույներ, spacing, radius, font-size (CSS variables), .container
  page.jsx + page.module.css   Home
  loading.jsx / error.jsx / not-found.jsx   Ընդհանուր loading, error, 404
  sitemap.js / robots.js       SEO
  catalog/
    actions.js                 getCategories(), getProducts()
    page.jsx                   Ամբողջ արտադրանքը
    _components/ProductCard.jsx + .module.css
    [categorySlug]/
      actions.js               getCategory(), getProductsByCategory()
      page.jsx                 Կատեգորիայի էջ
      [productSlug]/
        actions.js             getProduct(), getTags()
        page.jsx + page.module.css   Մեկ ապրանքի էջ
  contact/
    actions.js                 getContactPageContent(), submitContact() (POST)
    page.jsx + page.module.css
    _components/ContactForm.jsx + .module.css   ('use client' օրինակ)

components/                    Global component-ներ (ամեն էջում են)
  header/  index.jsx, Logo.jsx, Navbar.jsx, Langs.jsx, Header.module.css
  footer/  index.jsx, Footer.module.css

lib/
  axios.js                     axios instance (ՉԵՍ ՓՈԽՈՒՄ)
  lang.js                      displayLang() — լեզուն cookie-ից (ՉԵՍ ՓՈԽՈՒՄ)

public/images/<բաժին>/         Նկարներ (db-ում գրվում ա `/images/...`)
```

## 4. Կոդի կանոններ

1. **Ամեն route-ն ունի իր `actions.js`-ը.** Ընդհանուր `api.js` չկա — 11 հոգի ենք, ընդհանուր ֆայլը = անընդհատ conflict։
2. **Տվյալը միայն axios-ով**, `actions.js`-ից։ Component-ում `import data from '...json'` **չկա**։
3. **Page-ի component-ները՝ `_components/`**-ում (underscore-ով, որ Next.js-ը route չհամարի)։ Global-ները՝ `components/`-ում։
4. **Ամեն component-ն ունի իր `.module.css`-ը**, class-երը camelCase։ Tailwind / inline style չկա։
5. **Գույն / spacing / radius / font-size՝ միայն CSS variable-ից** (`var(--color-green)`, `var(--space-md)`), պատահական թվեր չկան։ Նոր variable պետք ա՝ ասա Vahe-ին։
6. **Server Component default ա.** `'use client'` դնում ես միայն եթե պետք ա `useState`, `onClick` և այլն (տես `ContactForm.jsx`, `Langs.jsx`)։
7. **Տեքստ կոդի մեջ hardcode չկա.** Ամեն տեքստ, որ էջում երևում ա, գալիս ա db-ից՝ ճիշտ լեզվով։
8. Code style (ESLint). առանց `;`, single quotes `'...'`, `const`/`let` (ոչ `var`), `===`։
9. **Ուրիշի ֆայլերին չես դիպչում** (տես §6 աղյուսակը)։ Եթե պետք ա ընդհանուր ֆայլ փոխել (`layout.jsx`, `globals.css`, `lib/*`, `package.json`)՝ նախ գրիր Vahe-ին։

### Նոր էջի template

```
app/about/
  actions.js
  page.jsx
  page.module.css
  _components/
    Faq.jsx
    Faq.module.css
```

```js
// app/about/actions.js
import axios from '@/lib/axios'

export async function getFaq(lang) {
  const res = await axios.get(`faq?lang=${lang}`)
  return res.data
}
```

```jsx
// app/about/page.jsx
import { displayLang } from '@/lib/lang'
import { getFaq } from './actions'
import Faq from './_components/Faq'
import styles from './page.module.css'

export default async function AboutPage() {
  const lang = await displayLang()
  const faq = await getFaq(lang)

  return (
    <div className={`container ${styles.page}`}>
      <Faq data={faq} />
    </div>
  )
}
```

## 5. Քո `db.json`-ը

### 5.1 Ինչպես ա կազմակերպված

| Ֆայլ | Ում ա | git-ում կա՞ | Ինչ ես անում |
|---|---|---|---|
| `db_orinak_example` | Ընդհանուր | ✅ | **Չես փոխում.** Միայն copy ես անում |
| `db.json` | Քո լոկալը | ❌ (`.gitignore`) | Ազատ փոխում ես, ավելացնում, փորձարկում |
| `db_parts/<անուն>.json` | Քոնը | ✅ | Միայն **քո նոր** collection-ները, Vahe-ին ուղարկելու համար |

Ինչու այսպես. եթե 11 հոգի նույն `db.json`-ը փոխեն ու push անեն, ամեն PR-ում conflict կլինի։ Այս ձևով ամեն մեկը գրում ա միայն իր ֆայլը, իսկ Vahe-ն ինտեգրման ժամանակ դրանք միացնում ա `db_orinak_example`-ի մեջ։

### 5.2 Քայլերով

1. `cp db_orinak_example db.json` (եթե դեռ չես արել)
2. Նայիր՝ քո բաժնի collection-ը **արդեն կա՞** օրինակում (`faq`, `stats`, `export_countries`, `brands`, `about_intro` արդեն կան)։ Եթե կա՝ օգտագործիր նույն անունն ու field-երը։
3. Նոր collection-ը / նոր տողերը ավելացրու **քո `db.json`**-ում ու աշխատիր դրանով (`npm run dev` ավտոմատ կտեսնի փոփոխությունը)
4. Երբ պատրաստ ես՝ **միայն քո նոր/փոխված collection-ները** copy արա `db_parts/<անուն>.json`-ի մեջ, օրինակ `db_parts/saten.json`.

```json
{
  "faq": [
    { "id": 1, "lang": "am", "question": "...", "answer": "..." },
    { "id": 2, "lang": "ru", "question": "...", "answer": "..." },
    { "id": 3, "lang": "en", "question": "...", "answer": "..." }
  ]
}
```

5. Եթե **արդեն գոյություն ունեցող** collection ես փոխել (օրինակ field ես ավելացրել `products`-ին)՝ PR-ի նկարագրության մեջ **պարտադիր գրիր**, թե ինչ ես փոխել։

### 5.3 db-ի ձևաչափի կանոններ

1. Collection-ի ու field-ի անուն՝ **snake_case** (`category_slug`, `export_countries`), ոչ `categorySlug`
2. **Ամեն լեզու՝ առանձին տող** իր `"lang": "am" | "ru" | "en"`-ով։ `{ "am": "...", "ru": "..." }` object **չկա**։ Բոլոր 3 լեզուները պարտադիր են։
3. `id`-ն ամեն collection-ում **եզակի** ա (json-server-ը id-ով ա աշխատում)
4. `slug` / `code`՝ lowercase kebab-case (`dried-fruits`), նույնը բոլոր 3 լեզուների տողերում
5. Nested array-ի ներսը (`variants`, `social_links`) արդեն plain string ա, որովհետև ամբողջ տողը մեկ լեզվով ա
6. Նկար՝ `public/images/<բաժին>/file.jpg`, db-ում գրվում ա `"/images/<բաժին>/file.jpg"`
7. Ֆիլտր՝ `GET /products?lang=am&category_slug=dried-fruits` (2 ֆիլտրը՝ AND)
8. Նոր collection = պարզապես նոր key JSON-ում, json-server-ը ինքն ա endpoint ստեղծում

Մեկ տող collection-ի օրինակ (`about_intro`, `contact_page_contents`)՝ actions-ում վերադարձնում ես `res.data[0]`։

## 6. Ով ինչ ա անում

| Բաժին | Ով | Folder | db collection | Branch |
|---|---|---|---|---|
| Team lead / review / ինտեգրում | Vahe | ամբողջ repo | `db_orinak_example` | `main` |
| Backend (Django, վերջում) | Narek | `/backend` | model-երը՝ db collection-ներից | `feature/narek-backend` |
| Header + Footer + Intro | Vahag | `components/header`, `components/footer`, home hero | `navbars`, `footer_labels`, `about_intro` | `feature/vahag-header-footer` |
| Արտադրանք preview + stats | Ashot | `app/page.jsx`-ի «Արտադրանք» հատված | `stats` | `feature/ashot-home-products` |
| Փիլիսոփայություն + FAQ | Saten | `app/about/_components/` | `faq` | `feature/saten-faq` |
| Կատալոգ (3 էջ) | Elina | `app/catalog/*` | `categories`, `products` | `feature/elina-catalog` |
| Single product page | Arnak + Vahag | `app/catalog/[categorySlug]/[productSlug]/*` | `products`, `tags` | `feature/arnak-product` |
| Կապ | Vahram | `app/contact/*` | `contact_page_contents`, `contact_messages` | `feature/vahram-contact` |
| Աշխարհագրություն | Sergey | `app/geography/*` | `export_countries` | `feature/sergey-geography` |
| Բնություն / որակ / brand | Milena | `app/about/_components/`-ի հատված | `brands` | `feature/milena-brands` |
| Ararat valley / trust / full range | Hamlet | `app/about/_components/`-ի հատված | նոր collection | `feature/hamlet-about` |
| Արտահանում | Jor | `app/geography/_components/`-ի export հատված | նոր collection | `feature/jor-export` |

Եթե 2 հոգի նույն folder-ում են (օրինակ `app/about`)՝ ամեն մեկը գրում ա **իր առանձին component-ը** `_components/`-ում, իսկ `page.jsx`-ում ընդհամենը import ա անում։ `page.jsx`-ում conflict-ը Vahe-ն ա լուծում ինտեգրման ժամանակ։

## 7. Git — ինչպես աշխատել ու ուղարկել

### 7.1 Սկիզբ (մեկ անգամ)

```bash
git clone git@github.com:vsayyan/Fruit-Food.git
cd Fruit-Food
git checkout main
git pull origin main
git checkout -b feature/<անուն>-<task>     # օրինակ՝ feature/saten-faq
```

Հիմա դու քո branch-ում ես։ Ստուգել՝ `git branch` (աստղանիշով նշվածը քոնն ա)։

### 7.2 Ամեն օր աշխատելիս

```bash
git status                          # ինչ ես փոխել
git add app/about db_parts/saten.json public/images/about
git commit -m "faq: add accordion component"
git push -u origin feature/saten-faq   # առաջին push-ը, հետո ուղղակի `git push`
```

- `git add .`-ից **խուսափիր**, add արա միայն քո ֆայլերը
- Commit-ը՝ փոքր ու հաճախ, հասկանալի message-ով
- **Ամեն օր գոնե մեկ push**, որ աշխատանքը չկորչի

### 7.3 `main`-ի նորությունները քեզ բերել

Երբ Vahe-ն ինչ-որ բան merge ա անում `main`-ում (օրինակ թարմացնում ա `db_orinak_example`-ը), քեզ պետք ա բերել.

```bash
git checkout main
git pull origin main
git checkout feature/saten-faq
git merge main
```

Եթե `db_orinak_example`-ը փոխվել ա՝ նորից `cp db_orinak_example db.json` ու քո `db_parts/<անուն>.json`-ի collection-ները նորից ավելացրու `db.json`-ում։

Conflict եղավ ու չգիտես ինչ անել՝ **մի ջնջիր ուրիշի կոդը**, գրիր Vahe-ին։

### 7.4 Ուղարկել Vahe-ին (Pull Request)

Push-ից առաջ պարտադիր.

```bash
npm run lint:fix
npm run build
```

Երկուսն էլ **առանց error** պետք ա անցնեն (build-ի ժամանակ `npm run dev`-ը/json-server-ը պետք ա միացած լինի)։

Հետո.
1. `git push`
2. GitHub-ում բաց արա repo-ն → **Compare & pull request**
3. **base:** `main` ← **compare:** `feature/<անուն>-<task>`
4. Վերնագիր՝ `[Saten] FAQ section`
5. Նկարագրություն (copy արա ու լրացրու).

```markdown
## Ինչ եմ արել
- ...

## Ֆայլեր
- app/about/_components/Faq.jsx
- db_parts/saten.json

## db
- Նոր collection-ներ: faq
- Փոխված գոյություն ունեցող collection-ներ: չկա / (ինչ ու ինչու)

## Ստուգում
- [ ] npm run lint:fix — OK
- [ ] npm run build — OK
- [ ] ստուգել եմ am / ru / en
- [ ] screenshot-ը կցված ա
```

6. **Reviewer**՝ Vahe
7. **Ինքդ merge մի արա.** Vahe-ն review ա անում.
   - եթե comment ա գրել՝ ուղղում ես **նույն branch-ում**, `commit` + `push`, PR-ը ինքն ա թարմանում (նոր PR մի բաց)
   - եթե ամեն ինչ OK ա՝ Vahe-ն merge ա անում `main`-ի մեջ ու `db_parts/<անուն>.json`-ը միացնում `db_orinak_example`-ին

Merge-ից հետո նոր task-ի համար՝ նորից §7.1 (`main`-ից **նոր** branch)։

### 7.5 Ինչ ՉԻ կարելի

- ❌ `git push origin main`
- ❌ `git push --force`
- ❌ commit անել `db.json`, `.env.local`, `node_modules`
- ❌ փոխել `db_orinak_example`, `lib/*`, `package.json`, `layout.jsx`, `globals.css`՝ առանց Vahe-ին հարցնելու
- ❌ `npm install <package>` առանց հարցնելու (`package-lock.json`-ի conflict)

## 8. Ինտեգրում Django-ի հետ (նախագծի վերջում)

1. Narek-ը Django model-երը գրում ա **ուղիղ `db_orinak_example`-ի collection-ների ու field-երի անուններով** (collection = model, field = column, `lang` = language column)
2. REST endpoint-ները կրկնում են նույն query pattern-ը (`?lang=am&category_slug=...`)
3. `.env.local`-ում `NEXT_PUBLIC_API_URL`-ը փոխվում ա Django-ի հասցեին
4. Component-ները և `actions.js`-երը **չեն փոխվում**

## 9. Ինչ դեռ չկա

- `about` / `geography` էջերը (db collection-ները արդեն կան օրինակում)
- `public/images/`-ում նկարները (db-ում path-երը գրված են, ֆայլերը՝ դեռ ոչ)
- Language switcher-ը պարզ dropdown ա, design-ը դեռ չկա
- `next/image` (հիմա `<img>`)
- `not-found.jsx`, `error.jsx`-ի տեքստերը՝ hardcode, ոչ multi-language
