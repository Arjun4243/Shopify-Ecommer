# Shared storefront typography

Font: **Inter**, using the existing Shopify body-font setting through `var(--font-body--family)`. Changing the body-font setting updates these areas together. Banner font sizes remain as configured.

Only text presentation was changed. Grids, card widths, images, filter data and behavior were preserved. Wishlist product cards were excluded; the Wishlist banner follows the shared banner font.

## Text standard

| Text | Size at default 16px root | Weight |
|---|---:|---:|
| Product title | 16px | 700 |
| Product details | 13px | 500 |
| Current price | 100% of its card text context | 700; green |
| Compare price | 14px | 400 |
| Filter heading | 20px | 700 |
| Filter group | 16px | 600 |
| Filter option | 14px | 400 |

Price size uses `100%` so it follows the card's text context. Product titles use the available card width, one line and ellipsis. Product and filter text uses normal style and letter spacing. Banners retain their existing hierarchy and sizes. Wishlist product-card prices remain unchanged.

## Pages covered

**21 page groups / 24 template variants**. These are source template types, not a count of every store URL. Styles also cover shared product cards, including predictive search and merchant-added product sections, wherever rendered through the existing card components.

| Page group | Template file(s), under templates/ | Text updated |
|---|---|---|
| Home | index.json | Banners |
| Gemstone / Gemstones | page.gemstone.json, page.gemstones.json | Banners |
| Precious | page.precious.json | Banner, product cards, filters |
| Semi-Precious | page.semi-precious.json | Banner, product cards, filters |
| Jewellery | page.jewellery.json | Banner, product cards, filters |
| Collections / Jewellery collection | collection.json, collection.jewellery.json | Existing banner, product cards, filters |
| Sales | page.sales.json | Banner, product cards, filters |
| Search results | search.json | Banner, product cards, filters |
| Wishlist | page.wishlist.json; search.json?q=wishlist | Banner only; product cards excluded |
| About | page.about.json | Banner |
| FAQ | page.faq.json | Banner |
| Privacy Policy | page.privacy-policy.json | Banner |
| Return / Exchange | page.return.json | Banner |
| Terms / Conditions | page.term-condition.json | Banner |
| Payment Methods / default page composition | page.json | Payment banner |
| Support | page.support.json | Banner and promotional text |
| Blog / Blog page | blog.json, page.blog.json | Banners, topic/search filter text |
| Article | article.json | Promotional banners |
| Product detail | product.json | Recommendation product cards |
| Cart | cart.json | Recommendation product cards |
| 404 | 404.json | Suggested product cards |

## Runtime files

- `snippets/storefront-typography-styles.liquid`: shared stylesheet owner, rendered globally so deferred cards also receive it.
- `layout/theme.liquid`: one render for that owner.

## Verification

- Live preview inspected 19 page routes at desktop width.
- Search, Precious, Semi-Precious, Jewellery, Sales, Collection and Cart checked at 375, 560, 900, 1180 and 1440px: 35 cases, matching title/price typography and no horizontal main-content overflow.
- Deferred product recommendations loaded and verified: 4 cards with Inter, 16px/700 titles and 100%/700 green prices.
- Wishlist: 3 populated cards had identical before/after text styles and dimensions at desktop; wishlist-content source hash unchanged.
- `git diff --check`: passed (only a Windows line-ending notice).
- Installed Shopify CLI `theme check --path . --output json`: new stylesheet has no findings; layout has its existing RemoteAsset warning. Full theme still reports 3889 errors and 94 warnings in existing source.
- Bundled skill validator unavailable: missing `@shopify/theme-check-common`; installed Shopify CLI used instead.
