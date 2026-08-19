# Ganga Tiram

The home of **Ganga Tiram** — 2,525 kilometres of heritage, told through 75 sacred places from Gomukh to Gangasagar. A printed book, the FACE mission (Festivals · Art · Craft & Cuisine · Environment), and a community gathering around the river — starting with **Dev Deepawali, 24 November 2026**.

## What lives here

- **The book** — a pilgrimage travelogue: 300 pages, 240 photographs, 75 places in river order. Catalogue on the homepage, full UPI purchase flow at `/buy`.
- **The FACE mission** — four wings, real numbers: 84 ghats archived in 4K, 150 painters funded, 50 looms running, 5,000 kg of plastic off her banks monthly.
- **Dev Deepawali** — `/dev-deepawali`, the community's first online gathering, with live countdown and email + WhatsApp joining.
- **Admin** — `/admin`, order/volunteer/contribution management backed by Neon Postgres.
- The details: a 3D book you can rotate, the Heritage Path in eight chapters, a river flowing across every footer — with a Gangetic dolphin that leaps if you wait, and a brick-breaker game whose bricks spell *ganga*.

## Stack

Next.js 16 (App Router) · React 19 · Tailwind CSS 4 · Framer Motion · Lenis · Neon Postgres (`@neondatabase/serverless`)

## Develop

```bash
npm install
# .env.local needs: DATABASE_URL, ADMIN_USERNAME, ADMIN_PASSWORD, ADMIN_SESSION_SECRET
npm run dev        # http://localhost:3000
```

## Ship

Zero-config on Vercel. `npm run build` locally to verify; production deploys from `main`.

*Walk with the river.*
