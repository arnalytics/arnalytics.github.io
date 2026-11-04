# arnalytics.github.io

Personal website of **Arnau Barrera-Roy**, PhD student in AI at the Universitat de Barcelona and the Computer Vision Center.
Live at <https://arnalytics.github.io>.

Built with Vite, React, TypeScript, Tailwind CSS and Framer Motion. Pushing to `main` deploys it to GitHub Pages
(`.github/workflows/gh-pages.yml`).

## Develop

```sh
npm install
npm run dev      # http://localhost:8080
npm run build    # writes dist/ (and dist/404.html so deep links work on GitHub Pages)
npm run lint
```

## Where things live

| Path | What it is |
| :--- | :--- |
| `src/data/publications.ts` | Every publication: title, authors, venue, links, thumbnail, BibTeX. The list pages read from here. |
| `src/data/news.ts` | News items shown on the home page (latest 3) and on `/news`. |
| `src/components/Experience.tsx` | The experience list on the home page. |
| `src/pages/*Publication.tsx` | One project page per paper. |
| `src/components/publication/` | Building blocks for project pages: layout, sections, figures, counters, before/after slider, BibTeX, YouTube embed, the animated tracking graph. |
| `public/media/<paper>/` | Figures and PDFs used by each project page. |

### Adding a publication

1. Add an entry to `src/data/publications.ts` and drop its figures in `public/media/<slug>/`.
2. Create `src/pages/<Name>Publication.tsx` using `PublicationLayout` (copy one of the existing pages).
3. Register the route `/publications/<slug>` in `src/App.tsx`.
