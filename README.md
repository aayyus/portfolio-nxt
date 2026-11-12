# Aayush Sharma — portfolio

Personal portfolio for a Shopify developer: an editorial, grid-based single page with a password-protected admin panel for managing projects and skills.

Built with Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion and Lenis.

## Running locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. The admin panel is at `/admin`.

Create `.env.local` with:

```bash
ADMIN_PASSWORD=choose-a-password
AUTH_SECRET=a-long-random-string   # e.g. `openssl rand -hex 32`
```

With only those two set, the site reads and writes `data/projects.json` and `data/skills.json` on disk, and uploaded cover images go into `public/`. No database is needed for local work.

## Where content lives

| What | Where |
| --- | --- |
| Name, roles, email, social links, clock cities | `lib/site.ts` |
| Colours (light and dark) | the two `--paper` / `--ink` pairs at the top of `app/globals.css` |
| Projects and skills | the admin panel (stored in Postgres in production) |
| About-section text | `app/(home)/components/About.tsx` |
| Logo / favicon | `app/icon.svg`, `app/apple-icon.png`, and the `Logo` component in `app/(home)/components/ui.tsx` |

## Production (Vercel)

Environment variables:

| Variable | Purpose |
| --- | --- |
| `ADMIN_PASSWORD` | Admin login password |
| `AUTH_SECRET` | Signs the admin session cookie |
| `POSTGRES_URL` | Added automatically when a Postgres (Neon) database is connected under Storage |
| `BLOB_READ_WRITE_TOKEN` | Added automatically when a Blob store is connected under Storage. The store must allow **public** access |

When `POSTGRES_URL` is set, projects and skills are stored in a `portfolio_data` table; when `BLOB_READ_WRITE_TOKEN` is set, uploaded covers go to Vercel Blob. A new database starts empty — load the bundled data into it once with:

```bash
npx vercel env pull .env.local
npm run seed:db
```

Note that `.env.local` then points your local site at the **live** database. Remove `POSTGRES_URL` from it to go back to the local files.

The homepage is served as a cached static page. Saving anything in the admin panel refreshes it immediately. If the database is unreachable, the page falls back to the data files bundled with the build rather than showing an error.

Node.js is pinned to 24.x in `package.json` (Vercel has retired Node 20).

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run seed:db` | Load `data/*.json` into the Postgres database |
