# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a static personal portfolio website for Cheikh Abdou Lahad Diagne (alias PrinceNaar), hosted on GitHub Pages at `princenaar.github.io`. There is no build system or package manager — all files are edited directly and pushed to deploy.

## Site Structure

There are two distinct site versions that coexist in this repo:

### Root-level portfolio (`index.html`)
The main personal CV/portfolio page in French. Uses Bootstrap 4 + jQuery era stack:
- **CSS**: `css/` — Bootstrap 4, animate.css, owl.carousel, flaticon, icomoon, AOS, custom `style.css` / `style.min.css`
- **JS**: `js/` — jQuery 3, Bootstrap, owl.carousel, AOS, magnific-popup, stellar, waypoints, scrollax
- **Navigation**: Single-page with anchor links to sections: `#home-section`, `#about-section`, `#resume-section`, `#services-section`, `#skills-section`, `#projects-section`, `#contact-section`
- **Project detail pages**: Separate HTML files at root level (`covid.html`, `cour_dappel.html`, `gestion_personnel.html`, `documents.html`, `prestatech.html`, `dematerialisation.html`, `others.html`)

### Other directories
- `images/`: Profile/background images used by the root portfolio
- `fonts/`: Flaticon and Ionicons icon fonts used by the root portfolio

## Development

Since this is a pure static site, open any HTML file directly in a browser or use a local server:

```bash
# Python simple server (from repo root)
python -m http.server 8000

# Or with Node (if npx available)
npx serve .
```

## Screenshot Workflow
Screenshots play a critical role in refining visual quality.
They allow Claude to “see” the website and compare it against expectations, just like a human designer reviewing their work.
After generating or updating a design:
- Take screenshots from the localhost version of the site
- Save them in the temporary screenshots folder
- Use these images to analyze visual accuracy
  During comparison, focus specifically on:
- Spacing and padding between elements
- Font sizes, weights, and line heights
- Exact color values and contrast
- Alignment and positioning
- Border radius and shadow depth
- Image scaling and proportions
  Be precise when identifying differences.
  For example:
  Instead of saying “the spacing looks off,” specify something like:
- The heading appears larger than expected
- The gap between cards is smaller than in the reference
- The color tone does not match the brand palette
  After identifying mismatches:
- Make corrections
- Take another screenshot
- Compare again
  This review process should be repeated at least two times to ensure the design is visually polished.
  Screenshots are primarily for visual validation and should be cleaned periodically to avoid clutter.

## Key Conventions

- **Root portfolio** targets French-speaking audience — keep content in French.
- **`ubuntu/` site** is in English and uses the BootstrapMade "Impact" template structure.
- All vendor libraries are vendored locally — do not add CDN links for new dependencies; download and place them in the appropriate `vendor/` or `css/`/`js/` folder.
- Custom styles for the root portfolio go in `css/style.css` (the `.min.css` is a minified copy — keep both in sync when editing).
- The `ubuntu/` site's SCSS source is in `ubuntu/assets/scss/` but the compiled `main.css` is what's served. Edit `main.css` directly unless you have a SCSS compiler available.
