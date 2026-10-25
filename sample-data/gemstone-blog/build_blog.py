"""Build 20 original editorial drafts and their Gemstone Topic mappings.

No store writes. Run: python sample-data/gemstone-blog/build_blog.py
"""
from html import escape
from pathlib import Path
import json
import re

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
CSS = '''*{box-sizing:border-box}body{margin:0;background:#fcfaf6;color:#18332a;font:16px/1.75 system-ui,sans-serif}header{background:#052d22;color:#fffaf2;padding:40px max(20px,5vw)}header p{max-width:75ch}h1{font:clamp(28px,4vw,44px)/1.2 Georgia,serif;margin:0 0 12px}main{max-width:1160px;padding:24px;margin:auto}a{color:#165d44}header a{color:#fffaf2}.grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px}.card{display:flex;flex-direction:column;min-width:0;background:#fff;border:1px solid #e2e5de;border-radius:10px;overflow:hidden}.card[hidden]{display:none}.card img{width:100%;height:auto;aspect-ratio:16/10;object-fit:cover}.card-body{display:flex;flex:1;flex-direction:column;align-items:flex-start;padding:16px}.card h2{font:21px/1.3 Georgia,serif;margin:8px 0}.card p{font-size:13px}.card a{margin-top:auto}.topic{text-transform:uppercase;font-size:11px;letter-spacing:.08em;color:#765a27}.article{max-width:780px}.article h2{font:28px/1.3 Georgia,serif;margin-top:32px}.article img{display:block;width:100%;height:auto;max-height:450px;object-fit:contain;background:#fff}.article figure{margin:0 0 24px}.article figcaption{font-size:12px;color:#58665d}.sources{margin-top:36px;border-top:1px solid #cbd3cc;padding-top:16px;font-size:13px}select{padding:10px;border:1px solid #bbc8bd;border-radius:6px;background:white;color:#18332a;font:inherit;max-width:100%}:focus-visible{outline:3px solid #bb8b39;outline-offset:3px}@media(max-width:1000px){.grid{grid-template-columns:repeat(3,minmax(0,1fr))}}@media(max-width:720px){.grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:440px){.grid{grid-template-columns:1fr}}'''


def slug(text):
    return re.sub(r'[^a-z0-9]+', '-', text.lower()).strip('-')


def paragraphs(markdown):
    result = []
    for block in markdown.strip().split('\n\n'):
        block = block.strip()
        if block.startswith('## '):
            result.append(f'<h2>{escape(block[3:])}</h2>')
        else:
            result.append(f'<p>{escape(" ".join(block.splitlines()))}</p>')
    return '\n'.join(result)


def build():
    records = []
    topics = []
    source = (HERE / 'content.md').read_text(encoding='utf-8')
    for chunk in source.split('\n---\n'):
        header, body = chunk.strip().split('\n\n', 1)
        lines = header.splitlines()
        title = lines[0].removeprefix('# ')
        metadata = {}
        references = []
        for line in lines[1:]:
            key, value = line.split(': ', 1)
            if key == 'Source':
                references.append(value)
            else:
                metadata[key] = value
        topic = metadata['Topic']
        handle = slug(title)
        topic_handle = slug(topic)
        image_path = f"assets/{metadata['Image']}"
        assert (ROOT / image_path).is_file(), image_path
        assert references and all(url.startswith('https://') for url in references)
        word_count = len(re.findall(r'\b\w+\b', body))
        assert word_count >= 220, (title, word_count)
        assert body.count('## ') == 4, title
        body_html = paragraphs(body)
        reference_html = '<aside class="sources"><h2>Further reading</h2><ul>' + ''.join(
            f'<li><a href="{escape(url, quote=True)}">GIA: {escape(url.split("/")[-1].split("?")[0].replace("-", " "))}</a></li>'
            for url in references
        ) + '</ul></aside>'
        record = {
            'handle': handle, 'title': title, 'author': {'name': 'Raza Gems Editorial'},
            'summary': f'<p>{escape(metadata["Summary"])}</p>',
            'body': body_html + '\n' + reference_html,
            'tags': [topic, 'Gemstone Guides'], 'isPublished': False,
            'topicHandle': topic_handle, 'wordCount': word_count,
            'image': {'localPath': image_path, 'altText': f'AI-generated gemstone illustration for {topic.lower()}',
                      'caption': 'AI-generated illustration; not a photograph of verified inventory.'},
            'references': references,
            'metafieldLink': {'namespace': 'custom', 'key': 'gemstone_topic', 'type': 'metaobject_reference',
                              'resolveFromTopicHandle': topic_handle},
        }
        records.append(record)
        topics.append({'handle': topic_handle, 'title': topic,
                       'fields': [{'key': 'title', 'value': topic}],
                       'articleHandles': [handle], 'suggestedImageLocalPath': image_path})
    assert len(records) == 20
    assert len({record['handle'] for record in records}) == 20
    assert len({topic['handle'] for topic in topics}) == 20
    article_manifest = {
        'status': 'LOCAL_DRAFTS_NOT_UPLOADED', 'language': 'en',
        'targetBlogHandle': 'news', 'renameExistingBlog': False,
        'articleCount': len(records), 'articles': records,
    }
    topic_manifest = {
        'status': 'LOCAL_ENTRIES_NOT_CREATED_IN_SHOPIFY',
        'definition': {'displayName': 'Gemstone Topic', 'expectedType': 'gemstone_topic',
                       'expectedTitleField': 'title', 'requiresStoreSchemaVerification': True},
        'articleMetafield': {'namespace': 'custom', 'key': 'gemstone_topic', 'type': 'metaobject_reference'},
        'topicCount': len(topics), 'entries': topics,
    }
    for filename, data in [('articles.json', article_manifest), ('topics.json', topic_manifest)]:
        (HERE / filename).write_text(json.dumps(data, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
    output = HERE / 'articles'
    output.mkdir(exist_ok=True)
    (HERE / 'review.css').write_text(CSS + '\n', encoding='utf-8')
    cards = []
    for record in records:
        label = next(topic['title'] for topic in topics if topic['handle'] == record['topicHandle'])
        image = record['image']
        html = f'''<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{escape(record['title'])}</title><link rel="stylesheet" href="../review.css">
        <header><a href="../review.html">All 20 articles</a><p>{escape(label)} · Editorial draft</p><h1>{escape(record['title'])}</h1><p>{escape(record['author']['name'])} · {record['wordCount']} words</p></header>
        <main class="article"><figure><img src="../../../{image['localPath']}" width="1246" height="1246" alt="{escape(image['altText'], quote=True)}"><figcaption>{escape(image['caption'])}</figcaption></figure>{record['body']}</main></html>'''
        (output / f"{record['handle']}.html").write_text(html, encoding='utf-8')
        cards.append(f'''<article class="card" data-topic="{record['topicHandle']}"><img src="../../{image['localPath']}" width="1246" height="1246" loading="lazy" alt="{escape(image['altText'], quote=True)}"><div class="card-body"><span class="topic">{escape(label)}</span><h2>{escape(record['title'])}</h2>{record['summary']}<p>{record['wordCount']} words · Draft</p><a href="articles/{record['handle']}.html">Read article</a></div></article>''')
    options = ''.join(f'<option value="{topic["handle"]}">{escape(topic["title"])}</option>' for topic in topics)
    review = '''<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>20 gemstone editorial drafts</title><link rel="stylesheet" href="review.css"><header><h1>20 gemstone guides</h1><p>Complete English editorial drafts with 20 Gemstone Topic mappings. These local files have not been uploaded to Shopify. Images are AI-generated illustrations.</p></header><main><label for="topic">Gemstone Topic </label><select id="topic"><option value="">All topics</option>''' + options + '''</select><p id="result" role="status">20 articles</p><div class="grid">''' + ''.join(cards) + '''</div></main><script>const filter=document.getElementById('topic');const cards=[...document.querySelectorAll('[data-topic]')];filter.addEventListener('change',()=>{let visible=0;for(const card of cards){card.hidden=!!filter.value&&card.dataset.topic!==filter.value;if(!card.hidden)visible++;}document.getElementById('result').textContent=visible+' articles';});</script></html>'''
    (HERE / 'review.html').write_text(review, encoding='utf-8')
    for page in [HERE / 'review.html', *output.glob('*.html')]:
        for destination in re.findall(r'(?:href|src)="([^"]+)"', page.read_text(encoding='utf-8')):
            if not destination.startswith(('https://', 'http://', '#')):
                assert (page.parent / destination).resolve().is_file(), (page.name, destination)
    print(f'Built 20 full articles and 20 topic entries; {sum(record["wordCount"] for record in records)} body words.')
    print(f'Article length: {min(record["wordCount"] for record in records)}–{max(record["wordCount"] for record in records)} words; all images and topic links checked.')


if __name__ == '__main__':
    build()
