# Anmol Baruwal — Portfolio

A minimal, production portfolio for Anmol Baruwal. It presents selected AI systems, product work, experience, education, contact links, and the current résumé without authentication, analytics, or an application backend.

## Run locally

Requirements: Node.js 22.13 or newer.

```bash
npm ci
npm run dev
```

Before publishing:

```bash
npm run typecheck
npm run build
```

## Update content

- Edit profile, project, and experience copy in `src/data/portfolio.ts`.
- Replace `public/AnmolBaruwal__Resume.pdf` to update the résumé download.
- Keep design changes in `src/PortfolioApp.tsx` and `src/portfolio.css`.

The site is deployed with OpenAI Sites through the Vite integration in `vite.config.ts`.

## Rights

No open-source license is granted. Personal content, résumé material, and branding remain © Anmol Baruwal.
