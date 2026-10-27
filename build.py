#!/usr/bin/env python3
"""Build the Oselu Irabor / Play Inquiry site from src/.

    python3 build.py

Writes:
  index.html                   the complete site as one page, ready for any static host (GitHub Pages, Netlify, ...)
  build/claude/index.html      the same page as published on Claude (no <html>/<head>; Claude adds the document shell)
  build/claude/tpl/page.html   the template the page republishes itself from when the owner adds work on Claude

Sources:
  src/head.html  src/body.html  src/app.js       the studio (portfolio) side and the shared shell
  src/play.html  src/play.css   src/play.js      Play Inquiry, inserted at <!--@PLAY@-->, /*@PLAY_CSS@*/, /*@PLAY_JS@*/
  src/data/content-v1.html                        project data carried over from the first version of the site
  src/data/pv.json  src/data/wc.json              hover previews and the 100 World Cup posters
  src/data/skeleton.html                          Claude's document shell (used for the template)

Owner data (artwork and Coventry posters added from the site, Lagos photos and reflections, the next public session)
lives in four markers in the page. They are always empty in the template. To carry data from the live Claude page into a
build, save it as src/live/extra.json, cov.json, pilot.json or next.json.
"""
import json, pathlib, re

ROOT = pathlib.Path(__file__).resolve().parent
SRC = ROOT / 'src'
OLD = (SRC / 'data/content-v1.html').read_text()
SKELETON = (SRC / 'data/skeleton.html').read_text().split('\n', 1)[0]
assert SKELETON.startswith('<!doctype html>') and SKELETON.endswith('<body>')


def one_line(name):
    m = re.search(r'const ' + name + r'=(\[.*?\]|\{.*?\});\n', OLD)
    assert m, name
    json.loads(m.group(1))
    return m.group(1)


def block(name):
    m = re.search(r'const ' + name + r'=(\[\n.*?\n\]);\n', OLD, re.S)
    assert m, name
    return m.group(1)


def compact(path):
    return json.dumps(json.loads((SRC / path).read_text()), separators=(',', ':'), ensure_ascii=False)


data = {
    'PV': compact('data/pv.json'),
    'PROJECTS': block('PROJECTS'),
    'ILL_DATA': one_line('ILL_DATA'),
    'PRODUCT_PROJECTS': one_line('PRODUCT_PROJECTS'),
    'ILL_PROJECTS': block('ILL_PROJECTS'),
    'WC': compact('data/wc.json'),
    'COV_BASE': one_line('COV_BASE'),
    'ART_BASE': one_line('ART_BASE'),
}


def insert(text, marker, name):
    assert text.count(marker) == 1, marker
    part = (SRC / name).read_text().rstrip('\n')
    assert '/*@' not in part and marker not in part, name
    return text.replace(marker, part)


app = insert((SRC / 'app.js').read_text(), '/*@PLAY_JS@*/', 'play.js')
for k, v in data.items():
    ph = '/*@' + k + '@*/'
    assert app.count(ph) == 1, k
    app = app.replace(ph, v)
assert '/*@' not in app
assert '</script' not in app.lower() and '<!--' not in app

head = insert((SRC / 'head.html').read_text(), '/*@PLAY_CSS@*/', 'play.css').rstrip('\n')
body = insert((SRC / 'body.html').read_text(), '<!--@PLAY@-->', 'play.html').rstrip('\n')
# The 3D library (about 600KB) only loads on desktop computers with a mouse; phones and tablets use the plain
# page effects, which keeps the first visit light on mobile data. Smooth scrolling (small) loads everywhere.
libs = ('<script>(function(){var m=function(q){return window.matchMedia&&matchMedia(q).matches};'
        'if(!m("(min-width: 900px) and (hover: hover) and (pointer: fine)")||m("(prefers-reduced-motion: reduce)"))return;'
        'var s=document.createElement("script");s.id="lib-three";s.async=true;'
        's.src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";document.head.appendChild(s)})();</script>\n'
        '<script id="lib-lenis" async src="https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.min.js"></script>')
script = '<script>\n' + app.rstrip('\n') + '\n</script>\n'
page = head + '\n' + body + '\n' + libs + '\n' + script

MARKERS = (('/*EXTRA*/[]/*END*/', 'EXTRA', 'extra.json'), ('/*COV*/[]/*END*/', 'COV', 'cov.json'),
           ('/*PILOT*/{}/*END*/', 'PILOT', 'pilot.json'), ('/*NEXT*/{}/*END*/', 'NEXT', 'next.json'))
for marker, _, _ in MARKERS:
    assert page.count(marker) == 1, marker

live = page
for marker, tag, fname in MARKERS:
    f = SRC / 'live' / fname
    if f.exists():
        items = json.loads(f.read_text())
        if items:
            j = json.dumps(items, ensure_ascii=False).replace('<', '\\u003c')
            live = live.replace(marker, '/*' + tag + '*/' + j + '/*END*/')
            print(f'carried over {len(items)} {tag} item(s)')

# Claude: the page fragment, and the template it republishes itself from (markers always empty)
out = ROOT / 'build/claude'
(out / 'tpl').mkdir(parents=True, exist_ok=True)
(out / 'index.html').write_text(live)
(out / 'tpl/page.html').write_text(SKELETON + '\n' + page + '\n</body></html>')

# Any static host: one complete document. Claude's shell supplies charset, viewport and a few base rules
# (notably [hidden]{display:none}); here they go into a real <head> along with the title, meta tags and styles.
shell_head = (SKELETON[:-len('</head><body>')].replace('<html>', '<html lang="en">', 1)
              .replace('<meta charset=utf8>', '<meta charset="utf-8">', 1))
assert live.startswith(head + '\n')
rest = live[len(head) + 1:]  # body, libraries and the script (with any owner data)
(ROOT / 'index.html').write_text(shell_head + '\n' + head + '\n</head>\n<body>\n' + rest + '</body>\n</html>\n')
print('index.html', (ROOT / 'index.html').stat().st_size, 'bytes; build/claude/index.html', len(live), 'bytes')
