# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal freelance website for Alan Reid — Fractional CTO & Technology Advisor based in Berlin. Built with Jekyll for GitHub Pages, CSS inlined at build time to eliminate render-blocking resources.

## Architecture

- **Jekyll** — static site generator, used for layouts/includes and CSS inlining
- **Zero external dependencies** — system font stack (no Google Fonts), inline SVG icons, no CDN resources
- **GDPR-compliant by design** — no cookies, no analytics, no tracking, no third-party requests
- **CSS is inlined** — `_includes/style.css` is included via `{% include style.css %}` in `<style>` tags, not loaded as an external resource
- **HTML minification** — `_layouts/compress.html` (pure Liquid, no gems) strips comments, collapses whitespace, clips around block elements

### Layout Chain

Pages use `layout: default` → `default.html` uses `layout: compress` → minified output. The compress layout is configured in `_config.yml` under `compress_html`.

### Front Matter Flags

Pages use these front matter flags to control behavior in `_layouts/default.html`:

- `homepage: true` — includes OG tags, Twitter card, and JSON-LD (inlined in `default.html`)
- `legal: true` — adds `legal-page` class to `<main>`, switches nav to `legal-nav` (solid white, links back to index)
- `noindex: true` — adds `<meta name="robots" content="noindex, nofollow">`

### Key Files

- `index.html` — Single-page site (composes section partials)
- `imprint.html` — Legal notice (§ 5 DDG)
- `privacy.html` — Privacy policy (DSGVO/GDPR)
- `_layouts/default.html` — Shared HTML shell (head, nav, footer)
- `_layouts/compress.html` — HTML minification layout (jekyll-compress-html)
- `_includes/style.css` — All CSS (inlined into pages at build time)
- `_includes/scripts.js` — Page scripts (inlined at build time)
- `_includes/sections/` — Homepage section partials (hero, services, about, experience, contact)

## Development

```
bundle exec jekyll serve
```

If dependencies aren't installed yet:

```
gem install jekyll bundler
bundle exec jekyll serve
```

The built site is output to `_site/` (gitignored).

## Design System

- **Dark hero/contact** sections (`--color-bg-dark: #0a0f1a`) bookend the page
- **Serif headings** (Georgia) + **sans-serif body** (system font stack)
- **Accent color**: teal `#14b8a6`, **warm accent**: amber `#f59e0b`
- **Nav**: transparent over dark hero, transitions to solid white on scroll via JS
- **Legal pages**: use `.legal-nav` class to force solid white nav

## External Services

- **Formspark** (`submit-form.com/qNTD9rgzB`) — handles the contact form. EU-based (Belgium), data stored in Ireland. Documented in `privacy.html` section 6.

## German Legal Compliance

- Impressum references **§ 5 DDG** (not the old TMG — DDG replaced TMG in May 2024)
- EU OS platform reference was intentionally removed (platform shut down July 2025)
- Supervisory authority: Berliner Beauftragte für Datenschutz, Alt-Moabit 59-61, 10555 Berlin
- Any new external resource (fonts, analytics, embeds) requires updating `privacy.html` and potentially adding a cookie consent mechanism
