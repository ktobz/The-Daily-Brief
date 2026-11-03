# The Daily Brief — Full-Stack News Publication

A headless digital news publication. A **Laravel** backend (JSON API + admin) powers a **Next.js + TypeScript + Tailwind** editorial frontend, with **Flutterwave** subscriptions (premium paywall) and **Firebase** (realtime comments + push notifications + Google sign-in).

## Architecture

```
laravel news/            Laravel 12 backend
├── routes/api.php       Sanctum-protected JSON API
├── routes/web.php       Flutterwave callback, podcast RSS, unsubscribe, placeholders
├── app/Http/Controllers/Api/*   API controllers
├── app/Models/*                 Eloquent models (Article, Plan, Subscription, Bookmark, …)
├── app/Services/*               FlutterwaveService, FirebaseService
├── app/Mail/*                   Newsletter mailables
├── app/Console/Commands/*       newsletter:send
└── resources/views/*            Email, audio feed, and Filament views

laravel news/frontend/   Next.js 16 + TS + Tailwind frontend ("The Daily Brief")
├── app/*                Pages (home, article/[slug], category/[slug], search, plans, account, saved, sections, auth)
├── components/*         Editorial components (masthead, ticker, article detail, side rail, discussion, mobile tabs)
├── app/sitemap.ts       Sitemap generated from the articles/categories API
├── app/robots.ts        Crawler rules
├── app/opengraph-image.tsx          Brand social card
├── app/article/[slug]/opengraph-image.tsx   Per-article social card
└── lib/*                API client, auth context, Firebase client, types
```

## Prerequisites

- PHP 8.2+, Composer, MySQL (XAMPP), Node 18+

## Backend (Laravel) — run

```bash
# in `laravel news/`
copy .env.example .env   # then set DB_* credentials
php artisan key:generate
php artisan migrate --seed
php artisan serve        # http://127.0.0.1:8000
```

Default admin: `admin@dailypost.ng` / `password`

### Environment keys (.env)

```
DB_CONNECTION=mysql
DB_DATABASE=dailypost

FLW_PUBLIC_KEY=          # Flutterwave dashboard
FLW_SECRET_KEY=
FLW_ENCRYPTION_KEY=
FLW_SECRET_HASH=

FIREBASE_API_KEY=        # Firebase console (same project as frontend)
FIREBASE_CREDENTIALS=    # absolute path to service-account JSON

# Newsletter delivery (leave MAIL_MAILER=log to write emails to the log instead)
MAIL_MAILER=smtp
MAIL_HOST=
MAIL_PORT=587
MAIL_USERNAME=
MAIL_PASSWORD=
MAIL_FROM_ADDRESS=hello@dailybrief.ng

# Optional audio master storage (without these the stream is simulated)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=
```

Send a newsletter to every active subscriber:

```bash
php artisan newsletter:send "Morning edition" --file=storage/newsletter.html
```

Subscribers receive a welcome email on signup, and every email includes an unsubscribe link.

## Frontend (Next.js) — run

```bash
# in `frontend/`
npm install
npm run dev             # http://localhost:3000
```

### Environment keys (`frontend/.env.local`)

```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000   # canonical URLs, sitemap, social cards
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_VAPID_KEY=
# … plus authDomain, projectId, storageBucket, messagingSenderId, appId
```

## API summary

- `GET /api/home`, `GET /api/articles`, `GET /api/articles/{slug}`, `GET /api/categories`, `GET /api/search`
- `POST /api/register|login|logout`, `GET /api/user`, `POST /api/auth/firebase`
- `GET /api/plans`, `POST /api/subscribe/{plan}`, `GET /api/account`
- `GET/POST /api/articles/{id}/comments`, `POST /api/comments/{id}/react`
- `GET/POST/DELETE /api/bookmarks`, `POST /api/newsletter`, `POST /api/push/register`
- `GET /api/audio`, `GET /api/audio/{id}`, `GET /api/audio/{id}/stream`
- `GET /api/audio/feed/{token}` (private RSS), `POST /api/audio/feed/token` (authenticated)
- `POST /api/flutterwave/webhook` (server-to-server)

## Features

- Broadsheet editorial design (paper `#fbf9f6`, ink `#1a1a1a`, accent `#b91c1c`)
- Article detail: drop-cap, quote block, inline data graphic (hand-rolled SVG), sticky side rail, key facts, listen (TTS), font resize, bookmarks, gifting
- Mobile: swipeable category chips, rapid wire feed, opinion carousel, fixed bottom tabs
- Hard paywall for premium stories (Flutterwave subscriptions)
- Realtime comments (Firestore) with MySQL fallback + FCM push + Google sign-in
- Audio hub: public transcripts, tier-gated master streams, private podcast RSS feed
- Newsletter delivery via `newsletter:send` with unsubscribe handling
- SEO: canonical metadata, Open Graph/Twitter cards, JSON-LD, generated OG images, sitemap, robots
- Backend test suite (17 feature tests)

## Tests

```bash
php artisan test
```