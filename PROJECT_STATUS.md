# The Daily Brief — Project Status

**Last updated:** 2026-11-03

A headless digital news publication: **Laravel 12** backend (JSON API + Filament admin) serving a **Next.js 16 + TypeScript + Tailwind** frontend, with **Flutterwave** subscriptions, **Firebase** (push + realtime comments), and **Google OAuth**.

---

## Stack

| Layer | Technology |
|---|---|
| Backend | Laravel 12 (PHP 8.2), MySQL (XAMPP) |
| API auth | Laravel Sanctum (bearer tokens) |
| Admin | Filament v4 |
| Frontend | Next.js 16 (App Router) + TypeScript + Tailwind CSS 4 |
| Payments | Flutterwave (hosted checkout + webhook) |
| Push | Firebase Cloud Messaging (FCM) |
| Realtime | Cloud Firestore (REST writes from backend) |
| Auth | Email/password + Google OAuth (server-side Authorization Code flow) |
| Audio | S3-compatible storage (config ready) + simulated stream fallback |

---

## ✅ Completed

### Backend & Data
- Laravel 12 project scaffolded on PHP 8.2 with MySQL.
- **Migrations** for: users (+ profile/role/OAuth fields), categories (self-referential), articles (+ editorial fields), tags, article_tag, plans (+ tier), subscriptions, transactions, comments, ad_slots, subscribers, bookmarks, audio_broadcasts, broadcast_transcripts, subscriber_audio_tokens.
- **Models & relationships**: User, Category, Article, Tag, Plan, Subscription, Transaction, Comment, AdSlot, Subscriber, Bookmark, AudioBroadcast, BroadcastTranscript, SubscriberAudioToken.
- **Seeders**: CategorySeeder (12 sections + sub-sections), PlanSeeder (3 tiers, removes legacy), StorySeeder (14 curated English Nigerian/world stories with subdecks, key facts, data graphics, co-authors), AudioBroadcastSeeder (Geneva episode + 10 transcript segments + waveform), DatabaseSeeder.
- **ArticleFactory** with clean English filler content.

### JSON API (Sanctum)
- `GET /api/home` — hero, latest wire, rails, editors' picks (edition-filtered).
- `GET /api/articles`, `/api/articles/{slug}`, `/api/categories`, `/api/categories/{slug}`, `/api/search`.
- `POST /api/register|login|logout`, `GET /api/user`, `POST /api/auth/firebase`, `GET /api/auth/google/redirect`, `GET /api/auth/google/callback`.
- `GET /api/plans`, `POST /api/subscribe/{plan}`, `GET /api/account`, `POST /api/subscribe/{subscription}/cancel`.
- `GET/POST /api/articles/{id}/comments`, `POST /api/comments/{id}/react`.
- `GET/POST/DELETE /api/bookmarks`, `GET /api/bookmarks/status`.
- `POST /api/newsletter`, `POST /api/push/register`.
- `GET /api/audio`, `/api/audio/{id}`, `/api/audio/{id}/stream`.
- `POST /api/audio/feed/token` (issue private podcast token), `GET /api/audio/feed/{token}` (authenticated RSS feed).
- `POST /api/flutterwave/webhook`, `GET /flutterwave/callback`.
- `GET /newsletter/unsubscribe/{token}` — deactivates a subscriber.

### Admin Panel (Filament v4)
- 9 resources: **Articles**, **Categories**, **Plans**, **Users**, **Comments** (moderation), **Subscriptions**, **Transactions**, **Ad Slots**, **Subscribers**.
- Article editor: rich text, hero upload, co-authors repeater, key facts, data-graphic JSON, premium/featured/breaking toggles, edition, tags.
- **"Push alert"** action (fires FCM), **"Sync to Flutterwave"** action (plans).
- Dashboard widgets: **StatsOverview** + **Integration status** (shows Flutterwave/Firebase/Google config state).
- Access restricted to admin/editor roles.

### Frontend (Next.js)
- Broadsheet design tokens (paper `#fbf9f6`, ink `#1a1a1a`, accent `#b91c1c`), Playfair Display / Newsreader / Inter.
- **Pages**: home, article detail, category, search, sections, wire, markets & macro terminal, audio hub, plans/membership, login, register, account, saved, auth callback.
- **Home**: masthead, edition picker, breaking ticker, hero + latest wire, editors' picks, section rails.
- **Article detail**: breadcrumbs, byline, action bar (Listen TTS, A−/A+, share, bookmark, gift), drop-cap, quote block, hand-rolled SVG data graphic, key facts, sticky side rail, discussion feed, "Next in World".
- **Mobile**: swipeable category chips, wire feed, opinion carousel, fixed bottom tabs.
- **Editions**: Lagos/International switch persisted via cookie, filters home/category/wire.
- **Membership**: 3 NGN tiers (Digital Reader ₦20k, Audio & Master ₦45k flagship, Sovereign Terminal ₦190k/seat) + audio spec matrix + settlement/TLS section.
- **Audio Hub ("Dispatches & Sound")**: dark "Deep Obsidian" console (telemetry, ON AIR, stream-mode toggle, studio cam, waveform + playhead + chapters, ±15s, speed control, synchronized transcript with active-speaker highlight, clip/copy/bookmark, court-reporter badge), broadcast archive (API-driven), daily lineup, investigative series, private RSS box.
- **Markets & Macro Terminal**: global indices, Nigerian/US yield curves (SVG), currencies, commodities, macro indicators.
- **Saved stories** via bookmarks API; **account** page with subscription + billing.
- Header shows signed-in user + "Sign out" (or Sign in / Subscribe).

### Integrations
- **Flutterwave**: service (create plan, initiate subscription, verify, cancel), webhook signature verification, subscription activation, redirect to frontend.
- **Firebase**: web config + VAPID wired (both `.env` and `frontend/.env.local`), service account JSON, **FCM push verified working**, Firestore writes via **REST** (avoids gRPC hang), realtime comment reads via client `onSnapshot` with MySQL fallback.
- **Google OAuth**: server-side Authorization Code flow (redirect → code exchange → local JWT decode → Sanctum token → frontend callback). Credentials configured; **locked by `AGENTS.md` rule — do not modify**.
- **S3**: disk configured (env-driven) with signed-URL logic + simulated-stream fallback.

### Audio, Newsletter, SEO & Tests (2026-11-03)
- **Private podcast feed**: `POST /api/audio/feed/token` issues a per-user token; `GET /api/audio/feed/{token}` returns an authenticated RSS feed of broadcasts the subscriber can access. The audio hub's "Private RSS" panel now fetches and copies the real feed URL.
- **Audio gating decided**: transcripts and metadata are public; only the master stream is tier-gated. `GET /api/audio/{id}` always returns the transcript plus `locked`/`stream_available`, and `stream` accepts a Sanctum token or the subscriber feed token (`?token=`). S3 assets redirect to a fresh signed URL; otherwise the simulated stream is returned.
- **Newsletter delivery**: `NewsletterWelcomeMail` on signup, `NewsletterMail` + `php artisan newsletter:send "Subject" --file=...` for broadcasts, and a working unsubscribe link. Delivery uses the configured mailer (`MAIL_MAILER=log` by default).
- **Dead Blade cleanup**: removed the unused web Blade controllers/views and the `View::composer`; only API, Filament, email, and audio-feed views remain. Stale `route('article.show')`/`route('category.show')` helpers now point at the Next.js frontend.
- **SEO**: metadata base + title template, canonical URLs, Open Graph/Twitter cards, generated brand and per-article OG images, `NewsArticle` JSON-LD, `robots.txt`, and an API-driven `sitemap.xml`.
- **Automated tests**: 17 backend feature tests covering home/articles, premium locking, audio gating + feed, newsletter + unsubscribe + command, auth, and the root redirect (`php artisan test`).
- **Housekeeping**: split `PushController` into its own PSR-4 file (it previously lived inside `NewsletterController.php` and could not autoload), installed `league/flysystem-aws-s3-v3` so the S3 disk is actually usable.

### Fixes & Housekeeping
- Installed PHP extensions: `zip`, `intl`, `gd`, `sodium`, `grpc`.
- Pinned `google/cloud-firestore` to `^1.54` (compatible with kreait 7.x).
- Fixed React hydration error (client-only date in UtilityBar).
- Fixed `formattedPrice` LogicException (added accessor) — admin Plans table now renders prices.
- Rewrote `README.md` and `.env.example` with all integration keys.
- Added `AGENTS.md` with the Google OAuth "do not modify" rule.
- Storage symlink created; `APP_URL` fixed to `http://localhost:8000`.
- Reseeded with English stories; article images via `picsum.photos` (deterministic real photos).
- Frontend lint now passes with 0 errors; `npm run build` succeeds.

---

## ⏳ Yet To Be Done

### Requires external credentials (yours to provide)
- [ ] **Flutterwave keys** — `FLW_PUBLIC_KEY`, `FLW_SECRET_KEY`, `FLW_ENCRYPTION_KEY`, `FLW_SECRET_HASH` (test mode). Until set, Subscribe shows "not configured".
- [ ] **Newsletter mail provider** — set `MAIL_MAILER=smtp` plus `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD`, `MAIL_FROM_ADDRESS`. The sending code, command, welcome email, and unsubscribe link are done; with the current `MAIL_MAILER=log` they only write to the log.
- [ ] **Real article images** — currently auto-generated `picsum.photos` placeholders; upload real photos via admin → Articles → Media (stored locally, overrides placeholder).
- [ ] **Real audio (FLAC) + S3 bucket** — set `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_DEFAULT_REGION`, `AWS_BUCKET`; upload masters and set `audio_s3_path`. The S3 adapter is installed and signed-URL/redirect logic is wired; until then the master stream is simulated.

### Requires manual console setup
- [ ] **Create the Firestore database** — Firebase console → Build → Firestore Database → Create database. (Backend writes currently return `403 Cloud Firestore API has not been used`.)
- [ ] **Firestore security rules** — allow reads on `articles/{id}/comments`:
  ```
  rules_version = '2';
  service cloud.firestore {
    match /databases/{database}/documents {
      match /articles/{articleId}/comments/{comment} {
        allow read: if true;
        allow write: if false;
      }
    }
  }
  ```
- [ ] **Google Cloud Console redirect URI** — ensure `http://localhost:8000/api/auth/google/callback` is an Authorized redirect URI on the OAuth client (do not change the URI in code).
- [ ] **Subscribe a device to push** — set a real browser/device token so FCM topics have recipients (VAPID + service account already set).

### Not yet implemented / future work
- [ ] **Real payment end-to-end** — completed checkout → webhook → active subscription still needs Flutterwave keys (test card flow exists).
- [ ] **Production deployment** — no deploy target configured (HTTPS, real domain, queue worker, scheduler, `.env` hardening).
- [ ] **PDF transcript download** — the audio hub links "Download .PDF master transcript" to `#`; transcripts are available through the API but no PDF export is generated.
- [ ] **Client-side E2E/browser tests** — backend has feature tests; the `e2e/` folder is not yet wired to a runner.

---

## Current Run State

- **Frontend:** http://localhost:3000
- **API:** http://127.0.0.1:8000/api
- **Admin:** http://127.0.0.1:8000/admin
- **Admin login:** `admin@dailypost.ng` / `password`
- **Reader login:** `reader@dailypost.ng` / `password`
- **DB:** MySQL `dailypost` (seeded)

### Setup check
```bash
php artisan setup:check
```
Reports status of Database, Flutterwave, Firebase (server + web), and Google OAuth.

Current status: **Database ✓ · Firebase server ✓ · Firebase web ✓ · Google OAuth ✓ · Flutterwave ✗ (keys needed)**.
