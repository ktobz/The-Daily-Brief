# The Daily Brief — E2E tests (Selenium)

End-to-end browser verification for The Daily Brief. Drives the real app
(public pages, auth, paywall, comments, admin) and asserts each works.

## Prerequisites

Both servers must be running:

```bash
# Laravel backend
cd "laravel news" && php artisan serve        # http://localhost:8000

# Next.js frontend
cd "laravel news/frontend" && npm run dev      # http://localhost:3000
```

The database must be seeded (`php artisan migrate:fresh --seed`).

## Install & run

```bash
cd e2e
npm install

npm run e2e            # visible Chrome window
npm run e2e:headless   # headless (CI)
```

Chrome is required. The matching chromedriver is fetched automatically by
Selenium Manager (no manual download).

## Configuration

Override URLs with environment variables:

```bash
FE_URL=http://localhost:3000 ADMIN_URL=http://localhost:8000/admin npm run e2e
```

## What it checks

1. Public pages render (`/`, `/plans`, `/audio`, `/markets`, `/wire`, `/category/world`, `/sections`)
2. Search returns results
3. Edition toggle (Lagos → International → Lagos lead changes)
4. Register a throwaway user → header shows the name
5. Login as `reader@dailypost.ng`
6. Premium paywall shown to guests
7. Posting a comment renders
8. Admin `Plans` table shows the 3 tiers + `₦` prices (validates `formattedPrice`); `Articles` list loads
9. Plans page exposes Subscribe actions
10. Google button redirects to `accounts.google.com`

Screenshots are written to `e2e/screenshots/` on any failure.

## Not automated (by design)

Selenium cannot reliably automate: completing Google OAuth, completing a real
Flutterwave payment, or the Firebase/Flutterwave **consoles** (2FA + bot
detection). Those require manual setup.
