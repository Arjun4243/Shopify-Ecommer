"""Build a fictional draft catalog covering every category in the supplied lists.

Run from any directory with Python 3. No dependencies or store access required.
"""

from collections import Counter
from html import escape
import json
from pathlib import Path
import re

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
COUNTRIES = ['Mozambique', 'Burma', 'Africa', 'Afghanistan', 'Ethiopia', 'Italian', 'Thailand', 'Zambia', 'Sri Lanka', 'India', 'Russia']
LABS = ['GRA', 'Lotus', 'IGI', 'AIG', 'IDL', 'GRS', 'GIA', 'GGTL']
RANGES = ['0-1 Carat', '1-2 Carats', '2-3 Carats', '3-4 Carats', '4-5 Carats', '5-6 Carats', '6-10 Carats', '10+ Carats']
WEIGHTS = [0.72, 1.45, 2.35, 3.4, 4.55, 5.65, 8.2, 12.4]
COLORS = ['Red', 'Pink', 'Blue', 'Green', 'Yellow', 'Orange', 'Purple', 'White / Colorless', 'Black', 'Brown', 'Multi-Color']
STONES = ['Ruby', 'Pink Sapphire', 'Blue Sapphire', 'Emerald', 'Citrine', 'Spessartine Garnet', 'Amethyst', 'Rock Crystal Quartz', 'Black Spinel', 'Smoky Quartz', 'Bi-Color Tourmaline']
GROUPS = ['Precious', 'Precious', 'Precious', 'Precious', 'Semi Precious', 'Semi Precious', 'Semi Precious', 'Semi Precious', 'Semi Precious', 'Semi Precious', 'Semi Precious']
SHAPES = ['Round', 'Oval', 'Emerald', 'Pear', 'Heart', 'Trilliant', 'Asscher', 'Princess', 'Marquise', 'Cushion', 'Cabochon', 'Baguette']
SILHOUETTES = [
    'perfect circular silhouette and brilliant triangular facets',
    'elongated elliptical silhouette with rounded ends and brilliant facets',
    'rectangular step-cut outline with four clipped corners and parallel steps',
    'teardrop outline with one sharp point and a rounded opposite end',
    'clear symmetrical heart outline, two rounded lobes, a distinct central cleft and bottom point',
    'triangular outline with three equal sides and three gently rounded corners',
    'square step-cut outline with deeply clipped corners and concentric square steps',
    'square outline with four sharp corners and brilliant triangular facets',
    'elongated boat-shaped outline, two sharp tips and curved sides',
    'rounded square cushion outline with soft corners and brilliant facets',
    'smooth polished oval dome, glossy curved surface, absolutely no facets',
    'long narrow rectangular outline, straight corners and parallel step-cut facets',
]
TYPES = {
    'certificate_file': 'file_reference', 'certificate_number': 'single_line_text_field',
    'certification_laboratory': 'single_line_text_field', 'certification_status': 'single_line_text_field',
    'treatment': 'single_line_text_field', 'country_of_origin': 'single_line_text_field',
    'dimensions': 'single_line_text_field', 'carat_range': 'single_line_text_field',
    'actual_carat_weight': 'number_decimal', 'color': 'single_line_text_field',
    'cut': 'single_line_text_field', 'shape': 'single_line_text_field',
    'gemstone_type': 'single_line_text_field', 'gemstone_group': 'single_line_text_field',
    'disclosures': 'multi_line_text_field',
}


def slug(value):
    return re.sub(r'[^a-z0-9]+', '-', value.lower()).strip('-')


def write_preview(products, categories):
    filters = ''.join(
        f'<label>{escape(group)}<select data-field="{field}"><option value="">All</option>'
        + ''.join(f'<option>{escape(value)}</option>' for value in values)
        + '</select></label>' for group, (field, values) in categories.items()
    )
    cards = []
    for product in products:
        fields = product['metafields']
        attributes = ' '.join(f'data-{field.replace("_", "-")}="{escape(fields[field], quote=True)}"' for field, _ in categories.values())
        rows = ''.join(f'<div><dt>{escape(key.replace("_", " ").title())}</dt><dd>{escape(value)}</dd></div>'
                       for key, value in fields.items() if key != 'certificate_file')
        cards.append(f'''<article class="card" {attributes}>
          <img src="../../{product['image']['localPath']}" width="640" height="640" loading="lazy" alt="{escape(product['image']['alt'], quote=True)}">
          <div class="body"><p class="eyebrow">{escape(fields['country_of_origin'])} / {escape(fields['color'])}</p>
          <h2>{escape(product['title'])}</h2><p>{escape(fields['shape'])} · {fields['actual_carat_weight']} ct · {escape(fields['gemstone_type'])}</p>
          <p class="price">{product['price']} <span>sample amount in store currency</span></p>
          <details><summary>View all product fields</summary>{product['descriptionHtml']}<dl>{rows}
          <div><dt>Certificate File</dt><dd><a href="{fields['certificate_file']}">Sample data sheet</a></dd></div></dl></details></div></article>''')
    html = '''<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Gemstone sample catalog review</title><style>
    *{box-sizing:border-box}body{margin:0;background:#fcfaf6;color:#18332a;font:15px/1.55 system-ui,sans-serif}
    header{padding:40px max(20px,5vw);background:#052d22;color:#fffaf2}header p{max-width:80ch}h1{margin:0;font:clamp(28px,4vw,46px)/1.15 Georgia,serif}
    main{max-width:1440px;margin:auto;padding:24px}.filters{display:flex;flex-wrap:wrap;gap:12px;margin-bottom:16px}
    label{display:grid;gap:4px;font-size:12px;font-weight:700}select{max-width:100%;padding:10px;border:1px solid #c9cfc9;border-radius:8px;background:white;color:#18332a;font:inherit}
    .grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px}.card{min-width:0;background:white;border:1px solid #e2e5de;border-radius:12px;overflow:hidden}.card[hidden]{display:none}
    img{display:block;width:100%;height:auto;aspect-ratio:1;object-fit:cover;background:#f3eee5}.body{padding:16px;overflow-wrap:anywhere}
    h2{font:21px/1.3 Georgia,serif;margin:6px 0 12px}.eyebrow{text-transform:uppercase;font-size:10px;letter-spacing:.1em;color:#765a27}.price{font-weight:700}.price span{display:block;font-weight:400;font-size:11px}
    summary{cursor:pointer;padding:10px 0;font-weight:600}dl{font-size:12px}dl>div{padding:8px 0;border-top:1px solid #e2e5de}dt{font-weight:700}dd{margin:3px 0}a{color:#12583d}
    :focus-visible{outline:3px solid #be8736;outline-offset:3px}#result{margin-bottom:20px}
    @media(max-width:1000px){.grid{grid-template-columns:repeat(3,minmax(0,1fr))}}@media(max-width:720px){.grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:440px){.grid{grid-template-columns:1fr}}
    </style><header><h1>Gemstone sample catalog</h1><p>48 draft product concepts. Every supplied category contains at least four products. All images are AI-generated. Measurements, provenance and prices are illustrative. Sample data sheets are not laboratory certificates.</p></header><main>
    <div class="filters">''' + filters + '''</div><p id="result" role="status">48 sample products</p><div class="grid">''' + ''.join(cards) + '''</div></main><script>
    const filters=[...document.querySelectorAll('select[data-field]')];const cards=[...document.querySelectorAll('.card')];
    function update(){let count=0;for(const card of cards){const visible=filters.every(select=>!select.value||card.getAttribute('data-'+select.dataset.field.replaceAll('_','-'))===select.value);card.hidden=!visible;if(visible)count++;}document.getElementById('result').textContent=count+' sample products';}
    for(const select of filters)select.addEventListener('change',update);
    </script></html>'''
    (HERE / 'review.html').write_text(html, encoding='utf-8')


def build():
    products = []
    for index in range(48):
        shape_index = index // 4
        shape = SHAPES[shape_index]
        color_index = index % len(COLORS)
        color, stone = COLORS[color_index], STONES[color_index]
        country = COUNTRIES[index % len(COUNTRIES)]
        lab = LABS[index % len(LABS)]
        weight_index = index % len(RANGES)
        weight = WEIGHTS[weight_index] + (index // 8) * 0.02
        number = f'DEMO-GEM-{index + 1:03d}'
        handle = f'demo-{slug(shape)}-{slug(color)}-{index + 1:03d}'
        asset = f'assets/{handle}.jpg'
        cut = 'Cabochon' if shape == 'Cabochon' else ('Step Cut' if shape in ['Emerald', 'Asscher', 'Baguette'] else 'Brilliant Cut')
        length = round(4 + weight ** (1 / 3) * 3, 2)
        width = round(length * (0.62 if shape in ['Baguette', 'Marquise'] else 0.75 if shape in ['Oval', 'Pear', 'Emerald', 'Cabochon'] else 1), 2)
        depth = round(width * 0.62, 2)
        dimensions = f'{length:.2f} x {width:.2f} x {depth:.2f} mm'
        title = f'[Sample] {weight:.2f} ct {shape} {stone}'
        disclosures = ('Fictional sample product for catalog testing; not for sale. '
                       'Image is AI-generated. Origin, dimensions, weight and price are invented demo values. '
                       f'{lab} is a category assignment only: no laboratory has examined or certified this sample. '
                       'Treatment and natural/synthetic identity are unverified. The attached file is a sample data sheet, not a laboratory report.')
        description = (f'<p>A {escape(color.lower())} {escape(stone.lower())} design concept with a '
                       f'{escape(shape.lower())} silhouette and {escape(cut.lower())} finish. '
                       f'This {weight:.2f} ct sample illustrates the {escape(RANGES[weight_index])} category.</p>'
                       f'<p>Use this draft to preview product photography, specifications and filters for '
                       f'{escape(country)} origin and the {escape(lab)} laboratory category.</p>'
                       f'<p><strong>Sample only:</strong> {escape(disclosures)}</p>')
        fields = {
            'certificate_file': f'certificates/{number}.txt', 'certificate_number': number,
            'certification_laboratory': lab, 'certification_status': 'Demo - not certified',
            'treatment': 'Unknown / not tested', 'country_of_origin': country,
            'dimensions': dimensions, 'carat_range': RANGES[weight_index],
            'actual_carat_weight': f'{weight:.2f}', 'color': color, 'cut': cut,
            'shape': shape, 'gemstone_type': stone, 'gemstone_group': GROUPS[color_index],
            'disclosures': disclosures,
        }
        prompt = (f'Use case: product-mockup. Create one square ecommerce catalog photograph of a single loose '
                  f'{color.lower()} {stone.lower()} gemstone with a {shape.lower()} shape: '
                  f'{SILHOUETTES[shape_index]}. '
                  'Face-up centered view, gemstone occupies 65% of the image. Clean warm off-white background, '
                  'subtle contact shadow, soft studio lighting, crisp realistic material detail, restrained reflections. '
                  'For multi-color tourmaline show visible pink and green zones in the same stone. '
                  'For white/colorless quartz show a transparent colorless stone. '
                  'No jewellery, hands, props, text, watermark, logos or additional stones. '
                  'Illustrative sample catalog imagery, not a verified real stone.')
        if index == 0:
            prompt = ('Use case: product-mockup. Create one square ecommerce catalog photograph of a single loose round brilliant-cut red ruby gemstone, face-up centered, occupying 65% of the frame, on a clean warm off-white background with a subtle contact shadow. Precisely circular outer silhouette, realistic ruby red body color, crisp believable triangular facets and natural small internal inclusions. Soft studio lighting, sharp gem detail. No jewellery, no hands, no text, no watermark, no logos. This is illustrative sample catalog imagery, not a photograph of a verified stone.')
        products.append({
            'handle': handle, 'title': title, 'descriptionHtml': description,
            'vendor': 'Raza Gems - Sample Catalog', 'productType': 'Loose Gemstone',
            'status': 'DRAFT', 'sku': number, 'price': f'{weight * (120 + color_index * 25):.2f}',
            'price_note': 'Illustrative amount in store currency, not an appraisal.',
            'tags': ['demo-gemstones', 'sample-not-for-sale', f'origin:{slug(country)}', f'certificate:{slug(lab)}',
                     f'carat:{slug(RANGES[weight_index])}', f'color:{slug(color)}', f'shape:{slug(shape)}'],
            'image': {'localPath': asset, 'alt': f'AI-generated sample {shape.lower()} {color.lower()} {stone.lower()}', 'prompt': prompt},
            'metafields': fields,
        })
    categories = {'Country': ('country_of_origin', COUNTRIES), 'certificate': ('certification_laboratory', LABS),
                  'Carat': ('carat_range', RANGES), 'Color': ('color', COLORS), 'Shape': ('shape', SHAPES)}
    collections = []
    for group, (field, values) in categories.items():
        for value in values:
            matching = [p for p in products if p['metafields'][field] == value]
            assert len(matching) >= 4, (group, value)
            collections.append({'title': value, 'handle': f'demo-{slug(group)}-{slug(value)}',
                                'descriptionHtml': f'<p>Sample {escape(value)} gemstone collection for previewing the {escape(group.lower())} category.</p>',
                                'metafields': {'collection_group': group}, 'productHandles': [p['handle'] for p in matching],
                                'imageLocalPath': matching[0]['image']['localPath']})
    catalog = {'notice': 'FICTIONAL DRAFT CATALOG. All product measurements, provenance and prices are demo values.',
               'metafieldNamespace': 'custom', 'metafieldTypes': TYPES, 'products': products, 'collections': collections}
    HERE.mkdir(parents=True, exist_ok=True)
    (HERE / 'catalog.json').write_text(json.dumps(catalog, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
    (HERE / 'certificates').mkdir(exist_ok=True)
    for product in products:
        lines = ['SAMPLE DATA SHEET - NOT A LABORATORY CERTIFICATE', '', product['title'], '',
                 *[f'{key}: {value}' for key, value in product['metafields'].items() if key != 'certificate_file']]
        (HERE / product['metafields']['certificate_file']).write_text('\n'.join(lines) + '\n', encoding='utf-8')
    coverage = {group: dict(Counter(p['metafields'][field] for p in products)) for group, (field, _) in categories.items()}
    (HERE / 'coverage.json').write_text(json.dumps(coverage, indent=2) + '\n', encoding='utf-8')
    write_preview(products, categories)
    print(f'Created {len(products)} draft product records, {len(collections)} collection mappings and 48 sample data sheets.')
    print('Every listed category has at least four distinct products.')


if __name__ == '__main__':
    build()
