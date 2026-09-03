SMARTCART — Next.js + PostgreSQL
=================================

A production-ready fullstack port of the SMARTCART Vite storefront
(https://github.com/joycinfobd-prog/SMARTCART.COM and smartcartbd).

Features
--------
* Daraz-style mobile product grid (2 columns) + hero slider (auto-rotating).
* Mobile bottom tab bar (Home / Wishlist / Cart / Support / Account).
* Floating WhatsApp chat + in-app Customer Support modal (customers & guests
  can open tickets without logging in; staff with role `support` / `admin` /
  `moderator` can reply from the same modal).
* Server API routes (`/api/sync`, `/api/orders`, `/api/orders/[id]`,
  `/api/chat`, `/api/health`) backed by PostgreSQL via Drizzle ORM.
* Automatic in-memory fallback — the storefront works even before you attach
  a database (data resets on cold start, but cart/wishlist/account stay in
  the visitor's browser localStorage).
* Seeded with 36 products, 3 demo orders, 6 users, support tickets & reviews.

Deploy to Vercel (recommended)
------------------------------
1. Push this folder to a GitHub repo (or drag-and-drop the zip on Vercel).
2. In Vercel dashboard:
   * **Framework** → Next.js (auto-detected).
   * **Build Command** → `npm run build` (auto-detected).
   * Go to **Storage → Create Database → Postgres (Neon)** and attach it.
     Vercel will auto-set the `DATABASE_URL` env var.
   * Redeploy.
3. The very first request to `/api/sync` automatically creates + seeds the
   database (you don't need to run `drizzle-kit push` on Vercel; it is only
   needed for local Postgres).
4. The live site will persist products, orders, users, chats, and support
   tickets across cold starts.
   * Staff logins (admin / moderator / support) are created inside the
     Admin Panel once you sign in with phone `01794608874` (admin).

Local development
-----------------
    npm install
    cp .env.example .env        # set DATABASE_URL if you want local Postgres
    npm run dev                 # http://localhost:3000

If `.env` does not exist, the app starts in in-memory mode and still works.

Admin / Staff login (demo)
--------------------------
* Phone: **01794608874**  → Admin (full control)
* Support & moderator accounts are in `src/data/mockUsers.ts`.

WhatsApp hotline
----------------
Official number shown in the site (configurable via the Admin Panel under
Store Settings): **01794608874**.
