# The Daily Brief — Agent Rules

## Google OAuth sign-in — CONFIGURED. DO NOT MODIFY.

Google sign-in uses the **server-side Authorization Code flow** and is fully configured
and working. **Never change these settings or files unless explicitly asked by the user.**

- Credentials live in `.env` (gitignored): `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`.
- `GOOGLE_REDIRECT_URI` must be `http://localhost:8000/api/auth/google/callback` and must
  match the "Authorized redirect URIs" in Google Cloud Console **byte-for-byte**
  (no trailing slash, exact scheme/host/port/path). Do not change it.
- Config mapping: `config/services.php` → `services.google`.
- Flow: `GET /api/auth/google/redirect` (routes/api.php) → `App\Http\Controllers\Api\GoogleAuthController`
  → exchanges the code, decodes the id_token locally (no `verifyIdToken`), find-or-creates the user,
  issues a Sanctum token, redirects to the frontend `/auth/callback`.
- Frontend: login page links to the backend redirect; `frontend/app/auth/callback/page.tsx` stores the token.

If Google sign-in breaks, debug against Google Cloud Console config first — do not rewrite the flow
or change the redirect URI.

## Other integration config

- Flutterwave: `FLW_*` in `.env`
- Firebase: `FIREBASE_*` in `.env` + `NEXT_PUBLIC_FIREBASE_*` in `frontend/.env.local`
