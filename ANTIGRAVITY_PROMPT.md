# Antigravity Build Prompt — Kingston 3 Consulting

Paste this into the Antigravity Claude tab to refine the website.

---

You are finishing a fully optimized, production-ready website for Kingston 3 Consulting (kingston3consulting.com) — a boutique media strategy and narrative consulting firm led by Fabian Lyon, a 17-year Miami Herald veteran.

**Project files are at ~/Desktop/Kingston_Three/**
- `index.html` — full single-page site (hero, credibility bar, problem statement, services, who we serve, about, process, blog, intake form, footer)
- `css/style.css` — premium editorial design (dark/gold/cream palette, Playfair Display + Inter)
- `js/main.js` — scroll reveal, sticky nav, form handling
- `assets/logo.png` — real Kingston 3 logo

---

## YOUR TASKS

### 1. Open & Review
Open ~/Desktop/Kingston_Three as the active project. Read all files before making changes.

### 2. Design Enhancements
- Add hero text stagger animation (each line fades in sequentially)
- Add a sticky floating "Book a Call" button (bottom-right corner, gold, appears after scrolling 300px)
- Add a testimonial section between "About" and "Process" — use placeholder quote structure Fabian can fill in
- Refine the hero to feel more editorial — consider a subtle parallax effect on the background image
- Ensure perfect mobile responsiveness at 320px, 375px, 768px, 1024px, 1440px
- Add active state to nav links as user scrolls through sections

### 3. SEO & Technical
- Verify all meta tags, OG tags, Twitter card, Schema.org JSON-LD
- Create `sitemap.xml` with all page sections
- Create `robots.txt`
- Add `loading="eager"` to hero image, `loading="lazy"` to all others
- Add explicit width/height to all images to prevent layout shift
- Preload Google Fonts in the `<head>`

### 4. Performance
- Inline the above-the-fold critical CSS
- Defer main.js with `defer` attribute
- Minify and optimize where possible

### 5. GitHub Pages Deployment
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./
```

### 6. GHL Chat Widget
There is a placeholder `<div id="ghl-chat-widget"></div>` in the intake section. Leave it — the GHL embed code will be inserted there.

---

## CLIENT BRIEF

**Who:** Fabian Lyon — veteran Miami Herald journalist, media strategist, talent advocate  
**Credentials:** 17+ years at Miami Herald, interviewed Kobe Bryant, Usain Bolt, Nandi Mandela  
**Services:** Literary Representation · Media Strategy · Advocacy & Influence Building  
**Clients:** Athletes, Executives, Authors, Nonprofits, Public Figures  
**Location:** Miami, FL — serving US, Caribbean, and internationally  
**CTA:** https://calendly.com/fabianlyon2312  
**Social:** LinkedIn + Instagram @kingston_3_consulting  

---

## DESIGN SYSTEM

| Token | Value |
|-------|-------|
| --black | #0a0a0a |
| --dark | #111118 |
| --gold | #c9a84c |
| --gold-lt | #e0c06a |
| --cream | #f5f0e8 |
| Headline font | Playfair Display |
| Body font | Inter |

**Tone:** Premium, editorial, sophisticated. This should look like a $20,000+ build. Not a template. Not generic. Fabian's positioning is exclusive and boutique — the site must reflect that.

---

## DEPLOY INSTRUCTIONS (Terminal)

```bash
cd ~/Desktop/Kingston_Three
git init -b main
git add .
git commit -m "Kingston 3 Consulting — full build"
git remote add origin https://github.com/YOUR_USERNAME/kingston3-website.git
git push -u origin main
```

Then go to GitHub repo → Settings → Pages → Source: Deploy from branch `gh-pages`
