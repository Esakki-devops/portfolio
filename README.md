# Esakki Alaguvel — Portfolio

Personal portfolio for **Esakki Alaguvel**, IT Support Engineer (Cloud & DevOps) based in
Tirunelveli, Tamil Nadu, India.

Live sections: Home, About, Skills, Experience, Projects, Certifications, Achievements, Contact.

## Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| UI | React 19, TypeScript |
| Styling | Tailwind CSS v4 (CSS-first `@theme`) |
| Animation | Framer Motion, Lenis smooth scroll |
| Forms | React Hook Form + Zod |
| Icons | lucide-react |

## Getting started

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

```bash
npm run build   # production build
npm start       # serve the production build
npm run lint    # eslint, zero-warning policy
```

## Where the content lives

All display content is in two files — edit these rather than the components:

- `src/lib/site.ts` — name, role, contact details, social URLs, resume path
- `src/lib/data.ts` — skills, projects, experience, certifications, achievements, stats

Everything in them is sourced from the CV in `public/`. Please keep it factual: no invented
metrics, credentials, or seniority.

## Project layout

```
src/
  app/              routes, metadata, OG image, sitemap, robots, API routes
  components/
    effects/        backdrop, particles, code rain, cursor glow, preloader, smooth scroll
    layout/         navbar, footer
    sections/       one component per page section
    ui/             reusable primitives (Reveal, TiltCard, Counter, Toast, …)
  lib/              content, hooks, validation schema, helpers
```

## Performance notes

The ambient effects are deliberately budgeted:

- Particle links use a uniform spatial grid instead of comparing every pair.
- Both canvases are disabled below 768px, and pause when off-screen or the tab is hidden.
- `backdrop-filter` is dropped on phones, where it was the main source of scroll jank.
- The cursor-follow grid moves by `transform`; animating `mask-image` repainted the viewport.
- Every ambient effect is gated behind `prefers-reduced-motion`.

Measured on the production build: 60 FPS while scrolling at both desktop and mobile widths,
holding 60 FPS with ~50% of the main thread artificially occupied.

## Known limitations

- **The contact form does not send email.** `POST /api/contact` validates the payload and
  logs it server-side, returning `{ ok: true, delivered: false }`. Wire up a mail provider
  (Resend, SES, SendGrid) before relying on it.
- **`site.url` is a placeholder.** Set it to the real domain before deploying — canonical,
  Open Graph and sitemap URLs all derive from it.
- Accessibility has been checked for text contrast (WCAG AA) but has not had a full
  screen-reader audit.

## Licence

Personal project. Content and images are © Esakki Alaguvel.
