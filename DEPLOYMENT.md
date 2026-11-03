# The Daily Brief — Deployment Guide

## Free Deployment Stack (Render + Vercel)

This project is configured for free deployment using:
- **Render** (Free tier) - Laravel backend + PostgreSQL database
- **Vercel** (Free tier) - Next.js frontend

---

## Part 1: Deploy Backend to Render

### 1. Create Render Account
1. Go to [render.com](https://render.com) and sign up
2. Connect your GitHub account
3. Grant access to the `ktobz/The-Daily-Brief` repository

### 2. Deploy the Service
1. In Render dashboard, click **New +**
2. Select **Web Service**
3. Connect to `ktobz/The-Daily-Brief` repository
4. Configure:
   - **Name:** `the-daily-brief-api`
   - **Region:** Oregon (us-west) or Frankfurt (eu-central)
   - **Branch:** `master`
   - **Runtime:** PHP
   - **Build Command:** `composer install --no-dev --optimize-autoloader && php artisan key:generate`
   - **Start Command:** `php artisan serve --host=0.0.0.0 --port=$PORT`
5. **Advanced** → **Add Environment Variables** (from render.yaml or manually):
   ```
   APP_ENV=production
   APP_DEBUG=false
   APP_URL=https://the-daily-brief-api.onrender.com
   DB_CONNECTION=pgsql
   CACHE_DRIVER=file
   SESSION_DRIVER=file
   QUEUE_CONNECTION=database
   FILESYSTEM_DISK=local
   LOG_CHANNEL=errorlog
   FRONTEND_URL=https://the-daily-brief.vercel.app
   GOOGLE_REDIRECT_URI=https://the-daily-brief-api.onrender.com/api/auth/google/callback
   FLW_REDIRECT_URL=https://the-daily-brief-api.onrender.com/flutterwave/callback
   ```
6. Click **Create Web Service**

### 3. Create PostgreSQL Database
1. In Render dashboard, click **New +**
2. Select **PostgreSQL**
3. Configure:
   - **Name:** `the-daily-brief-db`
   - **Database Name:** `the_daily_brief`
   - **User:** `the_daily_brief_user`
   - **Plan:** Free
4. Click **Create Database**

### 4. Connect Database to Web Service
1. Go to your web service (`the-daily-brief-api`)
2. Scroll to **Environment** section
3. Add these database variables (Render will auto-fill):
   ```
   DB_HOST=your-db-host
   DB_PORT=5432
   DB_DATABASE=the_daily_brief
   DB_USERNAME=the_daily_brief_user
   DB_PASSWORD=your-db-password
   ```
4. Scroll to **Internal Connections** section
5. Add your database as an internal connection

### 5. Run Database Migrations
1. Go to your web service dashboard
2. Click **Manual Deploy** → **Deploy latest commit**
3. After deploy, open **Shell** (if available) or SSH
4. Run:
   ```bash
   php artisan migrate --force
   php artisan db:seed --force
   ```

### 6. Add Integration Keys
Add these environment variables in Render dashboard:
```
FLW_PUBLIC_KEY=your_flutterwave_public_key
FLW_SECRET_KEY=your_flutterwave_secret_key
FLW_ENCRYPTION_KEY=your_flutterwave_encryption_key
FLW_SECRET_HASH=your_flutterwave_secret_hash
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
FIREBASE_APP_ID=your_firebase_app_id
FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id
FIREBASE_VAPID_KEY=your_firebase_vapid_key
FIREBASE_DATABASE_URL=your_firebase_database_url
FIREBASE_CREDENTIALS=/path/to/service-account.json
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=your_s3_bucket_name
```

**Note:** For Firebase credentials, you'll need to upload the service-account JSON file to Render and reference its path.

---

## Part 2: Deploy Frontend to Vercel

### 1. Create Vercel Account
1. Go to [vercel.com](https://vercel.com) and sign up
2. Connect your GitHub account
3. Grant access to the `ktobz/The-Daily-Brief` repository

### 2. Import Project
1. In Vercel dashboard, click **Add New Project**
2. Select `ktobz/The-Daily-Brief` repository
3. Configure:
   - **Framework Preset:** Next.js
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`
4. Click **Deploy**

### 3. Add Environment Variables
After initial deploy, go to **Settings** → **Environment Variables** and add:
```
NEXT_PUBLIC_API_URL=https://the-daily-brief-api.onrender.com/api
NEXT_PUBLIC_SITE_URL=https://the-daily-brief.vercel.app
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id
NEXT_PUBLIC_FIREBASE_VAPID_KEY=your_firebase_vapid_key
```

### 4. Redeploy
1. Go to **Deployments** tab
2. Click **Redeploy** to apply environment variables

---

## Part 3: Update CORS Configuration

After deploying, update `config/cors.php` in your repository:

```php
'allowed_origins' => [
    'https://the-daily-brief.vercel.app',
    'http://localhost:3000', // for local development
],
```

Then commit and push:
```bash
git add config/cors.php
git commit -m "Update CORS for production"
git push
```

Render will auto-deploy the changes.

---

## Part 4: Update Google OAuth Redirect URI

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to **APIs & Services** → **Credentials**
3. Find your OAuth 2.0 client
4. Under **Authorized redirect URIs**, add:
   ```
   https://the-daily-brief-api.onrender.com/api/auth/google/callback
   ```
5. Save changes

---

## Part 5: Test the Deployment

### Backend (Render)
- API URL: `https://the-daily-brief-api.onrender.com/api`
- Test: `https://the-daily-brief-api.onrender.com/api/home`
- Admin: `https://the-daily-brief-api.onrender.com/admin`

### Frontend (Vercel)
- Frontend URL: `https://the-daily-brief.vercel.app`
- Test navigation and features

### Integration Tests
1. User registration/login
2. Article browsing
3. Comment posting
4. Subscription flow (if Flutterwave keys added)
5. Google OAuth (if keys added)

---

## Part 6: Set Up Automatic Deployments

### Render
- Render automatically deploys on every push to `master` branch
- Manual deploy available from dashboard

### Vercel
- Vercel automatically deploys on every push to `master` branch
- Preview deployments available for pull requests

---

## Important Notes

### Free Tier Limitations

**Render Free Tier:**
- Spins down after 15 minutes of inactivity
- Cold start takes ~30-60 seconds
- 512MB RAM, 0.1 CPU
- Free PostgreSQL (90 days, then $7/month)
- No custom domains on free tier

**Vercel Free Tier:**
- 100GB bandwidth/month
- Unlimited deployments
- Serverless functions (limited execution time)
- Free custom domains

### Scaling Up
When ready to scale, upgrade to:
- Render Standard ($7/month) for always-on backend
- Render PostgreSQL Standard ($7/month) for production database
- Vercel Pro ($20/month) for additional features

### Monitoring
- Check Render logs for backend errors
- Check Vercel logs for frontend errors
- Set up error tracking (Sentry, Bugsnag) for production

### Security
- Ensure all integration keys are set as environment variables
- Never commit `.env` files
- Use HTTPS everywhere (automatic on Render/Vercel)
- Review security audit report before accepting payments

---

## Troubleshooting

### Backend Issues
- **Migration failed:** Check database connection logs
- **500 errors:** Check Render logs for stack traces
- **Timeouts:** Increase `APP_DEBUG=false` to see errors
- **Database connection:** Verify internal connection in Render

### Frontend Issues
- **API errors:** Check CORS configuration
- **Build failures:** Check Vercel build logs
- **Environment variables:** Ensure all are set in Vercel dashboard

### Integration Issues
- **Flutterwave:** Verify webhook URL matches Render URL
- **Firebase:** Check Firestore security rules
- **Google OAuth:** Verify redirect URI matches exactly

---

## Post-Deployment Checklist

- [ ] Backend deployed to Render
- [ ] Database created and connected
- [ ] Migrations and seeds run
- [ ] Frontend deployed to Vercel
- [ ] Environment variables set on both platforms
- [ ] CORS configuration updated
- [ ] Google OAuth redirect URI updated
- [ ] Test all user flows
- [ ] Test admin panel access
- [ ] Verify SSL certificates (automatic)
- [ ] Set up monitoring/alerts
- [ ] Review security audit findings
- [ ] Add rate limiting (critical security issue)
- [ ] Lock down CORS to specific domains
- [ ] Implement webhook signature verification fix

---

## Support

- Render docs: https://render.com/docs
- Vercel docs: https://vercel.com/docs
- Laravel deployment: https://laravel.com/docs/deployment
- Next.js deployment: https://nextjs.org/docs/deployment
