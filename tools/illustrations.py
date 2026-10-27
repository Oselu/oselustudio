"""Generate the two offer illustrations (inline SVG) for the Play Inquiry workshops section.
Sessions: a long shared table, everyone on their own sheet, bunting overhead (a public event).
At Work: a meeting table, one shared sheet that everyone's line runs into, a facilitator with a prompt."""
import math
INK='#231d13'; PAPER='#fffaf0'; WHITE='#ffffff'
Y='#f4b32b'; C='#e8634a'; G='#3e9a62'; B='#3f97d8'

def f(x): return f'{x:.1f}'.rstrip('0').rstrip('.')

SKIN = ['#6b4226', '#8a5a3c', '#a8714a']

def person(cx, cy, shirt, angle=0, skin=0, wrap=None, reach=(0, 0)):
    """Seen from above, facing +y (angle rotates: 180 faces up, 90 faces left, -90 faces right).
    Arms reach forward onto the table; reach=(left, right) extends either arm."""
    lx, rx = -11 + 0, 12
    ly, ry = 27 + reach[0], 29 + reach[1]
    arms = ''
    for (x0, y0, x1, y1) in ((-20, 2, -11, ly), (20, 2, rx, ry)):
        arms += f'<path d="M{x0} {y0}L{x1} {y1}" stroke="{INK}" stroke-width="12.5" stroke-linecap="round"/>'
        arms += f'<path d="M{x0} {y0}L{x1} {y1}" stroke="{shirt}" stroke-width="7.5" stroke-linecap="round"/>'
    hands = ''.join(f'<circle cx="{x}" cy="{y + 3}" r="5.6" fill="{SKIN[skin % 3]}" stroke="{INK}" stroke-width="1.8"/>' for x, y in ((-11, ly), (rx, ry)))
    body = f'<rect x="-31" y="-12" width="62" height="24" rx="12" fill="{shirt}" stroke="{INK}" stroke-width="2.5"/>'
    if wrap:
        head = (f'<circle cx="0" cy="-1" r="14.5" fill="{wrap}" stroke="{INK}" stroke-width="2"/>'
                f'<path d="M-9 -8C-3 -2 3 -2 9 -8" fill="none" stroke="{INK}" stroke-width="1.8" stroke-linecap="round"/>'
                f'<circle cx="0" cy="-13" r="4.5" fill="{wrap}" stroke="{INK}" stroke-width="1.8"/>')
    else:
        head = f'<circle cx="0" cy="-1" r="14" fill="{INK}"/>'
    return f'<g transform="translate({f(cx)} {f(cy)}) rotate({angle})">{arms}{hands}{body}{head}</g>'

def sheet(cx, cy, w, h, rot, fill=WHITE):
    return f'<rect x="{f(cx-w/2)}" y="{f(cy-h/2)}" width="{w}" height="{h}" rx="4" fill="{fill}" stroke="{INK}" stroke-width="2.2" transform="rotate({rot} {f(cx)} {f(cy)})"/>'

def pencil(x, y, rot):
    return (f'<g transform="translate({f(x)} {f(y)}) rotate({rot})">'
            f'<rect x="-21" y="-3.5" width="5" height="7" fill="{C}" stroke="{INK}" stroke-width="1.6"/>'
            f'<rect x="-16" y="-3.5" width="29" height="7" fill="{Y}" stroke="{INK}" stroke-width="1.6"/>'
            f'<path d="M13 -3.5L21 0L13 3.5Z" fill="#f3d9b1" stroke="{INK}" stroke-width="1.6" stroke-linejoin="round"/>'
            f'<path d="M18.6 -1.1L21 0L18.6 1.1Z" fill="{INK}"/></g>')

def mark(d, color, delay, width=5):
    return f'<path class="dr" pathLength="1" d="{d}" stroke="{color}" stroke-width="{width}" style="transition-delay:{delay}s"/>'

def sessions():
    out = []
    # bunting: a public event
    P0, P1, P2 = (10, 18), (300, 70), (590, 18)
    q = lambda t: tuple((1-t)**2*P0[i] + 2*(1-t)*t*P1[i] + t*t*P2[i] for i in range(2))
    out.append(f'<path d="M{P0[0]} {P0[1]}Q{P1[0]} {P1[1]} {P2[0]} {P2[1]}" fill="none" stroke="{INK}" stroke-width="2"/>')
    cols = [C, PAPER, G, B]
    n = 11
    for i in range(n):
        t = 0.05 + i * (0.9 / (n - 1))
        (x1, y1), (x2, y2) = q(t - .028), q(t + .028)
        mx, my = (x1 + x2) / 2, (y1 + y2) / 2
        dx, dy = x2 - x1, y2 - y1; L = math.hypot(dx, dy); nx, ny = -dy / L, dx / L
        tip = (mx + nx * 24, my + ny * 24)
        out.append(f'<path d="M{f(x1)} {f(y1)}L{f(x2)} {f(y2)}L{f(tip[0])} {f(tip[1])}Z" fill="{cols[i % 4]}" stroke="{INK}" stroke-width="2" stroke-linejoin="round"/>')
    # table with the brand's offset shadow
    out.append(f'<rect x="62" y="134" width="488" height="118" rx="26" fill="{INK}"/>')
    out.append(f'<rect x="56" y="128" width="488" height="118" rx="26" fill="{PAPER}" stroke="{INK}" stroke-width="3"/>')
    # five people, five sheets, five different drawings
    sheets = [(122, 170, -6), (211, 204, 4), (300, 170, -3), (389, 204, 5), (478, 170, -4)]
    for (cx, cy, r) in sheets: out.append(sheet(cx, cy, 70, 54, r))
    out.append(pencil(168, 150, 24)); out.append(pencil(438, 228, -20))
    out.append('<g filter="url(#crayon)" fill="none" stroke-linecap="round" stroke-linejoin="round">')
    out.append(mark('M120 172c0-7 8-9 11-4s-1 12-9 12-13-6-11-14 10-13 18-10', C, .1))
    out.append(mark('M191 211l8-15 8 15 8-15 8 15 8-15', G, .3))
    out.append(mark('M300 156c8 0 14 6 14 14s-6 14-14 14-14-6-14-14 6-14 14-14', INK, .5))
    out.append(mark('M366 206c7-13 15-13 22 0s15 13 23 0', Y, .7, 6))
    for k, (a, b) in enumerate([((478, 154), (478, 162)), ((478, 178), (478, 186)), ((462, 170), (470, 170)), ((486, 170), (494, 170)),
                                ((467, 159), (472, 164)), ((484, 176), (489, 181)), ((489, 159), (484, 164)), ((472, 176), (467, 181))]):
        out.append(mark(f'M{a[0]} {a[1]}L{b[0]} {b[1]}', B, .9 + k * .04, 4.5))
    out.append('</g>')
    out.append(f'<circle cx="300" cy="170" r="3.5" fill="{INK}"/>')
    out.append(person(122, 106, C, 0, skin=0, reach=(0, 8)))
    out.append(person(300, 106, PAPER, 0, skin=1, wrap=G, reach=(6, 0)))
    out.append(person(478, 106, B, 0, skin=2, reach=(0, 8)))
    out.append(person(211, 268, G, 180, skin=2, reach=(8, 0)))
    out.append(person(389, 268, Y, 180, skin=0, reach=(0, 6)))
    return '<svg class="pi-ill" viewBox="0 0 600 300" aria-hidden="true" focusable="false">' + ''.join(out) + '</svg>'

def work():
    out = []
    cx, cy = 322, 150
    out.append(f'<ellipse cx="{cx+6}" cy="{cy+6}" rx="174" ry="90" fill="{INK}"/>')
    out.append(f'<ellipse cx="{cx}" cy="{cy}" rx="174" ry="90" fill="{PAPER}" stroke="{INK}" stroke-width="3"/>')
    # one shared sheet
    out.append(sheet(336, 150, 210, 112, -3))
    # prompt cards from the facilitator: a structured sequence
    for k, (x, y, r) in enumerate([(186, 118, -6), (182, 152, 3), (188, 186, -4)]):
        out.append(f'<g transform="rotate({r} {x} {y})"><rect x="{x-14}" y="{y-14}" width="28" height="28" rx="3" fill="{Y}" stroke="{INK}" stroke-width="2"/>'
                   f'<text x="{x}" y="{y+6}" text-anchor="middle" class="pi-ill-n">{k+1}</text></g>')
    # coffee
    out.append(f'<circle cx="458" cy="192" r="12" fill="{WHITE}" stroke="{INK}" stroke-width="2.5"/><circle cx="458" cy="192" r="7.5" fill="#8a5a3c"/>'
               f'<path d="M470 187c7 0 7 10 0 10" fill="none" stroke="{INK}" stroke-width="2.5" stroke-linecap="round"/>')
    # everyone's line runs into the same drawing
    out.append('<g filter="url(#crayon)" fill="none" stroke-linecap="round" stroke-linejoin="round">')
    out.append(mark('M268 100C282 118 266 128 290 134S320 144 336 150', G, .1, 6))
    out.append(mark('M398 98C390 116 404 124 384 134S352 146 336 150', C, .25, 6))
    out.append(mark('M436 156C420 146 416 166 398 156S354 150 336 150', Y, .4, 7))
    out.append(mark('M268 202C284 188 272 176 294 170S322 158 336 150', B, .55, 6))
    out.append(mark('M400 202C386 190 374 198 368 180S348 158 336 150', INK, .7, 5))
    out.append(mark('M333 143c-6-5 2-12 8-8s4 12-4 13-10-5-6-11', INK, 1.0, 3.5))
    out.append('</g>')
    out.append(f'<circle cx="336" cy="150" r="5" fill="{INK}"/>')
    # the team, seated
    out.append(person(262, 50, G, 0, skin=1, reach=(0, 6)))
    out.append(person(392, 50, C, 0, skin=2, wrap=B, reach=(6, 0)))
    out.append(person(262, 250, B, 180, skin=0, reach=(0, 6)))
    out.append(person(392, 250, PAPER, 180, skin=1, reach=(6, 0)))
    out.append(person(510, 152, Y, 90, skin=2, reach=(0, 4)))
    # the facilitator, standing, with a prompt
    out.append(person(116, 156, PAPER, -90, skin=0, reach=(-4, -4)))
    out.append(f'<path d="M28 44h64a14 14 0 0 1 14 14v22a14 14 0 0 1-14 14H90l12 26-28-26H28a14 14 0 0 1-14-14V58a14 14 0 0 1 14-14z" fill="{WHITE}" stroke="{INK}" stroke-width="2.5" stroke-linejoin="round"/>')
    out.append(f'<text x="60" y="82" text-anchor="middle" class="pi-ill-q">?</text>')
    return '<svg class="pi-ill" viewBox="0 0 600 300" aria-hidden="true" focusable="false">' + ''.join(out) + '</svg>'

if __name__ == '__main__':
    import sys, json
    json.dump({'sessions': sessions(), 'work': work()}, open(sys.argv[1], 'w'))
