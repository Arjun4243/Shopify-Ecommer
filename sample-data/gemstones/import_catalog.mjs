/** Shopify Admin API 2026-10: local check, read-only preflight, then draft import.
 * Uses Node 22+ built-ins. Credentials stay in environment variables.
 * No theme code imports this utility or exposes its Admin token.
 */
import { readFile, writeFile, access } from 'node:fs/promises';
import { dirname, resolve, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '../..');
const catalog = JSON.parse(await readFile(resolve(here, 'catalog.json'), 'utf8'));
const mode = process.argv[2] || '--check';
const wait = (ms) => new Promise((done) => setTimeout(done, ms));

function requireValue(condition, message) {
  if (!condition) throw new Error(message);
}

async function checkLocal() {
  const handles = new Set();
  const records = new Map(catalog.products.map((product) => [product.handle, product]));
  const categoryFields = { Country: 'country_of_origin', certificate: 'certification_laboratory', Carat: 'carat_range', Color: 'color', Shape: 'shape' };
  const missingImages = [];
  for (const product of catalog.products) {
    requireValue(!handles.has(product.handle), `Duplicate handle: ${product.handle}`);
    handles.add(product.handle);
    requireValue(product.status === 'DRAFT', `Non-draft product: ${product.handle}`);
    for (const key of Object.keys(catalog.metafieldTypes)) {
      requireValue(product.metafields[key] !== undefined && product.metafields[key] !== '', `Missing ${key}: ${product.handle}`);
    }
    requireValue(Number(product.metafields.actual_carat_weight) > 0, `Invalid weight: ${product.handle}`);
    requireValue(Number(product.price) > 0, `Invalid sample price: ${product.handle}`);
    try {
      const bytes = await readFile(resolve(root, product.image.localPath));
      const isPng = bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
      const isJpeg = bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
      requireValue(isPng || isJpeg, `Invalid image: ${product.image.localPath}`);
      if (isPng) requireValue(bytes.readUInt32BE(16) >= 640 && bytes.readUInt32BE(20) >= 640, `Image too small: ${product.image.localPath}`);
      requireValue(bytes.length > 1000, `Incomplete image: ${product.image.localPath}`);
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
      missingImages.push(product.image.localPath);
    }
    await access(resolve(here, product.metafields.certificate_file));
  }
  for (const collection of catalog.collections) {
    requireValue(new Set(collection.productHandles).size >= 4, `Fewer than four products: ${collection.title}`);
    requireValue(collection.productHandles.every((handle) => handles.has(handle)), `Unknown product: ${collection.title}`);
    const field = categoryFields[collection.metafields.collection_group];
    requireValue(field && collection.productHandles.every((handle) => records.get(handle).metafields[field] === collection.title), `Incorrect category membership: ${collection.title}`);
  }
  console.log(`${handles.size} drafts; ${catalog.collections.length} category mappings; all 15 fields populated.`);
  requireValue(missingImages.length === 0, `Missing ${missingImages.length} generated image(s): ${missingImages.join(', ')}`);
  console.log('All product images and sample data sheets exist.');
}

await checkLocal();
if (mode === '--check') process.exit(0);
requireValue(['--preflight', '--import'].includes(mode), 'Use --check, --preflight or --import.');
const shop = process.env.SHOPIFY_STORE_DOMAIN || '';
requireValue(/^[a-z0-9][a-z0-9-]*\.myshopify\.com$/.test(shop), 'Set SHOPIFY_STORE_DOMAIN to your-store.myshopify.com.');
const token = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
requireValue(token, 'Set SHOPIFY_ADMIN_ACCESS_TOKEN locally; never put it in theme files.');
const endpoint = `https://${shop}/admin/api/2026-10/graphql.json`;

async function graphql(query, variables = {}) {
  const response = await fetch(endpoint, {
    method: 'POST', redirect: 'error', signal: AbortSignal.timeout(60000),
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
    body: JSON.stringify({ query, variables }),
  });
  requireValue(response.ok, `Admin API HTTP ${response.status}; operation stopped. Re-run to resume from journal.`);
  const body = await response.json();
  requireValue(!body.errors?.length, JSON.stringify(body.errors));
  const throttle = body.extensions?.cost?.throttleStatus;
  if (throttle && throttle.currentlyAvailable < 100) await wait(1500);
  return body.data;
}

function mutationResult(data, key) {
  const result = data[key];
  requireValue(result && !result.userErrors?.length, `${key}: ${JSON.stringify(result?.userErrors)}`);
  return result;
}

const shopInfo = await graphql('{ shop { name currencyCode } }');
console.log(`Target: ${shop} (${shopInfo.shop.name}); sample prices use ${shopInfo.shop.currencyCode}.`);
const definitions = new Map();
let after = null;
do {
  const data = await graphql(`query($after: String) {
    metafieldDefinitions(first: 100, after: $after, ownerType: PRODUCT, namespace: "custom") {
      nodes { key type { name } validations { name value } }
      pageInfo { hasNextPage endCursor }
    }
  }`, { after });
  for (const definition of data.metafieldDefinitions.nodes) definitions.set(definition.key, definition);
  after = data.metafieldDefinitions.pageInfo.hasNextPage ? data.metafieldDefinitions.pageInfo.endCursor : null;
} while (after);

function fieldInput(key, value) {
  const definition = definitions.get(key);
  const type = definition?.type.name || catalog.metafieldTypes[key];
  const baseType = type.replace(/^list\./, '');
  requireValue(['single_line_text_field', 'multi_line_text_field', 'number_decimal', 'number_integer', 'file_reference'].includes(baseType),
    `Unsupported existing definition custom.${key}: ${type}. Map it explicitly before importing.`);
  const choices = definition?.validations.find((rule) => rule.name === 'choices');
  if (choices) requireValue(JSON.parse(choices.value).includes(String(value)), `custom.${key} does not allow "${value}"; update catalog.json to an allowed demo value.`);
  if (baseType === 'number_decimal') requireValue(Number.isFinite(Number(value)), `custom.${key} requires a number.`);
  if (baseType === 'number_integer') requireValue(Number.isInteger(Number(value)), `custom.${key} requires an integer.`);
  return { namespace: 'custom', key, type, value: type.startsWith('list.') ? JSON.stringify([String(value)]) : String(value) };
}

for (const product of catalog.products) {
  for (const [key, value] of Object.entries(product.metafields)) {
    if (key === 'certificate_file') {
      const type = definitions.get(key)?.type.name || 'file_reference';
      requireValue(['file_reference', 'list.file_reference'].includes(type), `custom.certificate_file is ${type}; expected file reference.`);
    } else fieldInput(key, value);
  }
}
console.log('Existing product metafield types and allowed choices checked. API validation also runs during creation.');
const groupDefinitions = await graphql(`{
  metafieldDefinitions(first: 100, ownerType: COLLECTION, namespace: "custom") {
    nodes { key type { name } validations { name value } } pageInfo { hasNextPage }
  }
}`);
requireValue(!groupDefinitions.metafieldDefinitions.pageInfo.hasNextPage, 'More than 100 custom collection definitions; extend pagination before importing.');
const groupDefinition = groupDefinitions.metafieldDefinitions.nodes.find((definition) => definition.key === 'collection_group');
requireValue(!groupDefinition || groupDefinition.type.name === 'single_line_text_field', 'custom.collection_group must match this theme\'s single text value contract.');
function collectionGroupValue(group) {
  const rule = groupDefinition?.validations.find((validation) => validation.name === 'choices');
  if (!rule) return group;
  const value = JSON.parse(rule.value).find((choice) => choice.toLowerCase() === group.toLowerCase());
  requireValue(value, `Collection group "${group}" is not allowed by the existing definition.`);
  return value;
}
for (const collection of catalog.collections) collectionGroupValue(collection.metafields.collection_group);
if (mode === '--preflight') process.exit(0);

const journalPath = resolve(here, `import-state.${shop}.json`);
let journal;
try { journal = JSON.parse(await readFile(journalPath, 'utf8')); }
catch (error) { if (error.code !== 'ENOENT') throw error; journal = { shop, products: {}, files: {}, collections: {} }; }
requireValue(journal.shop === shop, 'Import journal belongs to another shop.');
async function save() {
  await writeFile(journalPath, `${JSON.stringify(journal, null, 2)}\n`, 'utf8');
}

async function upload(localPath, resource) {
  const bytes = await readFile(localPath);
  const mimeType = resource === 'FILE' ? 'text/plain' : localPath.toLowerCase().endsWith('.jpg') ? 'image/jpeg' : 'image/png';
  const data = await graphql(`mutation($input: [StagedUploadInput!]!) {
    stagedUploadsCreate(input: $input) { stagedTargets { url resourceUrl parameters { name value } } userErrors { field message } }
  }`, { input: [{ filename: basename(localPath), mimeType, resource, httpMethod: 'POST', fileSize: String(bytes.length) }] });
  const target = mutationResult(data, 'stagedUploadsCreate').stagedTargets[0];
  requireValue(target && new URL(target.url).protocol === 'https:', 'Invalid staged-upload target.');
  const form = new FormData();
  for (const parameter of target.parameters) form.append(parameter.name, parameter.value);
  form.append('file', new Blob([bytes], { type: mimeType }), basename(localPath));
  const response = await fetch(target.url, { method: 'POST', body: form, redirect: 'error', signal: AbortSignal.timeout(120000) });
  requireValue(response.ok, `Upload failed (${response.status}): ${basename(localPath)}`);
  return target.resourceUrl;
}

async function certificate(product) {
  if (journal.files[product.handle]) return journal.files[product.handle];
  const source = await upload(resolve(here, product.metafields.certificate_file), 'FILE');
  const data = await graphql(`mutation($files: [FileCreateInput!]!) {
    fileCreate(files: $files) { files { id fileStatus } userErrors { field message } }
  }`, { files: [{ originalSource: source, contentType: 'FILE', filename: `${product.sku}.txt`, alt: 'Sample data sheet - not a laboratory certificate' }] });
  const file = mutationResult(data, 'fileCreate').files[0];
  requireValue(file?.id, 'No uploaded sample file ID returned.');
  journal.files[product.handle] = file.id;
  await save();
  for (let attempt = 0; attempt < 30; attempt += 1) {
    const state = await graphql('query($id: ID!) { node(id: $id) { ... on GenericFile { id fileStatus } } }', { id: file.id });
    if (state.node?.fileStatus === 'READY') return file.id;
    requireValue(state.node?.fileStatus !== 'FAILED', `Sample file processing failed: ${product.sku}`);
    await wait(2000);
  }
  throw new Error(`Sample file processing is still pending: ${product.sku}. Re-run after processing finishes.`);
}

// Refuse collisions before creating/uploading anything. Only journal-owned drafts can resume.
for (const product of catalog.products) {
  const data = await graphql('query($q: String!) { products(first: 5, query: $q) { nodes { id handle status } } }', { q: `handle:${product.handle}` });
  const existing = data.products.nodes.find((item) => item.handle === product.handle);
  if (existing) requireValue(journal.products[product.handle]?.id === existing.id && existing.status === 'DRAFT',
    `Existing product collision or non-draft: ${product.handle}. This importer never overwrites merchant products.`);
  if (!existing) requireValue(!journal.products[product.handle], `Journal product was deleted: ${product.handle}. Review the journal before resuming.`);
}

for (const product of catalog.products) {
  if (journal.products[product.handle]?.complete) continue;
  let saved = journal.products[product.handle];
  if (!saved) {
    const certificateId = await certificate(product);
    const imageSource = await upload(resolve(root, product.image.localPath), 'IMAGE');
    const metafields = Object.entries(product.metafields).map(([key, value]) => fieldInput(key, key === 'certificate_file' ? certificateId : value));
    const data = await graphql(`mutation($product: ProductCreateInput!, $media: [CreateMediaInput!]) {
      productCreate(product: $product, media: $media) {
        product { id handle variants(first: 1) { nodes { id } } } userErrors { field message }
      }
    }`, { product: { title: product.title, handle: product.handle, descriptionHtml: product.descriptionHtml,
                    vendor: product.vendor, productType: product.productType, status: 'DRAFT', tags: product.tags, metafields },
         media: [{ originalSource: imageSource, mediaContentType: 'IMAGE', alt: product.image.alt }] });
    const created = mutationResult(data, 'productCreate').product;
    requireValue(created?.id && created.handle === product.handle, 'Product creation returned an unexpected identity.');
    saved = { id: created.id, variantId: created.variants.nodes[0].id, complete: false };
    journal.products[product.handle] = saved;
    await save();
  }
  const data = await graphql(`mutation($id: ID!, $variants: [ProductVariantsBulkInput!]!) {
    productVariantsBulkUpdate(productId: $id, variants: $variants) { productVariants { id } userErrors { field message } }
  }`, { id: saved.id, variants: [{ id: saved.variantId, price: product.price, inventoryPolicy: 'DENY', inventoryItem: { sku: product.sku, tracked: true } }] });
  mutationResult(data, 'productVariantsBulkUpdate');
  saved.complete = true;
  await save();
  console.log(`Draft ready: ${product.sku} ${product.handle}`);
}

// Separate demo collections; no existing merchant collection is overwritten or published.
for (const collection of catalog.collections) {
  if (journal.collections[collection.handle]) continue;
  const existing = await graphql('query($q: String!) { collections(first: 5, query: $q) { nodes { id handle } } }', { q: `handle:${collection.handle}` });
  requireValue(!existing.collections.nodes.some((item) => item.handle === collection.handle), `Collection collision: ${collection.handle}`);
  const imageSource = await upload(resolve(root, collection.imageLocalPath), 'COLLECTION_IMAGE');
  const data = await graphql(`mutation($input: CollectionInput!) {
    collectionCreate(input: $input) { collection { id handle } userErrors { field message } }
  }`, { input: { title: `[Sample] ${collection.title}`, handle: collection.handle,
                 descriptionHtml: collection.descriptionHtml, products: collection.productHandles.map((handle) => journal.products[handle].id),
                 image: { src: imageSource, alt: `Sample ${collection.title} gemstone category` },
                 metafields: [{ namespace: 'custom', key: 'collection_group', type: 'single_line_text_field', value: collectionGroupValue(collection.metafields.collection_group) }] } });
  journal.collections[collection.handle] = mutationResult(data, 'collectionCreate').collection.id;
  await save();
  console.log(`Demo collection ready: ${collection.title}`);
}

const verification = [];
for (const product of catalog.products) {
  const data = await graphql(`query($id: ID!) { product(id: $id) {
    id status metafields(first: 100, namespace: "custom") { nodes { key value } }
    media(first: 5) { nodes { status } } variants(first: 1) { nodes { price sku } }
  } }`, { id: journal.products[product.handle].id });
  const record = data.product;
  const fields = new Map(record?.metafields.nodes.map((field) => [field.key, field.value]));
  requireValue(record?.status === 'DRAFT', `Expected draft: ${product.handle}`);
  requireValue(Object.keys(catalog.metafieldTypes).every((key) => fields.has(key)), `Missing saved fields: ${product.handle}`);
  requireValue(record.variants.nodes[0].sku === product.sku && Number(record.variants.nodes[0].price) === Number(product.price), `Variant mismatch: ${product.handle}`);
  requireValue(record.media.nodes.length > 0 && !record.media.nodes.some((media) => media.status === 'FAILED'), `Missing or failed media: ${product.handle}`);
  verification.push({ handle: product.handle, id: record.id, status: record.status, mediaStatuses: record.media.nodes.map((media) => media.status) });
}
await writeFile(resolve(here, `import-verification.${shop}.json`), `${JSON.stringify(verification, null, 2)}\n`);
console.log('Saved 48 drafts with all fields and 50 demo collection mappings. Nothing was published.');
console.log('Check any PROCESSING media in Shopify before reviewing the drafts.');
