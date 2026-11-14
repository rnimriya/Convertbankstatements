"""Append passing posts from posts.py to web/lib/blog/generated.ts.

Usage: python3 append.py [slug ...]   (no args = all POSTS)
Writes TS object literals matching the existing file format:
  {
    id: "...",
    slug: "...",
    ...
    content: "<p>...</p>\\n...",
  },
inserted before the final "];". Uses json.dumps for string escaping.
"""
import json
import re
import sys

sys.path.insert(0, 'daily-2026-11-10')
from posts import POSTS

wanted = set(sys.argv[1:]) or None
path = 'web/lib/blog/generated.ts'
src = open(path).read()
assert src.rstrip().endswith('];'), 'generated.ts does not end with ];'

def ts_str(s):
    return json.dumps(s, ensure_ascii=False)

def entry(p):
    tags = '[' + ', '.join(ts_str(t) for t in p['tags']) + ']'
    return (
        '  {\n'
        f'    id: {ts_str(p["id"])},\n'
        f'    slug: {ts_str(p["slug"])},\n'
        f'    title: {ts_str(p["title"])},\n'
        f'    excerpt: {ts_str(p["excerpt"])},\n'
        f'    featureImage: {ts_str(p["featureImage"])},\n'
        f'    author: {ts_str(p["author"])},\n'
        f'    tags: {tags},\n'
        '    published: true,\n'
        '    createdAt: "2026-11-10T06:30:00.000Z",\n'
        '    updatedAt: "2026-11-10T06:30:00.000Z",\n'
        f'    content: {ts_str(p["content"])},\n'
        '  },\n'
    )

to_add = [p for p in POSTS if wanted is None or p['slug'] in wanted]
assert to_add, 'no posts selected'
for p in to_add:
    assert f'slug: "{p["slug"]}"' not in src, f'duplicate slug already in generated.ts: {p["slug"]}'

idx = src.rfind('];')
new_src = src[:idx] + ''.join(entry(p) for p in to_add) + src[idx:]
open(path, 'w').write(new_src)
print('appended:', ', '.join(p['slug'] for p in to_add))
