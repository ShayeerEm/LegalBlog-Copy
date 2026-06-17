# Shayeer Emanee — Portfolio &amp; Legal Blog

A multi-page personal portfolio site for **Shayeer Emanee** — Macquarie University Law &amp; Commerce student, founder of SAZICOR, freelance photographer, and artist.

Designed and coded by hand: vanilla HTML, CSS, and JavaScript. No frameworks, no build step.

## Structure

| File | Purpose |
|------|---------|
| `index.html` | Home — hero, stats, about preview, featured blog &amp; portfolio |
| `about.html` | About — bio, education timeline, skills, values |
| `experience.html` | Work, businesses (SAZICOR), volunteering &amp; leadership, achievements |
| `portfolio.html` | Art &amp; creative gallery with filter and modal |
| `blog.html` | Legal blog listing with search, categories, sidebar |
| `blog-post.html` | Reading-view template for individual articles |
| `contact.html` | Contact info, form, FAQ |
| `styles/main.css` | All styling — supports dark/light theme |
| `js/main.js` | Theme toggle, animations, filters, ToC, form |
| `assets/` | Images, CV PDF |

## Adding images

Drop these into `assets/` to replace the fallback placeholders:

- `assets/headshot.jpg` — used on home and about pages
- `assets/macquarie-logo.png` — used on home about-preview badge
- `assets/Shayeer-Emanee-CV.pdf` — already present

If a file is missing, the page falls back to a styled placeholder automatically.

## Running locally

Open `index.html` directly in a browser, or serve the folder:

```
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Filling in content

Blog cards, blog post body, and portfolio entries still contain bracketed `[Placeholder]` text for actual articles and artworks. Search the project for `[` to find anything still needing real content.
