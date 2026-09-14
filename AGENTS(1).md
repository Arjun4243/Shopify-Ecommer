# AGENTS.md — Shopify Theme Project Rules for Codex

## Project Context

This repository is a Shopify theme project for a gemstone and jewellery e-commerce website.

Main areas currently being developed include:
- Precious Gemstones
- Semi-Precious Gemstones
- Jewellery
- Mega menu / mobile navigation
- Gemstone landing pages
- Product and collection layouts
- Filters and sorting
- Gemstone product information
- Custom jewellery UI
- Cart functionality (only when explicitly requested)

The project is edited locally in VS Code and synced with Shopify using Shopify CLI.

---

## Primary Goal

Work efficiently and use as little unnecessary context/tokens as possible.

Do NOT scan, read, search, or analyze the entire repository unless the task genuinely requires it.

Always start from the smallest possible set of files.

---

## 1. Minimal File Inspection

Before making changes:

1. Identify the exact component, section, snippet, template, asset, or stylesheet involved.
2. Open only the files directly related to the requested change.
3. Do not recursively inspect folders without a clear reason.
4. Do not read unrelated files just to understand the whole project.
5. If one file is enough to solve the task, do not inspect additional files.

Preferred workflow:

Request
→ Find exact selector/component/file
→ Read relevant section only
→ Make focused change
→ Verify change

Avoid:

Request
→ Scan entire repository
→ Read all sections/snippets/assets
→ Build unnecessary project-wide understanding
→ Make small change

---

## 2. Files/Folders to Avoid Unless Required

Do not inspect these unless the task specifically depends on them:

- node_modules/
- .git/
- package-lock.json
- yarn.lock
- pnpm-lock.yaml
- large generated files
- minified JavaScript files
- minified CSS files
- source maps
- cache files
- temporary files
- build output
- unrelated images
- unrelated SVG files
- all locale files
- all templates
- all sections
- all snippets

Do not analyze every image in `assets/`.

If an exact asset filename is already known, use that filename directly.

---

## 3. Shopify Theme File Priority

When locating code, use this order.

### Page / template issue
Check:
1. templates/
2. sections/ referenced by that template
3. snippets/ rendered by that section
4. related CSS/JS only if necessary

### Header / navigation / mega menu issue
Check:
1. sections/header*.liquid
2. snippets related to header/menu/drawer/mega-menu
3. relevant header CSS
4. relevant header JS only if behaviour requires it

### Mobile drawer issue
Search only for likely identifiers such as:
- menu-drawer
- header-drawer
- Details-menu-drawer-container
- drawer
- submenu
- mobile-menu

Do not inspect all navigation files at once.

### Gemstone landing item
If the code contains:

```liquid
{% render 'gemstone-landing-item' %}
```

inspect:

```text
snippets/gemstone-landing-item.liquid
```

before searching elsewhere.

### Styling issue
Use the exact class or ID from the browser inspector and search for it directly.

Example:

```text
.menu-drawer__close-button
```

Search that selector first.

Do not open every CSS file manually.

---

## 4. Search Before Reading Large Files

Use targeted search for:
- exact class
- exact ID
- snippet name
- section name
- Liquid variable
- visible text
- schema setting ID

Examples:

```text
menu-drawer__close-button
Details-menu-drawer-container
gemstone-landing-item
mega-menu__link-icon
```

If a match is found, inspect only the surrounding relevant block first.

Do not read a 2,000-line file from top to bottom when the required block is already known.

---

## 5. Do Not Perform Unnecessary Project-Wide Searches

Never run broad searches such as:
- search every file for "button"
- search every file for "image"
- inspect all CSS
- inspect all Liquid templates
- inspect all JavaScript
- inspect entire repository structure repeatedly

Use narrow searches.

If the user gives:
- a class → search the class
- an ID → search the ID
- a filename → open that file
- a snippet name → open that snippet
- a section name → open that section

---

## 6. Reuse Existing Project Code

Before creating a new component, check whether the current file already contains a reusable pattern.

Prefer:
- extending existing snippets
- reusing existing classes
- reusing existing theme variables
- reusing existing Shopify settings

Avoid:
- duplicate components
- duplicate CSS blocks
- duplicate JavaScript handlers
- duplicate markup

However, do not scan the whole project looking for reusable code. Search only likely names or the relevant folder.

---

## 7. Keep Changes Local and Focused

Do not refactor unrelated code.

Do not rename existing classes, IDs, snippets, sections, variables, or schema settings unless required.

Do not format entire files because of one small edit.

Do not reorder unrelated code.

Do not remove code unless:
- explicitly requested, or
- clearly confirmed as dead code related to the requested task.

Preserve existing Shopify functionality.

---

## 8. Shopify Liquid Rules

Follow valid Shopify Liquid syntax.

Prefer:

```liquid
{% render 'snippet-name', variable: value %}
```

over deprecated patterns.

When using assets:

```liquid
{{ 'filename.webp' | asset_url }}
```

When using Shopify images, prefer Shopify image filters where appropriate.

Do not hardcode store-specific URLs when Shopify objects or routes are available.

Do not unnecessarily duplicate menu content in Liquid if it already comes from Shopify navigation.

---

## 9. CSS Rules

Before adding CSS:

1. Search for the exact selector.
2. Check whether the selector already has styles.
3. Modify the existing block when safe.
4. Add a new override only when necessary.

Avoid:
- excessive `!important`
- duplicate media queries
- duplicate selectors
- unnecessary fixed heights
- unnecessary absolute positioning
- global selectors that may affect unrelated components

For mobile changes, keep changes inside appropriate breakpoints whenever possible.

Example:

```css
@media screen and (max-width: 749px) {
  /* mobile-only styles */
}
```

Do not modify desktop styles when the request is mobile-only.

---

## 10. JavaScript Rules

Do not edit JavaScript if CSS/Liquid alone can solve the task.

If JavaScript is required:
- inspect only the relevant event/component
- preserve existing Shopify theme events
- avoid adding global listeners unnecessarily
- avoid duplicate event handlers
- do not replace working theme behaviour without a reason

---

## 11. Images and Assets

Do not inspect all images.

If the user gives an exact image filename, use it directly.

Example:

```text
mega-menu-precious-diamond.webp
```

Do not search all `.webp`, `.png`, `.jpg`, or `.svg` files unless the asset name is unknown and finding it is necessary.

Do not rename assets unless requested.

---

## 12. Cart Work

Do not modify cart code unless the user explicitly asks for cart implementation or cart changes.

Planning/discussing cart UI does not authorize changing:
- cart drawer
- cart template
- cart JavaScript
- add-to-cart behaviour
- checkout-related code

When cart work is explicitly requested, first locate the existing cart implementation and extend it rather than rebuilding it blindly.

Likely names include:
- cart-drawer
- cart-items
- main-cart-items
- cart-notification
- product-form

---

## 13. Product / Gemstone Data

For gemstone specifications, prefer structured Shopify data such as metafields instead of hardcoding repeated values.

Possible fields:

```text
custom.carats
custom.shape
custom.color
custom.origin
custom.treatment
custom.certificate
custom.dimensions
```

Do not create new metafields in code unless the task explicitly requires it.

---

## 14. Filters

When implementing gemstone filters, keep naming consistent.

Preferred examples:

### Shape
- Round
- Oval
- Cushion
- Pear
- Emerald Cut
- Princess
- Marquise
- Heart
- Cabochon

### Color
- Red
- Pink
- Green
- Blue
- Yellow
- Orange
- Purple
- White
- Black
- Brown
- Multicolor

Avoid duplicate values caused by capitalization differences.

---

## 15. Do Not Invent Missing Requirements

If an important implementation detail is unclear:
- inspect the smallest relevant context first
- use the existing project pattern when obvious
- otherwise ask one focused question

Do not invent a new architecture for a small design change.

---

## 16. Token / Context Efficiency

Keep internal exploration concise.

Do not:
- paste entire large files into reasoning
- repeatedly summarize the repository
- reread unchanged files
- inspect files already confirmed irrelevant
- load large unrelated contexts

Remember findings from earlier steps in the same task and reuse them.

---

## 17. Commands

Before running commands, use the least invasive command possible.

Useful Shopify commands:

```bash
shopify theme dev
shopify theme pull
shopify theme list
shopify theme push
```

Do not run `shopify theme push --live` unless explicitly instructed to update the live theme.

Do not pull the entire live theme just to inspect one local file if the latest local code is already available.

Do not perform Git reset, clean, force push, destructive checkout, or overwrite operations without explicit approval.

---

## 18. Verification

After making a change:

1. Re-read only the changed block.
2. Check Liquid syntax if Liquid was edited.
3. Check selector scope if CSS was edited.
4. Check that no unrelated code changed.
5. Report exactly which files were changed.

Do not run broad project-wide verification unless necessary.

---

## 19. Response Style

When reporting work, be concise.

Use:

```text
Changed:
- snippets/example.liquid
- assets/example.css

What changed:
- Added gemstone icon rendering.
- Adjusted mobile spacing.

Not changed:
- Desktop navigation
- Cart
```

Do not produce long explanations unless requested.

---

## 20. Core Rule

Always follow this principle:

> Make the smallest correct change using the smallest necessary context.

If a task can be completed by reading one file and changing five lines, do not inspect ten files or refactor the theme.
