# Website typography audit

Audit date: 25 October 2026. Scope: local runnable theme source.

510 source files scanned; 29 template variants found; 237 files contain text markup, text-related CSS or typography tokens. Template variants are not unique live URLs. One template can serve many products, collections and pages.

Layout, templates, sections, blocks, snippets, assets, config and locales were read. Images, Git internals, sample-data and design metadata are outside the runnable-source count. App/iframe/shadow-DOM content and shop-admin rich text cannot be fully enumerated from local source.

## Important font findings

1. [config/settings_data.json](<D:/All project/Shopify-theme/config/settings_data.json>) selects Inter: body `inter_n4`, subheading `inter_n5`, heading/accent `inter_n7`.
2. [assets/base.css:631](<D:/All project/Shopify-theme/assets/base.css:631>) and [assets/base.css:641](<D:/All project/Shopify-theme/assets/base.css:641>) force **Jost, sans-serif !important** on main-content and footer text. These rules override normal local font-family declarations and merchant family settings in those regions.
3. No Jost font-face/import/loading path was found in local source. Browser spot-check: computed CSS requested Jost, but Chrome reported **Arial Bold** as the actual rendered main heading font. Loaded custom font faces were Inter. Declared family and actually loaded/rendered family differ.
4. Sampled header navigation links reported Inter, sans-serif / 14px / 700. Header is outside the main-content override.
5. This audit does not change typography/layout source. Only these audit documents were created.

## Global typography owners

| Responsibility | File |
|---|---|
| Body, h1–h6 presets, paragraph/buttons and global Jost overrides | [assets/base.css](<D:/All project/Shopify-theme/assets/base.css>) |
| Selected fonts and sizes | [config/settings_data.json](<D:/All project/Shopify-theme/config/settings_data.json>) |
| Merchant typography controls | [config/settings_schema.json](<D:/All project/Shopify-theme/config/settings_schema.json>) |
| Font-face generation and settings-backed variables | [snippets/theme-styles-variables.liquid](<D:/All project/Shopify-theme/snippets/theme-styles-variables.liquid>) |
| Font preload links | [snippets/fonts.liquid](<D:/All project/Shopify-theme/snippets/fonts.liquid>) |
| Global CSS loading | [snippets/stylesheets.liquid](<D:/All project/Shopify-theme/snippets/stylesheets.liquid>) |
| Main/footer scope and global resources | [layout/theme.liquid](<D:/All project/Shopify-theme/layout/theme.liquid>) |
| Custom block font/size/weight/leading/tracking variables | [snippets/typography-style.liquid](<D:/All project/Shopify-theme/snippets/typography-style.liquid>) |
| Rich text output and typography preset classes | [snippets/text.liquid](<D:/All project/Shopify-theme/snippets/text.liquid>) |
| Text wrapping and heading/paragraph spacing | [snippets/text-block-styles.liquid](<D:/All project/Shopify-theme/snippets/text-block-styles.liquid>) |
| Header/menu font variables | [snippets/menu-font-styles.liquid](<D:/All project/Shopify-theme/snippets/menu-font-styles.liquid>) |
| Submenu font variables | [snippets/submenu-font-styles.liquid](<D:/All project/Shopify-theme/snippets/submenu-font-styles.liquid>) |

## Saved base typography scale

These are configured preset values, not guaranteed computed sizes on every page. Component CSS, block settings, responsive clamp() and global overrides can change the final appearance. h1/h2 base sizes are fluid.

| Preset | Saved size | Family source | Base weight | Base line-height |
|---|---|---|---|---|
| h1 | 56px target | heading → Inter | 700 | 1 |
| h2 | 48px target | heading → Inter | 700 | 1 |
| h3 | 32px | heading → Inter | 700 | 1.1 |
| h4 | 24px | heading → Inter | 700 | 1 |
| h5 | 14px | subheading → Inter | 500 | 1.2 |
| h6 | 12px | subheading → Inter | 500 | 1.2 |
| paragraph/body | 14px | body → Inter | 400 | 1.6 |

## Semantic tags versus style presets

- `<h1>` is an HTML heading; `.h1` is a presentation class. They are different.
- [blocks/product-title.liquid:5](<D:/All project/Shopify-theme/blocks/product-title.liquid:5>) outputs `<p role="heading" aria-level="3">`; that is not a literal `<h3>`.
- Product/price/disclosure blocks can use h5/h6 presentation presets without rendering literal `<h5>`/`<h6>` elements.
- Rich text, article/page content and apps can add headings at runtime.

## Literal opening tags: source occurrences

Counts below are source definitions, not rendered DOM counts per page. Liquid schema/doc/comment blocks and CSS comments are excluded. Saved template/config HTML and JS-generated HTML strings can be included. Locale markup duplicates are excluded.

| Tag | Occurrences | Files |
|---|---:|---:|
| `h1` | 39 | 34 |
| `h2` | 87 | 48 |
| `h3` | 41 | 22 |
| `h4` | 7 | 6 |
| `h5` | 0 | 0 |
| `h6` | 0 | 0 |
| `p` | 241 | 64 |

## Page/template list and main owner files

Tags below are available in the listed source owners and active saved block/rich-text composition. They are not a rendered SEO census: conditional branches, optional panels and merchant content can change the actual tags. Shared header/footer/drawers are listed separately instead of repeated for every page.

| Page / template variant | Template file | Main text owners | Heading/paragraph tags available |
|---|---|---|---|
| 404 / Not found | [templates/404.json](<D:/All project/Shopify-theme/templates/404.json>) | [sections/main-404.liquid](<D:/All project/Shopify-theme/sections/main-404.liquid>)<br>[sections/product-list.liquid](<D:/All project/Shopify-theme/sections/product-list.liquid>) | `h1`, `h3`, `p` |
| Blog article | [templates/article.json](<D:/All project/Shopify-theme/templates/article.json>) | [sections/main-blog-post.liquid](<D:/All project/Shopify-theme/sections/main-blog-post.liquid>) | `h1`, `h2` |
| Blog listing | [templates/blog.json](<D:/All project/Shopify-theme/templates/blog.json>) | [sections/main-blog.liquid](<D:/All project/Shopify-theme/sections/main-blog.liquid>)<br>[snippets/gemstone-blog-listing.liquid](<D:/All project/Shopify-theme/snippets/gemstone-blog-listing.liquid>) | `h1`, `h2`, `p` |
| Cart | [templates/cart.json](<D:/All project/Shopify-theme/templates/cart.json>) | [sections/main-cart.liquid](<D:/All project/Shopify-theme/sections/main-cart.liquid>)<br>[sections/product-list.liquid](<D:/All project/Shopify-theme/sections/product-list.liquid>)<br>[snippets/cart-products.liquid](<D:/All project/Shopify-theme/snippets/cart-products.liquid>)<br>[snippets/cart-summary.liquid](<D:/All project/Shopify-theme/snippets/cart-summary.liquid>) | `h1`, `h3`, `p` |
| Jewellery collection | [templates/collection.jewellery.json](<D:/All project/Shopify-theme/templates/collection.jewellery.json>) | [sections/section.liquid](<D:/All project/Shopify-theme/sections/section.liquid>)<br>[sections/main-collection.liquid](<D:/All project/Shopify-theme/sections/main-collection.liquid>)<br>[snippets/stone-product-listing.liquid](<D:/All project/Shopify-theme/snippets/stone-product-listing.liquid>)<br>[snippets/stone-product-card.liquid](<D:/All project/Shopify-theme/snippets/stone-product-card.liquid>)<br>[snippets/product-grid.liquid](<D:/All project/Shopify-theme/snippets/product-grid.liquid>) | `h1`, `h2`, `h3`, `h4`, `p` |
| Default collection | [templates/collection.json](<D:/All project/Shopify-theme/templates/collection.json>) | [sections/collection-hero.liquid](<D:/All project/Shopify-theme/sections/collection-hero.liquid>)<br>[sections/main-collection.liquid](<D:/All project/Shopify-theme/sections/main-collection.liquid>)<br>[snippets/stone-product-listing.liquid](<D:/All project/Shopify-theme/snippets/stone-product-listing.liquid>)<br>[snippets/stone-product-card.liquid](<D:/All project/Shopify-theme/snippets/stone-product-card.liquid>)<br>[snippets/product-grid.liquid](<D:/All project/Shopify-theme/snippets/product-grid.liquid>) | `h1`, `h2`, `h3`, `h4`, `p` |
| Home | [templates/index.json](<D:/All project/Shopify-theme/templates/index.json>) | [sections/_blocks.liquid](<D:/All project/Shopify-theme/sections/_blocks.liquid>)<br>[sections/hero.liquid](<D:/All project/Shopify-theme/sections/hero.liquid>)<br>[sections/trust-benefits.liquid](<D:/All project/Shopify-theme/sections/trust-benefits.liquid>)<br>[sections/gemstone-collection-slider.liquid](<D:/All project/Shopify-theme/sections/gemstone-collection-slider.liquid>)<br>[sections/home-second-banner.liquid](<D:/All project/Shopify-theme/sections/home-second-banner.liquid>)<br>[sections/gemstone-editorial-home.liquid](<D:/All project/Shopify-theme/sections/gemstone-editorial-home.liquid>) | `h1`, `h2`, `h3`, `p` |
| All collections | [templates/list-collections.json](<D:/All project/Shopify-theme/templates/list-collections.json>) | [sections/main-collection-list.liquid](<D:/All project/Shopify-theme/sections/main-collection-list.liquid>)<br>[snippets/collection-card.liquid](<D:/All project/Shopify-theme/snippets/collection-card.liquid>) | `h1`, `p` |
| About Raza Gems | [templates/page.about.json](<D:/All project/Shopify-theme/templates/page.about.json>) | [sections/about-raza-gems.liquid](<D:/All project/Shopify-theme/sections/about-raza-gems.liquid>) | `h1`, `h2`, `h3`, `p` |
| Blog page | [templates/page.blog.json](<D:/All project/Shopify-theme/templates/page.blog.json>) | [sections/main-blog.liquid](<D:/All project/Shopify-theme/sections/main-blog.liquid>)<br>[snippets/gemstone-blog-listing.liquid](<D:/All project/Shopify-theme/snippets/gemstone-blog-listing.liquid>) | `h1`, `h2`, `p` |
| Career | [templates/page.career.json](<D:/All project/Shopify-theme/templates/page.career.json>) | [sections/_blocks.liquid](<D:/All project/Shopify-theme/sections/_blocks.liquid>) | App/content-driven; see notes |
| Contact | [templates/page.contact.json](<D:/All project/Shopify-theme/templates/page.contact.json>) | [sections/main-page.liquid](<D:/All project/Shopify-theme/sections/main-page.liquid>)<br>[sections/section.liquid](<D:/All project/Shopify-theme/sections/section.liquid>) | `h1` |
| FAQ | [templates/page.faq.json](<D:/All project/Shopify-theme/templates/page.faq.json>) | [sections/faq-page.liquid](<D:/All project/Shopify-theme/sections/faq-page.liquid>) | `h1`, `h2`, `h3`, `p` |
| Gemstone page | [templates/page.gemstone.json](<D:/All project/Shopify-theme/templates/page.gemstone.json>) | [sections/gemstone-editorial-home.liquid](<D:/All project/Shopify-theme/sections/gemstone-editorial-home.liquid>) | `h1`, `h2`, `h3`, `p` |
| Gemstones page | [templates/page.gemstones.json](<D:/All project/Shopify-theme/templates/page.gemstones.json>) | [sections/gemstone-editorial-home.liquid](<D:/All project/Shopify-theme/sections/gemstone-editorial-home.liquid>) | `h1`, `h2`, `h3`, `p` |
| Jewellery listing | [templates/page.jewellery.json](<D:/All project/Shopify-theme/templates/page.jewellery.json>) | [sections/jewellery-listing-page.liquid](<D:/All project/Shopify-theme/sections/jewellery-listing-page.liquid>) | `h1`, `h2`, `h3`, `p` |
| Default page / payment-methods composition | [templates/page.json](<D:/All project/Shopify-theme/templates/page.json>) | [sections/payment-methods.liquid](<D:/All project/Shopify-theme/sections/payment-methods.liquid>) | `h1`, `h2`, `h3`, `p` |
| Precious | [templates/page.precious.json](<D:/All project/Shopify-theme/templates/page.precious.json>) | [sections/main-page.liquid](<D:/All project/Shopify-theme/sections/main-page.liquid>)<br>[snippets/precious-page-fallback.liquid](<D:/All project/Shopify-theme/snippets/precious-page-fallback.liquid>)<br>[snippets/stone-product-listing.liquid](<D:/All project/Shopify-theme/snippets/stone-product-listing.liquid>)<br>[snippets/stone-product-card.liquid](<D:/All project/Shopify-theme/snippets/stone-product-card.liquid>) | `h1`, `h2`, `h3`, `p` |
| Privacy policy | [templates/page.privacy-policy.json](<D:/All project/Shopify-theme/templates/page.privacy-policy.json>) | [sections/privacy-policy.liquid](<D:/All project/Shopify-theme/sections/privacy-policy.liquid>) | `h1`, `h2`, `p` |
| Return / Exchange | [templates/page.return.json](<D:/All project/Shopify-theme/templates/page.return.json>) | [sections/return-exchange-policy.liquid](<D:/All project/Shopify-theme/sections/return-exchange-policy.liquid>) | `h1`, `h2`, `p` |
| Sales | [templates/page.sales.json](<D:/All project/Shopify-theme/templates/page.sales.json>) | [sections/sales.liquid](<D:/All project/Shopify-theme/sections/sales.liquid>)<br>[snippets/stone-product-card.liquid](<D:/All project/Shopify-theme/snippets/stone-product-card.liquid>) | `h1`, `h2`, `p` |
| Semi-Precious | [templates/page.semi-precious.json](<D:/All project/Shopify-theme/templates/page.semi-precious.json>) | [sections/main-page.liquid](<D:/All project/Shopify-theme/sections/main-page.liquid>)<br>[sections/_blocks.liquid](<D:/All project/Shopify-theme/sections/_blocks.liquid>)<br>[snippets/semi-precious-products.liquid](<D:/All project/Shopify-theme/snippets/semi-precious-products.liquid>)<br>[snippets/stone-product-listing.liquid](<D:/All project/Shopify-theme/snippets/stone-product-listing.liquid>)<br>[snippets/stone-product-card.liquid](<D:/All project/Shopify-theme/snippets/stone-product-card.liquid>) | `h1`, `h2`, `h3`, `p` |
| Support | [templates/page.support.json](<D:/All project/Shopify-theme/templates/page.support.json>) | [sections/Support-top.liquid](<D:/All project/Shopify-theme/sections/Support-top.liquid>)<br>[sections/Support-middle.liquid](<D:/All project/Shopify-theme/sections/Support-middle.liquid>)<br>[sections/section.liquid](<D:/All project/Shopify-theme/sections/section.liquid>) | `h1`, `h2`, `h3`, `p` |
| Terms and conditions | [templates/page.term-condition.json](<D:/All project/Shopify-theme/templates/page.term-condition.json>) | [sections/terms-condition-page.liquid](<D:/All project/Shopify-theme/sections/terms-condition-page.liquid>) | `h1`, `h2`, `p` |
| Wishlist | [templates/page.wishlist.json](<D:/All project/Shopify-theme/templates/page.wishlist.json>) | [sections/wishlist-page.liquid](<D:/All project/Shopify-theme/sections/wishlist-page.liquid>)<br>[snippets/wishlist-content.liquid](<D:/All project/Shopify-theme/snippets/wishlist-content.liquid>) | `h1`, `h2`, `p` |
| Password / Coming soon | [templates/password.json](<D:/All project/Shopify-theme/templates/password.json>) | [sections/password.liquid](<D:/All project/Shopify-theme/sections/password.liquid>) | `h1`, `p` |
| Product details | [templates/product.json](<D:/All project/Shopify-theme/templates/product.json>) | [sections/product-information.liquid](<D:/All project/Shopify-theme/sections/product-information.liquid>)<br>[sections/product-recommendations.liquid](<D:/All project/Shopify-theme/sections/product-recommendations.liquid>)<br>[snippets/product-information-content.liquid](<D:/All project/Shopify-theme/snippets/product-information-content.liquid>)<br>[blocks/_product-details.liquid](<D:/All project/Shopify-theme/blocks/_product-details.liquid>)<br>[blocks/gemstone-details.liquid](<D:/All project/Shopify-theme/blocks/gemstone-details.liquid>)<br>[blocks/buy-buttons.liquid](<D:/All project/Shopify-theme/blocks/buy-buttons.liquid>)<br>[blocks/product-title.liquid](<D:/All project/Shopify-theme/blocks/product-title.liquid>) | `h1`, `h2`, `h3`, `h4`, `p` |
| Search results | [templates/search.json](<D:/All project/Shopify-theme/templates/search.json>) | [sections/search-header.liquid](<D:/All project/Shopify-theme/sections/search-header.liquid>)<br>[sections/search-results.liquid](<D:/All project/Shopify-theme/sections/search-results.liquid>)<br>[snippets/search-gemstone-results.liquid](<D:/All project/Shopify-theme/snippets/search-gemstone-results.liquid>)<br>[snippets/stone-product-card.liquid](<D:/All project/Shopify-theme/snippets/stone-product-card.liquid>) | `h1`, `p` |
| Gift card | [templates/gift_card.liquid](<D:/All project/Shopify-theme/templates/gift_card.liquid>) | [templates/gift_card.liquid](<D:/All project/Shopify-theme/templates/gift_card.liquid>)<br>[assets/template-giftcard.css](<D:/All project/Shopify-theme/assets/template-giftcard.css>) | `h1`, `h2`, `p`, `h3` |

### Mapping notes

- Precious/Semi-Precious dispatch depends on `page.handle`. A template suffix does not guarantee the page handle.
- Collection gemstone filters and standard grid are alternate paths controlled by `enable_gemstone_filters`; both source owners are listed.
- Search currently renders search-header → search-results → search-gemstone-results → stone-product-card. Legacy saved filter/product blocks are not rendered by the current search path.
- The current default `page.json` active composition is payment-methods, not generic main-page.
- Career job-list output belongs to the Shabdd app block. Its final HTML/font source is not local.
- Home, Gemstone and Gemstones share gemstone-editorial-home. Blog and Blog page share main-blog.
- Disabled saved sections/blocks were skipped for page composition. Optional/unused source is still included in the full source index.

## Local font-family declarations by page

Local declarations below can be overridden by the main/footer Jost !important rules. Inherited/global means no direct font-family declaration was found in the listed local owners, not that text has no font.

| Page | Local declared families |
|---|---|
| 404 / Not found | Inherited/global or merchant-rich-text settings |
| Blog article | var(--font-heading--family) |
| Blog listing | var(--font-heading--family) |
| Cart | var(--font-paragraph--family) |
| Jewellery collection | var(--font-heading--family)<br>Inter, sans-serif |
| Default collection | var(--font-heading--family)<br>Inter, sans-serif |
| Home | Georgia, "Times New Roman", serif<br>var(--font-heading--family, Georgia, serif) |
| All collections | Inherited/global or merchant-rich-text settings |
| About Raza Gems | Jost, sans-serif |
| Blog page | var(--font-heading--family) |
| Career | Inherited/global or merchant-rich-text settings |
| Contact | Georgia, 'Times New Roman', serif<br>Georgia, "Times New Roman", serif |
| FAQ | Georgia, "Times New Roman", serif |
| Gemstone page | var(--font-heading--family, Georgia, serif) |
| Gemstones page | var(--font-heading--family, Georgia, serif) |
| Jewellery listing | Inherited/global or merchant-rich-text settings |
| Default page / payment-methods composition | Jost, sans-serif |
| Precious | Georgia, 'Times New Roman', serif<br>Georgia, "Times New Roman", serif<br>var(--font-heading--family)<br>Inter, sans-serif |
| Privacy policy | Georgia, "Times New Roman", serif |
| Return / Exchange | Georgia, "Times New Roman", serif |
| Sales | Inter, sans-serif<br>var(--font-heading--family) |
| Semi-Precious | Georgia, 'Times New Roman', serif<br>Georgia, "Times New Roman", serif<br>Inter, sans-serif |
| Support | Georgia, "Times New Roman", serif<br>Georgia, 'Times New Roman', serif<br>Georgia,'Times New Roman',serif |
| Terms and conditions | Georgia, "Times New Roman", serif |
| Wishlist | var(--font-heading--family) |
| Password / Coming soon | Inherited/global or merchant-rich-text settings |
| Product details | Inherited/global or merchant-rich-text settings |
| Search results | var(--font-heading--family)<br>Inter, sans-serif |
| Gift card | var(--font-paragraph--family) |

## Every direct font-family declaration

148 declarations in 53 source files. Repeated locations/declarations are intentional.

| File and line | Declared value |
|---|---|
| [templates/page.support.json:230](<D:/All project/Shopify-theme/templates/page.support.json:230>) | `Georgia,'Times New Roman',serif` |
| [templates/page.support.json:230](<D:/All project/Shopify-theme/templates/page.support.json:230>) | `Georgia,'Times New Roman',serif` |
| [templates/page.support.json:230](<D:/All project/Shopify-theme/templates/page.support.json:230>) | `Georgia,'Times New Roman',serif` |
| [sections/about-raza-gems.liquid:224](<D:/All project/Shopify-theme/sections/about-raza-gems.liquid:224>) | `Jost, sans-serif` |
| [sections/about-raza-gems.liquid:319](<D:/All project/Shopify-theme/sections/about-raza-gems.liquid:319>) | `Jost, sans-serif` |
| [sections/about-raza-gems.liquid:522](<D:/All project/Shopify-theme/sections/about-raza-gems.liquid:522>) | `Jost, sans-serif` |
| [sections/collection-hero.liquid:161](<D:/All project/Shopify-theme/sections/collection-hero.liquid:161>) | `var(--font-heading--family)` |
| [sections/collection-hero.liquid:257](<D:/All project/Shopify-theme/sections/collection-hero.liquid:257>) | `var(--font-heading--family)` |
| [sections/faq-page.liquid:158](<D:/All project/Shopify-theme/sections/faq-page.liquid:158>) | `Georgia, "Times New Roman", serif` |
| [sections/faq-page.liquid:192](<D:/All project/Shopify-theme/sections/faq-page.liquid:192>) | `Georgia, "Times New Roman", serif` |
| [sections/faq-page.liquid:265](<D:/All project/Shopify-theme/sections/faq-page.liquid:265>) | `Georgia, "Times New Roman", serif` |
| [sections/gemstone-collection-slider.liquid:102](<D:/All project/Shopify-theme/sections/gemstone-collection-slider.liquid:102>) | `var(--font-heading--family, Georgia, serif)` |
| [sections/gemstone-editorial-home.liquid:319](<D:/All project/Shopify-theme/sections/gemstone-editorial-home.liquid:319>) | `var(--font-heading--family, Georgia, serif)` |
| [sections/gemstone-editorial-home.liquid:402](<D:/All project/Shopify-theme/sections/gemstone-editorial-home.liquid:402>) | `var(--font-heading--family, Georgia, serif)` |
| [sections/gemstone-editorial-home.liquid:480](<D:/All project/Shopify-theme/sections/gemstone-editorial-home.liquid:480>) | `var(--font-heading--family, Georgia, serif)` |
| [sections/gemstone-landing.liquid:131](<D:/All project/Shopify-theme/sections/gemstone-landing.liquid:131>) | `var(--font-heading--family)` |
| [sections/gemstone-landing.liquid:231](<D:/All project/Shopify-theme/sections/gemstone-landing.liquid:231>) | `var(--font-heading--family)` |
| [sections/header.liquid:1065](<D:/All project/Shopify-theme/sections/header.liquid:1065>) | `var(--menu-localization-font)` |
| [sections/header.liquid:1211](<D:/All project/Shopify-theme/sections/header.liquid:1211>) | `var(--menu-localization-font)` |
| [sections/hero.liquid:1024](<D:/All project/Shopify-theme/sections/hero.liquid:1024>) | `Georgia, "Times New Roman", serif` |
| [sections/home-second-banner.liquid:97](<D:/All project/Shopify-theme/sections/home-second-banner.liquid:97>) | `var(--font-heading--family, Georgia, serif)` |
| [sections/main-blog-post.liquid:314](<D:/All project/Shopify-theme/sections/main-blog-post.liquid:314>) | `var(--font-heading--family)` |
| [sections/main-blog-post.liquid:392](<D:/All project/Shopify-theme/sections/main-blog-post.liquid:392>) | `var(--font-heading--family)` |
| [sections/main-blog-post.liquid:457](<D:/All project/Shopify-theme/sections/main-blog-post.liquid:457>) | `var(--font-heading--family)` |
| [sections/main-collection.liquid:194](<D:/All project/Shopify-theme/sections/main-collection.liquid:194>) | `var(--font-heading--family)` |
| [sections/main-page.liquid:308](<D:/All project/Shopify-theme/sections/main-page.liquid:308>) | `Georgia, 'Times New Roman', serif` |
| [sections/main-page.liquid:351](<D:/All project/Shopify-theme/sections/main-page.liquid:351>) | `Georgia, 'Times New Roman', serif` |
| [sections/main-page.liquid:403](<D:/All project/Shopify-theme/sections/main-page.liquid:403>) | `Georgia, 'Times New Roman', serif` |
| [sections/main-page.liquid:551](<D:/All project/Shopify-theme/sections/main-page.liquid:551>) | `Georgia, "Times New Roman", serif` |
| [sections/main-page.liquid:606](<D:/All project/Shopify-theme/sections/main-page.liquid:606>) | `Georgia, "Times New Roman", serif` |
| [sections/payment-methods.liquid:179](<D:/All project/Shopify-theme/sections/payment-methods.liquid:179>) | `Jost, sans-serif` |
| [sections/payment-methods.liquid:218](<D:/All project/Shopify-theme/sections/payment-methods.liquid:218>) | `Jost, sans-serif` |
| [sections/payment-methods.liquid:336](<D:/All project/Shopify-theme/sections/payment-methods.liquid:336>) | `Jost, sans-serif` |
| [sections/payment-methods.liquid:398](<D:/All project/Shopify-theme/sections/payment-methods.liquid:398>) | `Jost, sans-serif` |
| [sections/privacy-policy.liquid:132](<D:/All project/Shopify-theme/sections/privacy-policy.liquid:132>) | `Georgia, "Times New Roman", serif` |
| [sections/privacy-policy.liquid:222](<D:/All project/Shopify-theme/sections/privacy-policy.liquid:222>) | `Georgia, "Times New Roman", serif` |
| [sections/privacy-policy.liquid:240](<D:/All project/Shopify-theme/sections/privacy-policy.liquid:240>) | `Georgia, "Times New Roman", serif` |
| [sections/raza-gems-footer.liquid:343](<D:/All project/Shopify-theme/sections/raza-gems-footer.liquid:343>) | `var(--font-heading--family)` |
| [sections/related-shape-collections.liquid:71](<D:/All project/Shopify-theme/sections/related-shape-collections.liquid:71>) | `var(--font-heading--family, Georgia, serif)` |
| [sections/return-exchange-policy.liquid:204](<D:/All project/Shopify-theme/sections/return-exchange-policy.liquid:204>) | `Georgia, "Times New Roman", serif` |
| [sections/return-exchange-policy.liquid:263](<D:/All project/Shopify-theme/sections/return-exchange-policy.liquid:263>) | `Georgia, "Times New Roman", serif` |
| [sections/return-exchange-policy.liquid:315](<D:/All project/Shopify-theme/sections/return-exchange-policy.liquid:315>) | `Georgia, "Times New Roman", serif` |
| [sections/return-exchange-policy.liquid:436](<D:/All project/Shopify-theme/sections/return-exchange-policy.liquid:436>) | `Georgia, "Times New Roman", serif` |
| [sections/sales.liquid:460](<D:/All project/Shopify-theme/sections/sales.liquid:460>) | `Inter, sans-serif` |
| [sections/sales.liquid:521](<D:/All project/Shopify-theme/sections/sales.liquid:521>) | `var(--font-heading--family)` |
| [sections/sales.liquid:550](<D:/All project/Shopify-theme/sections/sales.liquid:550>) | `var(--font-heading--family)` |
| [sections/search-header.liquid:36](<D:/All project/Shopify-theme/sections/search-header.liquid:36>) | `var(--font-heading--family)` |
| [sections/Support-middle.liquid:126](<D:/All project/Shopify-theme/sections/Support-middle.liquid:126>) | `Georgia, "Times New Roman", serif` |
| [sections/Support-middle.liquid:238](<D:/All project/Shopify-theme/sections/Support-middle.liquid:238>) | `Georgia, "Times New Roman", serif` |
| [sections/Support-top.liquid:71](<D:/All project/Shopify-theme/sections/Support-top.liquid:71>) | `Georgia, "Times New Roman", serif` |
| [sections/terms-condition-page.liquid:136](<D:/All project/Shopify-theme/sections/terms-condition-page.liquid:136>) | `Georgia, "Times New Roman", serif` |
| [sections/terms-condition-page.liquid:219](<D:/All project/Shopify-theme/sections/terms-condition-page.liquid:219>) | `Georgia, "Times New Roman", serif` |
| [sections/terms-condition-page.liquid:250](<D:/All project/Shopify-theme/sections/terms-condition-page.liquid:250>) | `Georgia, "Times New Roman", serif` |
| [sections/terms-condition-page.liquid:275](<D:/All project/Shopify-theme/sections/terms-condition-page.liquid:275>) | `Georgia, "Times New Roman", serif` |
| [sections/terms-condition-page.liquid:284](<D:/All project/Shopify-theme/sections/terms-condition-page.liquid:284>) | `Georgia, "Times New Roman", serif` |
| [sections/trust-benefits.liquid:39](<D:/All project/Shopify-theme/sections/trust-benefits.liquid:39>) | `var(--font-heading--family, Georgia, serif)` |
| [blocks/ai_gen_block_e5807af.liquid:38](<D:/All project/Shopify-theme/blocks/ai_gen_block_e5807af.liquid:38>) | `Georgia, 'Times New Roman', serif` |
| [blocks/ai_gen_block_e5807af.liquid:102](<D:/All project/Shopify-theme/blocks/ai_gen_block_e5807af.liquid:102>) | `Georgia, 'Times New Roman', serif` |
| [blocks/contact-form.liquid:269](<D:/All project/Shopify-theme/blocks/contact-form.liquid:269>) | `Georgia, 'Times New Roman', serif` |
| [blocks/_cart-title.liquid:64](<D:/All project/Shopify-theme/blocks/_cart-title.liquid:64>) | `var(--font-paragraph--family)` |
| [blocks/_header-logo.liquid:90](<D:/All project/Shopify-theme/blocks/_header-logo.liquid:90>) | `var(--font-family)` |
| [blocks/_header-menu.liquid:313](<D:/All project/Shopify-theme/blocks/_header-menu.liquid:313>) | `var(--menu-top-level-font-family)` |
| [blocks/_header-menu.liquid:706](<D:/All project/Shopify-theme/blocks/_header-menu.liquid:706>) | `var(--menu-child-font-family)` |
| [blocks/_header-menu.liquid:793](<D:/All project/Shopify-theme/blocks/_header-menu.liquid:793>) | `var(--menu-parent-font-family)` |
| [snippets/accordion-styles.liquid:48](<D:/All project/Shopify-theme/snippets/accordion-styles.liquid:48>) | `var(--summary-font-family)` |
| [snippets/buy-buttons-styles.liquid:181](<D:/All project/Shopify-theme/snippets/buy-buttons-styles.liquid:181>) | `var(--font-body--family)` |
| [snippets/buy-buttons-styles.liquid:205](<D:/All project/Shopify-theme/snippets/buy-buttons-styles.liquid:205>) | `var(--font-paragraph--family)` |
| [snippets/cart-typography-styles.liquid:10](<D:/All project/Shopify-theme/snippets/cart-typography-styles.liquid:10>) | `var(--cart-primary-font-family)` |
| [snippets/cart-typography-styles.liquid:16](<D:/All project/Shopify-theme/snippets/cart-typography-styles.liquid:16>) | `var(--cart-secondary-font-family)` |
| [snippets/gemstone-blog-listing.liquid:234](<D:/All project/Shopify-theme/snippets/gemstone-blog-listing.liquid:234>) | `var(--font-heading--family)` |
| [snippets/gemstone-blog-listing.liquid:253](<D:/All project/Shopify-theme/snippets/gemstone-blog-listing.liquid:253>) | `var(--font-heading--family)` |
| [snippets/gemstone-blog-listing.liquid:325](<D:/All project/Shopify-theme/snippets/gemstone-blog-listing.liquid:325>) | `var(--font-heading--family)` |
| [snippets/gemstone-blog-listing.liquid:475](<D:/All project/Shopify-theme/snippets/gemstone-blog-listing.liquid:475>) | `var(--font-heading--family)` |
| [snippets/gemstone-blog-listing.liquid:517](<D:/All project/Shopify-theme/snippets/gemstone-blog-listing.liquid:517>) | `var(--font-heading--family)` |
| [snippets/gemstone-landing-fallback.liquid:108](<D:/All project/Shopify-theme/snippets/gemstone-landing-fallback.liquid:108>) | `var(--font-heading--family)` |
| [snippets/gemstone-landing-fallback.liquid:207](<D:/All project/Shopify-theme/snippets/gemstone-landing-fallback.liquid:207>) | `var(--font-heading--family)` |
| [snippets/gemstone-specifications-panel.liquid:256](<D:/All project/Shopify-theme/snippets/gemstone-specifications-panel.liquid:256>) | `inherit` |
| [snippets/header-actions.liquid:316](<D:/All project/Shopify-theme/snippets/header-actions.liquid:316>) | `var(--header-actions-font-family)` |
| [snippets/header-actions.liquid:370](<D:/All project/Shopify-theme/snippets/header-actions.liquid:370>) | `var(--font-paragraph--family)` |
| [snippets/header-actions.liquid:455](<D:/All project/Shopify-theme/snippets/header-actions.liquid:455>) | `var(--font-paragraph--family)` |
| [snippets/header-drawer.liquid:1080](<D:/All project/Shopify-theme/snippets/header-drawer.liquid:1080>) | `var(--menu-top-level-font-family)` |
| [snippets/header-drawer.liquid:1168](<D:/All project/Shopify-theme/snippets/header-drawer.liquid:1168>) | `var(--menu-top-level-font-family)` |
| [snippets/header-drawer.liquid:1289](<D:/All project/Shopify-theme/snippets/header-drawer.liquid:1289>) | `var(--menu-top-level-font-family)` |
| [snippets/header-drawer.liquid:1304](<D:/All project/Shopify-theme/snippets/header-drawer.liquid:1304>) | `var(--menu-parent-font-family)` |
| [snippets/header-drawer.liquid:1318](<D:/All project/Shopify-theme/snippets/header-drawer.liquid:1318>) | `var(--menu-child-font-family)` |
| [snippets/header-drawer.liquid:1690](<D:/All project/Shopify-theme/snippets/header-drawer.liquid:1690>) | `var(--menu-localization-font)` |
| [snippets/header-drawer.liquid:1717](<D:/All project/Shopify-theme/snippets/header-drawer.liquid:1717>) | `var(--menu-localization-font)` |
| [snippets/header-drawer.liquid:1813](<D:/All project/Shopify-theme/snippets/header-drawer.liquid:1813>) | `var(--font-heading--family)` |
| [snippets/header-drawer.liquid:1922](<D:/All project/Shopify-theme/snippets/header-drawer.liquid:1922>) | `var(--font-heading--family)` |
| [snippets/header-drawer.liquid:2021](<D:/All project/Shopify-theme/snippets/header-drawer.liquid:2021>) | `var(--font-heading--family)` |
| [snippets/header-drawer.liquid:2103](<D:/All project/Shopify-theme/snippets/header-drawer.liquid:2103>) | `var(--font-heading--family)` |
| [snippets/jumbo-text.liquid:110](<D:/All project/Shopify-theme/snippets/jumbo-text.liquid:110>) | `var(--font-family, inherit)` |
| [snippets/list-filter.liquid:449](<D:/All project/Shopify-theme/snippets/list-filter.liquid:449>) | `var(--font-paragraph--family)` |
| [snippets/list-filter.liquid:475](<D:/All project/Shopify-theme/snippets/list-filter.liquid:475>) | `var(--font-paragraph--family)` |
| [snippets/precious-page-fallback.liquid:436](<D:/All project/Shopify-theme/snippets/precious-page-fallback.liquid:436>) | `var(--font-heading--family)` |
| [snippets/precious-page-fallback.liquid:503](<D:/All project/Shopify-theme/snippets/precious-page-fallback.liquid:503>) | `var(--font-heading--family)` |
| [snippets/precious-page-fallback.liquid:615](<D:/All project/Shopify-theme/snippets/precious-page-fallback.liquid:615>) | `var(--font-heading--family)` |
| [snippets/precious-page-fallback.liquid:654](<D:/All project/Shopify-theme/snippets/precious-page-fallback.liquid:654>) | `var(--font-heading--family)` |
| [snippets/precious-page-fallback.liquid:798](<D:/All project/Shopify-theme/snippets/precious-page-fallback.liquid:798>) | `Georgia, "Times New Roman", serif` |
| [snippets/precious-page-fallback.liquid:815](<D:/All project/Shopify-theme/snippets/precious-page-fallback.liquid:815>) | `Georgia, "Times New Roman", serif` |
| [snippets/precious-page-fallback.liquid:1020](<D:/All project/Shopify-theme/snippets/precious-page-fallback.liquid:1020>) | `Georgia, "Times New Roman", serif` |
| [snippets/precious-page-fallback.liquid:1083](<D:/All project/Shopify-theme/snippets/precious-page-fallback.liquid:1083>) | `Georgia, "Times New Roman", serif` |
| [snippets/precious-page-fallback.liquid:1147](<D:/All project/Shopify-theme/snippets/precious-page-fallback.liquid:1147>) | `Georgia, "Times New Roman", serif` |
| [snippets/precious-page-fallback.liquid:1224](<D:/All project/Shopify-theme/snippets/precious-page-fallback.liquid:1224>) | `Georgia, "Times New Roman", serif` |
| [snippets/price-styles.liquid:44](<D:/All project/Shopify-theme/snippets/price-styles.liquid:44>) | `var(--font-body--family)` |
| [snippets/product-badges-styles.liquid:41](<D:/All project/Shopify-theme/snippets/product-badges-styles.liquid:41>) | `var(--badge-font-family)` |
| [snippets/product-card-gallery-zoom-details-styles.liquid:17](<D:/All project/Shopify-theme/snippets/product-card-gallery-zoom-details-styles.liquid:17>) | `var(--font-paragraph--family)` |
| [snippets/resource-card.liquid:213](<D:/All project/Shopify-theme/snippets/resource-card.liquid:213>) | `var(--font-body--family)` |
| [snippets/search-gemstone-results.liquid:97](<D:/All project/Shopify-theme/snippets/search-gemstone-results.liquid:97>) | `var(--font-heading--family)` |
| [snippets/search-gemstone-results.liquid:100](<D:/All project/Shopify-theme/snippets/search-gemstone-results.liquid:100>) | `var(--font-heading--family)` |
| [snippets/search-gemstone-results.liquid:125](<D:/All project/Shopify-theme/snippets/search-gemstone-results.liquid:125>) | `var(--font-heading--family)` |
| [snippets/search-gemstone-results.liquid:126](<D:/All project/Shopify-theme/snippets/search-gemstone-results.liquid:126>) | `var(--font-heading--family)` |
| [snippets/stone-product-card.liquid:194](<D:/All project/Shopify-theme/snippets/stone-product-card.liquid:194>) | `Inter, sans-serif` |
| [snippets/stone-product-listing.liquid:550](<D:/All project/Shopify-theme/snippets/stone-product-listing.liquid:550>) | `Inter, sans-serif` |
| [snippets/stone-product-listing.liquid:583](<D:/All project/Shopify-theme/snippets/stone-product-listing.liquid:583>) | `Inter, sans-serif` |
| [snippets/theme-drawer-styles.liquid:117](<D:/All project/Shopify-theme/snippets/theme-drawer-styles.liquid:117>) | `var(--font-paragraph--family)` |
| [snippets/wishlist-content.liquid:354](<D:/All project/Shopify-theme/snippets/wishlist-content.liquid:354>) | `var(--font-heading--family)` |
| [snippets/wishlist-content.liquid:419](<D:/All project/Shopify-theme/snippets/wishlist-content.liquid:419>) | `var(--font-heading--family)` |
| [snippets/wishlist-content.liquid:497](<D:/All project/Shopify-theme/snippets/wishlist-content.liquid:497>) | `var(--font-heading--family)` |
| [snippets/wishlist-content.liquid:582](<D:/All project/Shopify-theme/snippets/wishlist-content.liquid:582>) | `var(--font-heading--family)` |
| [assets/base.css:621](<D:/All project/Shopify-theme/assets/base.css:621>) | `var(--font-paragraph--family)` |
| [assets/base.css:633](<D:/All project/Shopify-theme/assets/base.css:633>) | `Jost, sans-serif !important` |
| [assets/base.css:638](<D:/All project/Shopify-theme/assets/base.css:638>) | `Jost, sans-serif` |
| [assets/base.css:643](<D:/All project/Shopify-theme/assets/base.css:643>) | `Jost, sans-serif !important` |
| [assets/base.css:666](<D:/All project/Shopify-theme/assets/base.css:666>) | `var(--font-h1--family)` |
| [assets/base.css:688](<D:/All project/Shopify-theme/assets/base.css:688>) | `var(--font-h2--family)` |
| [assets/base.css:711](<D:/All project/Shopify-theme/assets/base.css:711>) | `var(--font-h3--family)` |
| [assets/base.css:733](<D:/All project/Shopify-theme/assets/base.css:733>) | `var(--font-h4--family)` |
| [assets/base.css:755](<D:/All project/Shopify-theme/assets/base.css:755>) | `var(--font-h5--family)` |
| [assets/base.css:777](<D:/All project/Shopify-theme/assets/base.css:777>) | `var(--font-h6--family)` |
| [assets/base.css:854](<D:/All project/Shopify-theme/assets/base.css:854>) | `var(--font-paragraph--family)` |
| [assets/base.css:871](<D:/All project/Shopify-theme/assets/base.css:871>) | `var(--button-font-family-primary)` |
| [assets/base.css:881](<D:/All project/Shopify-theme/assets/base.css:881>) | `var(--button-font-family-secondary)` |
| [assets/base.css:887](<D:/All project/Shopify-theme/assets/base.css:887>) | `var(--button-font-family-primary)` |
| [assets/base.css:955](<D:/All project/Shopify-theme/assets/base.css:955>) | `var(--button-font-family-primary)` |
| [assets/base.css:981](<D:/All project/Shopify-theme/assets/base.css:981>) | `var(--font-paragraph--family)` |
| [assets/base.css:1148](<D:/All project/Shopify-theme/assets/base.css:1148>) | `var(--font-family)` |
| [assets/overflow-list.css:46](<D:/All project/Shopify-theme/assets/overflow-list.css:46>) | `var(--font-paragraph-family)` |
| [assets/precious-page.css:84](<D:/All project/Shopify-theme/assets/precious-page.css:84>) | `var(--font-heading--family)` |
| [assets/precious-page.css:151](<D:/All project/Shopify-theme/assets/precious-page.css:151>) | `var(--font-heading--family)` |
| [assets/precious-page.css:263](<D:/All project/Shopify-theme/assets/precious-page.css:263>) | `var(--font-heading--family)` |
| [assets/precious-page.css:310](<D:/All project/Shopify-theme/assets/precious-page.css:310>) | `Georgia, "Times New Roman", serif` |
| [assets/precious-page.css:327](<D:/All project/Shopify-theme/assets/precious-page.css:327>) | `Georgia, "Times New Roman", serif` |
| [assets/precious-page.css:532](<D:/All project/Shopify-theme/assets/precious-page.css:532>) | `Georgia, "Times New Roman", serif` |
| [assets/precious-page.css:595](<D:/All project/Shopify-theme/assets/precious-page.css:595>) | `Georgia, "Times New Roman", serif` |
| [assets/precious-page.css:659](<D:/All project/Shopify-theme/assets/precious-page.css:659>) | `Georgia, "Times New Roman", serif` |
| [assets/precious-page.css:736](<D:/All project/Shopify-theme/assets/precious-page.css:736>) | `Georgia, "Times New Roman", serif` |
| [assets/template-giftcard.css:59](<D:/All project/Shopify-theme/assets/template-giftcard.css:59>) | `var(--font-paragraph--family)` |

## Other text-related CSS properties

The color inventory can include non-text selectors. Custom typography tokens are counted separately from ordinary declarations.

| Property | Declarations | Files |
|---|---:|---:|
| `-webkit-font-smoothing` | 4 | 4 |
| `-webkit-line-clamp` | 12 | 9 |
| `color` | 778 | 121 |
| `font` | 13 | 11 |
| `font-family` | 148 | 53 |
| `font-size` | 674 | 87 |
| `font-style` | 33 | 18 |
| `font-weight` | 314 | 75 |
| `hyphens` | 1 | 1 |
| `letter-spacing` | 106 | 34 |
| `line-clamp` | 2 | 1 |
| `line-height` | 377 | 68 |
| `list-style` | 25 | 19 |
| `overflow-wrap` | 42 | 23 |
| `text-align` | 127 | 51 |
| `text-decoration` | 94 | 43 |
| `text-decoration-color` | 9 | 5 |
| `text-decoration-line` | 4 | 3 |
| `text-overflow` | 29 | 19 |
| `text-shadow` | 5 | 4 |
| `text-transform` | 81 | 34 |
| `text-underline-offset` | 9 | 9 |
| `text-wrap` | 13 | 8 |
| `vertical-align` | 7 | 5 |
| `white-space` | 63 | 35 |
| `word-break` | 6 | 5 |
| `writing-mode` | 1 | 1 |

## Complete text-related file index

Includes rendered source, shared/optional components and locally present unused components. Exact declarations: [TYPOGRAPHY-AUDIT-DETAILS.md](<D:/All project/Shopify-theme/TYPOGRAPHY-AUDIT-DETAILS.md>).

| File | HTML text tags | CSS properties | Typography tokens |
|---|---|---|---|
| [assets/base.css](<D:/All project/Shopify-theme/assets/base.css>) |  | -webkit-font-smoothing, color, font, font-family, font-size, font-style, font-weight, hyphens, letter-spacing, line-height, list-style, overflow-wrap, text-align, text-decoration, text-decoration-color, text-transform, text-underline-offset, text-wrap, vertical-align, word-break | 4 |
| [assets/cart-discount.js](<D:/All project/Shopify-theme/assets/cart-discount.js>) | input |  | 0 |
| [assets/component-quantity-selector.js](<D:/All project/Shopify-theme/assets/component-quantity-selector.js>) | input |  | 0 |
| [assets/header-menu.js](<D:/All project/Shopify-theme/assets/header-menu.js>) | li |  | 0 |
| [assets/overflow-list.css](<D:/All project/Shopify-theme/assets/overflow-list.css>) |  | -webkit-font-smoothing, color, font-family, font-size, list-style, text-align, text-transform | 0 |
| [assets/popover-polyfill.js](<D:/All project/Shopify-theme/assets/popover-polyfill.js>) |  | color | 0 |
| [assets/precious-page.css](<D:/All project/Shopify-theme/assets/precious-page.css>) |  | color, font-family, font-size, font-style, font-weight, letter-spacing, line-height, list-style, text-align, text-decoration, text-transform | 4 |
| [assets/qr-code-generator.js](<D:/All project/Shopify-theme/assets/qr-code-generator.js>) | i, td |  | 0 |
| [assets/template-giftcard.css](<D:/All project/Shopify-theme/assets/template-giftcard.css>) |  | color, font-family, font-size, font-style, font-weight, line-height, text-align | 0 |
| [assets/variant-picker.js](<D:/All project/Shopify-theme/assets/variant-picker.js>) | select |  | 0 |
| [blocks/_accordion-row.liquid](<D:/All project/Shopify-theme/blocks/_accordion-row.liquid>) | span, summary |  | 0 |
| [blocks/_announcement.liquid](<D:/All project/Shopify-theme/blocks/_announcement.liquid>) | a, p, span |  | 2 |
| [blocks/_blog-post-card.liquid](<D:/All project/Shopify-theme/blocks/_blog-post-card.liquid>) | a | color, text-align, text-decoration, text-wrap | 0 |
| [blocks/_blog-post-content.liquid](<D:/All project/Shopify-theme/blocks/_blog-post-content.liquid>) |  | color | 0 |
| [blocks/_blog-post-description.liquid](<D:/All project/Shopify-theme/blocks/_blog-post-description.liquid>) | a | color | 0 |
| [blocks/_blog-post-image.liquid](<D:/All project/Shopify-theme/blocks/_blog-post-image.liquid>) | a |  | 0 |
| [blocks/_blog-post-info-text.liquid](<D:/All project/Shopify-theme/blocks/_blog-post-info-text.liquid>) | span | color, font-size, text-overflow, white-space | 0 |
| [blocks/_blog-post-title.liquid](<D:/All project/Shopify-theme/blocks/_blog-post-title.liquid>) | h1 |  | 0 |
| [blocks/_card.liquid](<D:/All project/Shopify-theme/blocks/_card.liquid>) | a |  | 0 |
| [blocks/_cart-summary.liquid](<D:/All project/Shopify-theme/blocks/_cart-summary.liquid>) |  |  | 6 |
| [blocks/_cart-title.liquid](<D:/All project/Shopify-theme/blocks/_cart-title.liquid>) | h1 | color, font-family, font-size, font-weight | 0 |
| [blocks/_collection-link.liquid](<D:/All project/Shopify-theme/blocks/_collection-link.liquid>) | a, sup | color, font-size, font-weight, text-decoration, text-wrap, white-space | 4 |
| [blocks/_featured-blog-posts-card.liquid](<D:/All project/Shopify-theme/blocks/_featured-blog-posts-card.liquid>) | a, h4, span | text-align | 1 |
| [blocks/_featured-blog-posts-title.liquid](<D:/All project/Shopify-theme/blocks/_featured-blog-posts-title.liquid>) | h3 |  | 0 |
| [blocks/_featured-product-price.liquid](<D:/All project/Shopify-theme/blocks/_featured-product-price.liquid>) | span |  | 0 |
| [blocks/_header-logo.liquid](<D:/All project/Shopify-theme/blocks/_header-logo.liquid>) | a, span | color, font-family, font-size, font-style, font-weight, text-decoration | 3 |
| [blocks/_header-menu.liquid](<D:/All project/Shopify-theme/blocks/_header-menu.liquid>) | a, button, li, span, ul | color, font-family, font-size, font-style, font-weight, line-height, text-decoration, text-transform, white-space | 4 |
| [blocks/_hotspot-product.liquid](<D:/All project/Shopify-theme/blocks/_hotspot-product.liquid>) | a, button, h2 |  | 0 |
| [blocks/_inline-collection-title.liquid](<D:/All project/Shopify-theme/blocks/_inline-collection-title.liquid>) | span |  | 0 |
| [blocks/_inline-text.liquid](<D:/All project/Shopify-theme/blocks/_inline-text.liquid>) | span |  | 0 |
| [blocks/_marquee.liquid](<D:/All project/Shopify-theme/blocks/_marquee.liquid>) |  | white-space | 0 |
| [blocks/_product-card-gallery.liquid](<D:/All project/Shopify-theme/blocks/_product-card-gallery.liquid>) | button, h3 | color, font-size, font-weight, letter-spacing, line-height, text-transform | 3 |
| [blocks/_product-details.liquid](<D:/All project/Shopify-theme/blocks/_product-details.liquid>) | a, button, span | color, font, font-size, font-weight, line-height, text-decoration, white-space | 0 |
| [blocks/_product-list-text.liquid](<D:/All project/Shopify-theme/blocks/_product-list-text.liquid>) | h3 |  | 0 |
| [blocks/_search-input.liquid](<D:/All project/Shopify-theme/blocks/_search-input.liquid>) | a, input, label, p, span | color, text-overflow, vertical-align | 0 |
| [blocks/_social-link.liquid](<D:/All project/Shopify-theme/blocks/_social-link.liquid>) | a, span | color | 0 |
| [blocks/accordion.liquid](<D:/All project/Shopify-theme/blocks/accordion.liquid>) |  |  | 6 |
| [blocks/add-to-cart.liquid](<D:/All project/Shopify-theme/blocks/add-to-cart.liquid>) | span |  | 1 |
| [blocks/ai_gen_block_e5807af.liquid](<D:/All project/Shopify-theme/blocks/ai_gen_block_e5807af.liquid>) | a, h2, h3, p, span | color, font-family, font-size, font-weight, letter-spacing, line-height, text-align, text-decoration, text-transform, text-underline-offset | 0 |
| [blocks/buy-buttons.liquid](<D:/All project/Shopify-theme/blocks/buy-buttons.liquid>) | a, button, h2, h4, input, p, span | color, font, font-size, font-weight, line-height, text-align, text-decoration | 0 |
| [blocks/collection-title.liquid](<D:/All project/Shopify-theme/blocks/collection-title.liquid>) | p |  | 0 |
| [blocks/comparison-slider.liquid](<D:/All project/Shopify-theme/blocks/comparison-slider.liquid>) | input, span | color, writing-mode | 2 |
| [blocks/contact-form-submit-button.liquid](<D:/All project/Shopify-theme/blocks/contact-form-submit-button.liquid>) | button |  | 0 |
| [blocks/contact-form.liquid](<D:/All project/Shopify-theme/blocks/contact-form.liquid>) | button, input, label, span, strong, textarea | -webkit-font-smoothing, color, font-family, font-size, font-weight, letter-spacing, line-height, text-overflow | 0 |
| [blocks/disclosures.liquid](<D:/All project/Shopify-theme/blocks/disclosures.liquid>) | h2, h3, span, summary | color, font-weight, line-height, overflow-wrap, vertical-align, white-space | 0 |
| [blocks/email-signup.liquid](<D:/All project/Shopify-theme/blocks/email-signup.liquid>) | button, input, label, p, span | color, text-transform, white-space | 0 |
| [blocks/filters.liquid](<D:/All project/Shopify-theme/blocks/filters.liquid>) | button, h4, span | color, font-size, font-weight, line-height, text-decoration, text-decoration-color, text-transform, text-underline-offset, white-space | 1 |
| [blocks/footer-copyright.liquid](<D:/All project/Shopify-theme/blocks/footer-copyright.liquid>) | span | color | 0 |
| [blocks/footer-policy-list.liquid](<D:/All project/Shopify-theme/blocks/footer-policy-list.liquid>) | a, button, li, ul | color, font-size, text-align, text-transform | 0 |
| [blocks/gemstone-details.liquid](<D:/All project/Shopify-theme/blocks/gemstone-details.liquid>) | a, dd, dt, h3, li, p, span, summary, ul | color, font-size, font-weight, line-height, list-style, overflow-wrap, text-overflow, white-space | 0 |
| [blocks/icon.liquid](<D:/All project/Shopify-theme/blocks/icon.liquid>) | a | color | 0 |
| [blocks/image.liquid](<D:/All project/Shopify-theme/blocks/image.liquid>) | a |  | 0 |
| [blocks/logo.liquid](<D:/All project/Shopify-theme/blocks/logo.liquid>) |  | font-size | 0 |
| [blocks/menu.liquid](<D:/All project/Shopify-theme/blocks/menu.liquid>) | a, li, span, summary, ul |  | 0 |
| [blocks/page-content.liquid](<D:/All project/Shopify-theme/blocks/page-content.liquid>) |  | color | 0 |
| [blocks/page.liquid](<D:/All project/Shopify-theme/blocks/page.liquid>) | h2 |  | 0 |
| [blocks/payment-icons.liquid](<D:/All project/Shopify-theme/blocks/payment-icons.liquid>) | li, span, ul |  | 0 |
| [blocks/popup-link.liquid](<D:/All project/Shopify-theme/blocks/popup-link.liquid>) | button, h2 |  | 0 |
| [blocks/price.liquid](<D:/All project/Shopify-theme/blocks/price.liquid>) | input |  | 0 |
| [blocks/product-card-gemstone-summary.liquid](<D:/All project/Shopify-theme/blocks/product-card-gemstone-summary.liquid>) | p, span | color, font-size, font-weight, line-height, text-overflow, white-space | 0 |
| [blocks/product-custom-property.liquid](<D:/All project/Shopify-theme/blocks/product-custom-property.liquid>) | input, label, p, span, textarea | color, font-size, font-style | 0 |
| [blocks/product-inventory.liquid](<D:/All project/Shopify-theme/blocks/product-inventory.liquid>) | span | color, font-size, line-height | 0 |
| [blocks/product-title.liquid](<D:/All project/Shopify-theme/blocks/product-title.liquid>) | a, p |  | 0 |
| [blocks/review.liquid](<D:/All project/Shopify-theme/blocks/review.liquid>) | p, span | color, white-space | 0 |
| [blocks/social-links.liquid](<D:/All project/Shopify-theme/blocks/social-links.liquid>) | a, span |  | 0 |
| [layout/password.liquid](<D:/All project/Shopify-theme/layout/password.liquid>) | button, h2, input, label, span |  | 0 |
| [sections/about-raza-gems.liquid](<D:/All project/Shopify-theme/sections/about-raza-gems.liquid>) | a, blockquote, figcaption, h1, h2, h3, p, small, span, strong | color, font-family, font-size, font-style, font-weight, letter-spacing, line-height, overflow-wrap, text-align, text-decoration, text-transform, word-break | 0 |
| [sections/collection-hero.liquid](<D:/All project/Shopify-theme/sections/collection-hero.liquid>) | a, h1, li, span, ul | color, font-family, font-size, font-weight, letter-spacing, line-height, list-style, overflow-wrap, text-align, text-decoration, text-shadow, text-underline-offset | 1 |
| [sections/collection-links.liquid](<D:/All project/Shopify-theme/sections/collection-links.liquid>) |  | text-align | 0 |
| [sections/faq-page.liquid](<D:/All project/Shopify-theme/sections/faq-page.liquid>) | h1, h2, h3, p, span, summary | color, font-family, font-size, font-weight, letter-spacing, line-height, list-style, text-align | 1 |
| [sections/featured-product-information.liquid](<D:/All project/Shopify-theme/sections/featured-product-information.liquid>) | h2 |  | 0 |
| [sections/featured-product.liquid](<D:/All project/Shopify-theme/sections/featured-product.liquid>) | h2 |  | 0 |
| [sections/footer-utilities.liquid](<D:/All project/Shopify-theme/sections/footer-utilities.liquid>) |  | color, text-align, text-wrap | 0 |
| [sections/footer.liquid](<D:/All project/Shopify-theme/sections/footer.liquid>) |  | font-weight | 0 |
| [sections/gemstone-collection-slider.liquid](<D:/All project/Shopify-theme/sections/gemstone-collection-slider.liquid>) | a, h2, p, span | color, font-family, font-size, font-weight, line-height, overflow-wrap, text-align, text-decoration, text-underline-offset | 0 |
| [sections/gemstone-editorial-home.liquid](<D:/All project/Shopify-theme/sections/gemstone-editorial-home.liquid>) | a, button, h1, h2, h3, input, label, p, span, time | -webkit-line-clamp, color, font, font-family, font-size, font-weight, letter-spacing, line-height, text-align, text-decoration, text-overflow, text-transform, text-underline-offset, text-wrap, white-space | 0 |
| [sections/gemstone-landing.liquid](<D:/All project/Shopify-theme/sections/gemstone-landing.liquid>) | a, h1, h2, p, span | color, font-family, font-size, font-weight, letter-spacing, line-height, overflow-wrap, text-align, text-decoration, text-transform | 0 |
| [sections/header-announcements.liquid](<D:/All project/Shopify-theme/sections/header-announcements.liquid>) |  | color | 0 |
| [sections/header.liquid](<D:/All project/Shopify-theme/sections/header.liquid>) | button, h1, span | color, font-family, font-size, font-weight | 15 |
| [sections/hero.liquid](<D:/All project/Shopify-theme/sections/hero.liquid>) | a, button, h1, p, span | color, font-family, font-size, font-weight, letter-spacing, line-height, text-align, text-decoration, text-shadow, white-space | 2 |
| [sections/home-second-banner.liquid](<D:/All project/Shopify-theme/sections/home-second-banner.liquid>) | a, h2, li, p, span, ul | color, font-family, font-size, font-weight, letter-spacing, line-height, list-style, overflow-wrap, text-decoration, text-shadow | 0 |
| [sections/jewellery-listing-page.liquid](<D:/All project/Shopify-theme/sections/jewellery-listing-page.liquid>) | a, button, h1, h2, h3, input, label, p, select, span, strong | -webkit-line-clamp, color, font, font-size, font-weight, line-height, overflow-wrap, text-decoration, text-overflow, white-space | 0 |
| [sections/layered-slideshow.liquid](<D:/All project/Shopify-theme/sections/layered-slideshow.liquid>) | button, h2 |  | 0 |
| [sections/logo.liquid](<D:/All project/Shopify-theme/sections/logo.liquid>) |  | font-size | 0 |
| [sections/main-blog-post.liquid](<D:/All project/Shopify-theme/sections/main-blog-post.liquid>) | a, button, h2, ol, small, span, strong | color, font-family, font-size, font-weight, letter-spacing, line-height, list-style, text-decoration, text-transform | 0 |
| [sections/main-cart.liquid](<D:/All project/Shopify-theme/sections/main-cart.liquid>) |  | text-align | 0 |
| [sections/main-collection.liquid](<D:/All project/Shopify-theme/sections/main-collection.liquid>) | li | color, font-family, font-size, font-weight, line-height | 0 |
| [sections/main-page.liquid](<D:/All project/Shopify-theme/sections/main-page.liquid>) | a, h1, h2, h3, li, p, span, strong, ul | color, font-family, font-size, font-weight, letter-spacing, line-height, text-align, text-decoration, text-transform, vertical-align | 0 |
| [sections/marquee.liquid](<D:/All project/Shopify-theme/sections/marquee.liquid>) |  | white-space | 0 |
| [sections/password-footer.liquid](<D:/All project/Shopify-theme/sections/password-footer.liquid>) | a, button, li, p, ul | color, text-decoration | 0 |
| [sections/password.liquid](<D:/All project/Shopify-theme/sections/password.liquid>) |  | text-align | 0 |
| [sections/payment-methods.liquid](<D:/All project/Shopify-theme/sections/payment-methods.liquid>) | h1, h2, h3, small, span, strong | color, font-family, font-size, font-style, font-weight, letter-spacing, line-height, text-align, text-shadow | 1 |
| [sections/precious-faq.liquid](<D:/All project/Shopify-theme/sections/precious-faq.liquid>) | h2, p, span, summary |  | 0 |
| [sections/precious-gemstone-types.liquid](<D:/All project/Shopify-theme/sections/precious-gemstone-types.liquid>) | a, h2, p, span |  | 0 |
| [sections/precious-global-sourcing.liquid](<D:/All project/Shopify-theme/sections/precious-global-sourcing.liquid>) | h2, h3, li, p, ul |  | 0 |
| [sections/precious-hero.liquid](<D:/All project/Shopify-theme/sections/precious-hero.liquid>) | a, h1, p, small, span |  | 0 |
| [sections/precious-promo-cards.liquid](<D:/All project/Shopify-theme/sections/precious-promo-cards.liquid>) | a, em, small, span, strong |  | 0 |
| [sections/precious-story.liquid](<D:/All project/Shopify-theme/sections/precious-story.liquid>) | h2, p, span, strong |  | 0 |
| [sections/precious-value-cards.liquid](<D:/All project/Shopify-theme/sections/precious-value-cards.liquid>) | h3, p, span |  | 0 |
| [sections/predictive-search.liquid](<D:/All project/Shopify-theme/sections/predictive-search.liquid>) | a, li, p, span, ul |  | 0 |
| [sections/privacy-policy.liquid](<D:/All project/Shopify-theme/sections/privacy-policy.liquid>) | h1, h2, p, span | color, font-family, font-size, font-weight, letter-spacing, line-height, text-underline-offset | 0 |
| [sections/product-hotspots.liquid](<D:/All project/Shopify-theme/sections/product-hotspots.liquid>) |  | color, font, font-size, letter-spacing, text-transform | 0 |
| [sections/product-information.liquid](<D:/All project/Shopify-theme/sections/product-information.liquid>) | a, button, p, span | color, font-size, font-weight, line-height, text-decoration, text-overflow, white-space | 0 |
| [sections/quick-order-list.liquid](<D:/All project/Shopify-theme/sections/quick-order-list.liquid>) | a, button, dd, dt, p, s, span | color, font-size, font-weight, letter-spacing, line-height, text-align, white-space | 0 |
| [sections/raza-gems-footer.liquid](<D:/All project/Shopify-theme/sections/raza-gems-footer.liquid>) | a, button, h2, input, p, span | color, font, font-family, font-size, font-weight, line-height, text-align, text-decoration, white-space | 1 |
| [sections/related-shape-collections.liquid](<D:/All project/Shopify-theme/sections/related-shape-collections.liquid>) | a, h2, p, span | color, font-family, font-size, font-weight, line-height, overflow-wrap, text-align, text-decoration | 0 |
| [sections/return-exchange-policy.liquid](<D:/All project/Shopify-theme/sections/return-exchange-policy.liquid>) | a, h1, h2, p, span | color, font-family, font-size, font-weight, letter-spacing, line-height, list-style, overflow-wrap, text-align, text-decoration, text-transform | 0 |
| [sections/sales.liquid](<D:/All project/Shopify-theme/sections/sales.liquid>) | button, em, h1, h2, input, label, p, select, span, summary | color, font, font-family, font-size, font-style, font-weight, letter-spacing, line-height, text-align, text-transform, white-space | 0 |
| [sections/search-header.liquid](<D:/All project/Shopify-theme/sections/search-header.liquid>) | a, h1, p, span | color, font-family, font-size, line-height, overflow-wrap, text-decoration | 0 |
| [sections/section-rendering-product-card.liquid](<D:/All project/Shopify-theme/sections/section-rendering-product-card.liquid>) | a |  | 0 |
| [sections/semi-precious-category.liquid](<D:/All project/Shopify-theme/sections/semi-precious-category.liquid>) | h2, p |  | 0 |
| [sections/slideshow.liquid](<D:/All project/Shopify-theme/sections/slideshow.liquid>) | h2 |  | 0 |
| [sections/Support-middle.liquid](<D:/All project/Shopify-theme/sections/Support-middle.liquid>) | a, h2, h3, li, p, span, ul | color, font-family, font-size, font-weight, letter-spacing, line-height, list-style, overflow-wrap, text-align, text-decoration, text-transform | 0 |
| [sections/Support-top.liquid](<D:/All project/Shopify-theme/sections/Support-top.liquid>) | h1 | color, font-family, font-size, font-weight, letter-spacing, line-height | 0 |
| [sections/terms-condition-page.liquid](<D:/All project/Shopify-theme/sections/terms-condition-page.liquid>) | h1, h2, p, span | color, font-family, font-size, font-weight, letter-spacing, line-height, text-align, text-transform | 0 |
| [sections/trust-benefits.liquid](<D:/All project/Shopify-theme/sections/trust-benefits.liquid>) | span | color, font-family, font-size, font-weight, line-height, overflow-wrap | 0 |
| [snippets/accordion-styles.liquid](<D:/All project/Shopify-theme/snippets/accordion-styles.liquid>) |  | font-family, font-size, font-style, font-weight, line-height, text-transform | 0 |
| [snippets/add-to-cart-button-styles.liquid](<D:/All project/Shopify-theme/snippets/add-to-cart-button-styles.liquid>) |  | color | 1 |
| [snippets/add-to-cart-button.liquid](<D:/All project/Shopify-theme/snippets/add-to-cart-button.liquid>) | button, span |  | 0 |
| [snippets/blog-comment-form.liquid](<D:/All project/Shopify-theme/snippets/blog-comment-form.liquid>) | button, h2, input, label, li, p, span, textarea, ul | font-size | 0 |
| [snippets/button-custom-styles.liquid](<D:/All project/Shopify-theme/snippets/button-custom-styles.liquid>) |  | color | 0 |
| [snippets/button.liquid](<D:/All project/Shopify-theme/snippets/button.liquid>) | a |  | 0 |
| [snippets/buy-buttons-styles.liquid](<D:/All project/Shopify-theme/snippets/buy-buttons-styles.liquid>) |  | color, font-family, font-size, font-style, font-weight, line-height, text-align, text-transform, white-space | 0 |
| [snippets/card-gallery.liquid](<D:/All project/Shopify-theme/snippets/card-gallery.liquid>) | a, span | -webkit-line-clamp, color, font-size, line-clamp, line-height, word-break | 0 |
| [snippets/cart-bubble.liquid](<D:/All project/Shopify-theme/snippets/cart-bubble.liquid>) | span | color, font-size, line-height | 1 |
| [snippets/cart-disclosure-tooltip.liquid](<D:/All project/Shopify-theme/snippets/cart-disclosure-tooltip.liquid>) | button, h2, h3, li, p, span, ul | color, font-size, font-weight, line-height, overflow-wrap | 0 |
| [snippets/cart-drawer.liquid](<D:/All project/Shopify-theme/snippets/cart-drawer.liquid>) | button, h2, span | line-height, text-align | 1 |
| [snippets/cart-products.liquid](<D:/All project/Shopify-theme/snippets/cart-products.liquid>) | a, button, caption, dd, dt, li, p, s, small, span, td, th, ul | color, font-size, font-weight, line-height, overflow-wrap, text-align, text-decoration, text-transform | 0 |
| [snippets/cart-summary.liquid](<D:/All project/Shopify-theme/snippets/cart-summary.liquid>) | button, input, label, li, p, small, span, summary, textarea, ul | color, font-size, font-weight, list-style, text-decoration-color, text-decoration-line, text-overflow, text-transform, white-space | 0 |
| [snippets/cart-typography-styles.liquid](<D:/All project/Shopify-theme/snippets/cart-typography-styles.liquid>) |  | font-family, font-style, font-weight | 0 |
| [snippets/checkbox-styles.liquid](<D:/All project/Shopify-theme/snippets/checkbox-styles.liquid>) |  | color, line-height, text-overflow, white-space | 0 |
| [snippets/checkbox.liquid](<D:/All project/Shopify-theme/snippets/checkbox.liquid>) | input, label, span |  | 0 |
| [snippets/collection-card.liquid](<D:/All project/Shopify-theme/snippets/collection-card.liquid>) | a, span |  | 0 |
| [snippets/color-palette.liquid](<D:/All project/Shopify-theme/snippets/color-palette.liquid>) |  | color | 13 |
| [snippets/contrast-override.liquid](<D:/All project/Shopify-theme/snippets/contrast-override.liquid>) |  | color | 2 |
| [snippets/deferred-media-product-model-styles.liquid](<D:/All project/Shopify-theme/snippets/deferred-media-product-model-styles.liquid>) |  | color | 0 |
| [snippets/deferred-media-video-styles.liquid](<D:/All project/Shopify-theme/snippets/deferred-media-video-styles.liquid>) |  | color | 0 |
| [snippets/divider.liquid](<D:/All project/Shopify-theme/snippets/divider.liquid>) | span |  | 0 |
| [snippets/filter-remove-buttons.liquid](<D:/All project/Shopify-theme/snippets/filter-remove-buttons.liquid>) | button, h3, span |  | 0 |
| [snippets/gemstone-blog-listing.liquid](<D:/All project/Shopify-theme/snippets/gemstone-blog-listing.liquid>) | a, button, h1, h2, input, label, p, span | -webkit-line-clamp, color, font-family, font-size, font-weight, letter-spacing, line-height, overflow-wrap, text-align, text-decoration, text-transform, white-space | 0 |
| [snippets/gemstone-landing-fallback.liquid](<D:/All project/Shopify-theme/snippets/gemstone-landing-fallback.liquid>) | a, h1, h2, p, span | color, font-family, font-size, font-weight, letter-spacing, line-height, overflow-wrap, text-align, text-decoration, text-transform | 0 |
| [snippets/gemstone-landing-item.liquid](<D:/All project/Shopify-theme/snippets/gemstone-landing-item.liquid>) | span |  | 0 |
| [snippets/gemstone-specifications-panel.liquid](<D:/All project/Shopify-theme/snippets/gemstone-specifications-panel.liquid>) | a, button, dd, dt, h2, li, p, span, ul | color, font-family, font-size, font-weight, line-height, list-style, overflow-wrap, text-align, text-decoration, white-space | 0 |
| [snippets/gift-card-recipient-button-custom-styles.liquid](<D:/All project/Shopify-theme/snippets/gift-card-recipient-button-custom-styles.liquid>) |  |  | 4 |
| [snippets/gift-card-recipient-form-styles.liquid](<D:/All project/Shopify-theme/snippets/gift-card-recipient-form-styles.liquid>) |  | color, font-size, font-style, text-align | 0 |
| [snippets/gift-card-recipient-form.liquid](<D:/All project/Shopify-theme/snippets/gift-card-recipient-form.liquid>) | input, label, legend, span, textarea |  | 0 |
| [snippets/grid-density-controls.liquid](<D:/All project/Shopify-theme/snippets/grid-density-controls.liquid>) | input, label, legend, span | color | 0 |
| [snippets/group.liquid](<D:/All project/Shopify-theme/snippets/group.liquid>) | a |  | 0 |
| [snippets/header-actions.liquid](<D:/All project/Shopify-theme/snippets/header-actions.liquid>) | a, button, span | -webkit-font-smoothing, color, font-family, font-size, font-weight, line-height, text-transform | 8 |
| [snippets/header-drawer.liquid](<D:/All project/Shopify-theme/snippets/header-drawer.liquid>) | a, button, i, li, span, summary, ul | color, font-family, font-size, font-style, font-weight, letter-spacing, line-height, list-style, overflow-wrap, text-align, text-decoration, text-overflow, text-transform, white-space | 5 |
| [snippets/input-custom-styles.liquid](<D:/All project/Shopify-theme/snippets/input-custom-styles.liquid>) |  |  | 2 |
| [snippets/jumbo-text.liquid](<D:/All project/Shopify-theme/snippets/jumbo-text.liquid>) | span | color, font-family, font-style, font-weight, letter-spacing, line-height, text-align, text-transform, white-space | 7 |
| [snippets/list-filter.liquid](<D:/All project/Shopify-theme/snippets/list-filter.liquid>) | button, input, label, li, span, summary, ul | color, font-family, font-size, font-weight, text-align, text-overflow, white-space, word-break | 1 |
| [snippets/localization-form.liquid](<D:/All project/Shopify-theme/snippets/localization-form.liquid>) | button, h2, input, label, li, select, span, ul | color, font-size, font-weight, line-height, text-align, text-decoration-color, text-overflow, text-underline-offset, white-space | 0 |
| [snippets/media.liquid](<D:/All project/Shopify-theme/snippets/media.liquid>) | a |  | 0 |
| [snippets/mega-menu-icon-link-content.liquid](<D:/All project/Shopify-theme/snippets/mega-menu-icon-link-content.liquid>) | span |  | 0 |
| [snippets/mega-menu-list.liquid](<D:/All project/Shopify-theme/snippets/mega-menu-list.liquid>) | a, li, span, ul |  | 0 |
| [snippets/menu-font-styles.liquid](<D:/All project/Shopify-theme/snippets/menu-font-styles.liquid>) |  |  | 8 |
| [snippets/mobile-drawer-card-content.liquid](<D:/All project/Shopify-theme/snippets/mobile-drawer-card-content.liquid>) | i, span |  | 0 |
| [snippets/mobile-drawer-submenu-header.liquid](<D:/All project/Shopify-theme/snippets/mobile-drawer-submenu-header.liquid>) | a, button, i, span |  | 0 |
| [snippets/mobile-drawer-submenu-link-content.liquid](<D:/All project/Shopify-theme/snippets/mobile-drawer-submenu-link-content.liquid>) | i, span |  | 0 |
| [snippets/overflow-list.liquid](<D:/All project/Shopify-theme/snippets/overflow-list.liquid>) | button, li, ul |  | 0 |
| [snippets/pagination-controls.liquid](<D:/All project/Shopify-theme/snippets/pagination-controls.liquid>) | a, li, span, ul | color, font-size, font-weight, list-style, text-decoration | 0 |
| [snippets/payment-terms-styles.liquid](<D:/All project/Shopify-theme/snippets/payment-terms-styles.liquid>) |  | color, font-size, font-weight | 0 |
| [snippets/pills-styles.liquid](<D:/All project/Shopify-theme/snippets/pills-styles.liquid>) |  | color, font-size | 0 |
| [snippets/precious-page-fallback.liquid](<D:/All project/Shopify-theme/snippets/precious-page-fallback.liquid>) | a, em, h1, h2, h3, li, p, small, span, strong, summary, ul | -webkit-line-clamp, color, font-family, font-size, font-style, font-weight, letter-spacing, line-height, list-style, text-align, text-decoration, text-transform, text-underline-offset | 4 |
| [snippets/precious-type-item.liquid](<D:/All project/Shopify-theme/snippets/precious-type-item.liquid>) | span |  | 0 |
| [snippets/predictive-search-empty-state.liquid](<D:/All project/Shopify-theme/snippets/predictive-search-empty-state.liquid>) | p |  | 0 |
| [snippets/predictive-search-products-list.liquid](<D:/All project/Shopify-theme/snippets/predictive-search-products-list.liquid>) | button, h4, li, ul |  | 0 |
| [snippets/predictive-search-resource-carousel.liquid](<D:/All project/Shopify-theme/snippets/predictive-search-resource-carousel.liquid>) | h4 |  | 0 |
| [snippets/predictive-search-styles.liquid](<D:/All project/Shopify-theme/snippets/predictive-search-styles.liquid>) |  | color, font-size, font-weight, text-align, text-decoration, text-transform, white-space | 1 |
| [snippets/price-filter.liquid](<D:/All project/Shopify-theme/snippets/price-filter.liquid>) | input, label, span, summary | color, font-size, line-height, text-align, white-space | 0 |
| [snippets/price-styles.liquid](<D:/All project/Shopify-theme/snippets/price-styles.liquid>) |  | color, font-family, font-size, font-weight, letter-spacing, line-height, text-decoration-color, text-decoration-line, text-transform, white-space | 0 |
| [snippets/price.liquid](<D:/All project/Shopify-theme/snippets/price.liquid>) | small, span |  | 0 |
| [snippets/product-badges-styles.liquid](<D:/All project/Shopify-theme/snippets/product-badges-styles.liquid>) |  | color, font-family, font-size, font-weight, text-align, text-transform | 1 |
| [snippets/product-card-gallery-zoom-details-styles.liquid](<D:/All project/Shopify-theme/snippets/product-card-gallery-zoom-details-styles.liquid>) |  | font-family, font-size, font-weight, line-height | 0 |
| [snippets/product-card-styles.liquid](<D:/All project/Shopify-theme/snippets/product-card-styles.liquid>) |  | -webkit-line-clamp, color, text-decoration, text-overflow | 0 |
| [snippets/product-card.liquid](<D:/All project/Shopify-theme/snippets/product-card.liquid>) | a |  | 0 |
| [snippets/product-grid.liquid](<D:/All project/Shopify-theme/snippets/product-grid.liquid>) | h2, h4, p, span, ul | -webkit-line-clamp, list-style, text-align, text-overflow | 0 |
| [snippets/product-information-content.liquid](<D:/All project/Shopify-theme/snippets/product-information-content.liquid>) |  | color, font-weight, letter-spacing, line-height | 0 |
| [snippets/product-media-gallery-content.liquid](<D:/All project/Shopify-theme/snippets/product-media-gallery-content.liquid>) | button, li, span, ul | color | 0 |
| [snippets/product-media.liquid](<D:/All project/Shopify-theme/snippets/product-media.liquid>) | button, span |  | 0 |
| [snippets/quantity-selector-styles.liquid](<D:/All project/Shopify-theme/snippets/quantity-selector-styles.liquid>) |  | color, text-align | 0 |
| [snippets/quantity-selector.liquid](<D:/All project/Shopify-theme/snippets/quantity-selector.liquid>) | button, input, span | color, font-size, font-weight | 0 |
| [snippets/quick-add-modal-styles.liquid](<D:/All project/Shopify-theme/snippets/quick-add-modal-styles.liquid>) |  | -webkit-line-clamp, color, font-size, font-weight, line-height, text-align, text-decoration, text-overflow | 4 |
| [snippets/quick-add-modal.liquid](<D:/All project/Shopify-theme/snippets/quick-add-modal.liquid>) | button |  | 0 |
| [snippets/quick-add-styles.liquid](<D:/All project/Shopify-theme/snippets/quick-add-styles.liquid>) |  | color, white-space | 0 |
| [snippets/quick-add.liquid](<D:/All project/Shopify-theme/snippets/quick-add.liquid>) | button, input, span |  | 0 |
| [snippets/resource-card.liquid](<D:/All project/Shopify-theme/snippets/resource-card.liquid>) | a, p, span | -webkit-line-clamp, color, font-family, font-size, font-weight, letter-spacing, line-height, overflow-wrap, text-decoration, text-transform, word-break | 0 |
| [snippets/resource-list-styles.liquid](<D:/All project/Shopify-theme/snippets/resource-list-styles.liquid>) |  | color, text-decoration | 0 |
| [snippets/search-gemstone-results.liquid](<D:/All project/Shopify-theme/snippets/search-gemstone-results.liquid>) | button, input, label, li, p, select, summary, ul | color, font, font-family, font-size, font-weight, list-style, overflow-wrap, text-decoration | 0 |
| [snippets/search-modal.liquid](<D:/All project/Shopify-theme/snippets/search-modal.liquid>) | button, h2, input, label, span | color, font-size, text-overflow | 0 |
| [snippets/search.liquid](<D:/All project/Shopify-theme/snippets/search.liquid>) | button, span |  | 0 |
| [snippets/skip-to-content-link.liquid](<D:/All project/Shopify-theme/snippets/skip-to-content-link.liquid>) | a |  | 0 |
| [snippets/sku.liquid](<D:/All project/Shopify-theme/snippets/sku.liquid>) | span |  | 0 |
| [snippets/slideshow-arrow.liquid](<D:/All project/Shopify-theme/snippets/slideshow-arrow.liquid>) | button, span | color | 0 |
| [snippets/slideshow-arrows.liquid](<D:/All project/Shopify-theme/snippets/slideshow-arrows.liquid>) |  | color | 0 |
| [snippets/slideshow-controls.liquid](<D:/All project/Shopify-theme/snippets/slideshow-controls.liquid>) | button, li, ol, span | color, font-size, list-style | 0 |
| [snippets/sorting.liquid](<D:/All project/Shopify-theme/snippets/sorting.liquid>) | input, label, select, span, summary | color, font-size, font-weight, text-align | 0 |
| [snippets/stone-product-card.liquid](<D:/All project/Shopify-theme/snippets/stone-product-card.liquid>) | a, button, p, span | color, font-family, font-size, font-weight, letter-spacing, line-height, text-decoration, text-overflow, white-space | 0 |
| [snippets/stone-product-listing.liquid](<D:/All project/Shopify-theme/snippets/stone-product-listing.liquid>) | a, button, em, h2, h3, input, label, p, select, span, summary | color, font, font-family, font-size, font-style, font-weight, line-height, text-decoration, text-overflow, white-space | 0 |
| [snippets/submenu-font-styles.liquid](<D:/All project/Shopify-theme/snippets/submenu-font-styles.liquid>) |  |  | 28 |
| [snippets/swatch.liquid](<D:/All project/Shopify-theme/snippets/swatch.liquid>) | span |  | 0 |
| [snippets/tax-info.liquid](<D:/All project/Shopify-theme/snippets/tax-info.liquid>) | small |  | 0 |
| [snippets/text-block-styles.liquid](<D:/All project/Shopify-theme/snippets/text-block-styles.liquid>) |  | color, text-decoration-line, text-wrap | 0 |
| [snippets/text-component-shimmer-styles.liquid](<D:/All project/Shopify-theme/snippets/text-component-shimmer-styles.liquid>) |  | color, line-height | 1 |
| [snippets/text.liquid](<D:/All project/Shopify-theme/snippets/text.liquid>) |  | color, text-align, text-wrap | 10 |
| [snippets/theme-drawer-header.liquid](<D:/All project/Shopify-theme/snippets/theme-drawer-header.liquid>) | button, h2, span |  | 0 |
| [snippets/theme-drawer-styles.liquid](<D:/All project/Shopify-theme/snippets/theme-drawer-styles.liquid>) |  | color, font-family, font-size, font-weight, line-height | 0 |
| [snippets/theme-styles-variables.liquid](<D:/All project/Shopify-theme/snippets/theme-styles-variables.liquid>) |  |  | 76 |
| [snippets/typography-style.liquid](<D:/All project/Shopify-theme/snippets/typography-style.liquid>) |  |  | 12 |
| [snippets/unit-price.liquid](<D:/All project/Shopify-theme/snippets/unit-price.liquid>) | small, span |  | 0 |
| [snippets/variant-button-custom-styles.liquid](<D:/All project/Shopify-theme/snippets/variant-button-custom-styles.liquid>) |  |  | 6 |
| [snippets/variant-main-picker.liquid](<D:/All project/Shopify-theme/snippets/variant-main-picker.liquid>) | input, label, legend, select, span |  | 0 |
| [snippets/variant-picker-styles.liquid](<D:/All project/Shopify-theme/snippets/variant-picker-styles.liquid>) |  | color, text-align, text-wrap, white-space | 0 |
| [snippets/variant-swatches.liquid](<D:/All project/Shopify-theme/snippets/variant-swatches.liquid>) | button, input, label, li | color, line-height | 0 |
| [snippets/video-placeholder-styles.liquid](<D:/All project/Shopify-theme/snippets/video-placeholder-styles.liquid>) |  | color | 0 |
| [snippets/video.liquid](<D:/All project/Shopify-theme/snippets/video.liquid>) | button, span |  | 0 |
| [snippets/volume-pricing-info.liquid](<D:/All project/Shopify-theme/snippets/volume-pricing-info.liquid>) | button, span | color, font-size, font-weight | 0 |
| [snippets/wishlist-content.liquid](<D:/All project/Shopify-theme/snippets/wishlist-content.liquid>) | a, button, h1, h2, li, p, span, ul | color, font, font-family, font-size, font-weight, letter-spacing, line-height, list-style, overflow-wrap, text-align, text-decoration | 0 |
| [templates/404.json](<D:/All project/Shopify-theme/templates/404.json>) | h1, p |  | 0 |
| [templates/article.json](<D:/All project/Shopify-theme/templates/article.json>) | h1 |  | 0 |
| [templates/blog.json](<D:/All project/Shopify-theme/templates/blog.json>) | h1 |  | 0 |
| [templates/cart.json](<D:/All project/Shopify-theme/templates/cart.json>) | h3 |  | 0 |
| [templates/collection.jewellery.json](<D:/All project/Shopify-theme/templates/collection.jewellery.json>) | h1 |  | 0 |
| [templates/gift_card.liquid](<D:/All project/Shopify-theme/templates/gift_card.liquid>) | a, button, h1, h2, h3, p, span |  | 0 |
| [templates/list-collections.json](<D:/All project/Shopify-theme/templates/list-collections.json>) | h1 |  | 0 |
| [templates/page.about.json](<D:/All project/Shopify-theme/templates/page.about.json>) | em, li, p, ul |  | 0 |
| [templates/page.contact.json](<D:/All project/Shopify-theme/templates/page.contact.json>) | h1 |  | 0 |
| [templates/page.faq.json](<D:/All project/Shopify-theme/templates/page.faq.json>) | p |  | 0 |
| [templates/page.json](<D:/All project/Shopify-theme/templates/page.json>) | h1, p |  | 0 |
| [templates/page.privacy-policy.json](<D:/All project/Shopify-theme/templates/page.privacy-policy.json>) | p, strong |  | 0 |
| [templates/page.return.json](<D:/All project/Shopify-theme/templates/page.return.json>) | li, ol, p, strong, ul |  | 0 |
| [templates/page.support.json](<D:/All project/Shopify-theme/templates/page.support.json>) | h1, h2, p, span, strong | color, font-family, font-size, font-style, font-weight, letter-spacing, line-height, text-transform, vertical-align | 0 |
| [templates/page.term-condition.json](<D:/All project/Shopify-theme/templates/page.term-condition.json>) | li, p, strong, ul |  | 0 |
| [templates/password.json](<D:/All project/Shopify-theme/templates/password.json>) | h1, p |  | 0 |
| [templates/product.json](<D:/All project/Shopify-theme/templates/product.json>) | h1, h3 |  | 0 |

## Browser spot-check evidence

URL: http://127.0.0.1:9292/search?q=red&type=product ; viewport: 1440px.

| Sample | Computed family | Size | Weight |
|---|---|---|---|
| main h1 | Jost, sans-serif | 43.2px | 700 |
| main p | Jost, sans-serif | 14px | 400 |
| header nav a | Inter, sans-serif | 14px | 700 |

Chrome CSS.getPlatformFontsForNode(main h1): Arial / Arial-BoldMT / customFont=false.

This spot-check verifies the font override/fallback finding, not every possible merchant content and settings combination.

## Limits

- Shop-admin rich text, metafields, external apps, checkout and customer-account UI are not fully stored in this theme.
- Source tag counts do not establish one H1 per rendered URL or accessible heading order. That needs a separate rendered-page audit.
- Font tokens, cascade priority, actual font loading and browser fallback together determine rendered glyphs.
- No runtime theme files were edited for this audit.
