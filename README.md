# Oselu Studio

The website of Oselu Irabor, a designer and illustrator in Kaduna, Nigeria, and of **Play Inquiry**, his creative workshop practice.

The site has two parts in one page:

- **The studio**: illustration, graphic design, the poster series (World Cup 2026, Coventry matchday), visual art, About, and Work with me (commission enquiries).
- **Play Inquiry**: workshops for individuals and teams, field notes (the Lagos session, the art club, the summer programme with Spark School Studio), Collaborate, and three enquiry forms.

## Viewing the site

`index.html` is the whole site. It's a single page with hash routes (`#work`, `#play-inquiry`, `#work-with-me`, and so on), so any static host can serve it, GitHub Pages included: in the repository settings, open **Pages** and deploy from the `main` branch, root folder.

To look at it locally, serve the folder rather than opening the file directly:

```
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Editing

Edit the files in `src/`, then rebuild:

```
python3 build.py
```

| File | What it holds |
| --- | --- |
| `src/head.html` | Title, meta tags, fonts and the studio styles |
| `src/body.html` | Header, menu, footer and the studio pages |
| `src/app.js` | Routing, page transitions, the 3D and hover effects, galleries, the studio's owner tools |
| `src/play.html`, `src/play.css`, `src/play.js` | Play Inquiry pages, styles and behaviour, including the enquiry forms |
| `src/data/` | Project data, World Cup posters and hover previews |
| `img/` | Every image the site uses |
| `tools/illustrations.py` | Generates the two workshop illustrations on the Play Inquiry page |

`build.py` writes `index.html` for static hosting and, in `build/` (not committed), the version published on Claude.

## Good to know

- **Forms** don't send anything themselves. They prepare the message and open it in WhatsApp or the visitor's email app.
- **Owner tools** (adding artwork and Coventry posters, Lagos photos and reflections, and announcing the next public session) only work when the site is published as a Claude artifact. On any other host they stay hidden.
- **Fonts** load from Google Fonts. **three.js** (r128, desktop only) and **Lenis** load from public CDNs.
- **Link previews**: `img/share.jpg` is the preview image. Once the site has its own domain, change the `og:image` tag in `src/head.html` to the full address, for example `https://yourdomain.com/img/share.jpg`, so WhatsApp, LinkedIn and X can show it.
- **Privacy**: photos have their location data removed. In the summer programme photos, children's faces are blurred and the names on their drawings are removed.
