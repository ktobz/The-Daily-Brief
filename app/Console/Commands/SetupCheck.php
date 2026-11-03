<?php

namespace App\Console\Commands;

use App\Services\FirebaseService;
use Illuminate\Console\Command;

class SetupCheck extends Command
{
    protected $signature = 'setup:check';

    protected $description = 'Check Flutterwave, Firebase and database configuration status';

    public function handle(FirebaseService $firebase): int
    {
        $this->newLine();
        $this->info('The Daily Brief — Setup check');
        $this->newLine();

        $this->line('Database:');
        try {
            \Illuminate\Support\Facades\DB::connection()->getPdo();
            $this->line('  <info>✓ MySQL connected</info>');
        } catch (\Throwable $e) {
            $this->line('  <error>✗ MySQL not reachable</error> — check DB_* in .env');
        }

        $this->line('Flutterwave (payments):');
        if (config('flutterwave.secret_key')) {
            $this->line('  <info>✓ Secret key set</info>');
        } else {
            $this->line('  <error>✗ Not configured</error> — set FLW_SECRET_KEY, FLW_PUBLIC_KEY, FLW_ENCRYPTION_KEY, FLW_SECRET_HASH in .env');
        }

        $this->line('Firebase (server — Firestore/FCM):');
        if ($firebase->isConfigured()) {
            $this->line('  <info>✓ Service account loaded</info>');
        } else {
            $this->line('  <error>✗ Not configured</error> — set FIREBASE_CREDENTIALS to an absolute path of your service-account JSON');
        }

        $this->line('Firebase (web — client SDK):');
        if (config('firebase.api_key')) {
            $this->line('  <info>✓ Web API key set</info>');
        } else {
            $this->line('  <error>✗ Not configured</error> — set FIREBASE_API_KEY + NEXT_PUBLIC_FIREBASE_* in frontend/.env.local');
        }

        $this->line('Google OAuth (sign-in):');
        if (config('services.google.client_id') && config('services.google.client_secret')) {
            $this->line('  <info>✓ Client ID + secret set</info>');
        } else {
            $this->line('  <error>✗ Not configured</error> — set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env, and add '.config('services.google.redirect_uri').' to Google Cloud Console');
        }

        $this->newLine();
        $this->line('Until keys are set, the app degrades gracefully: comments use the MySQL fallback, and subscribe/Google sign-in show a "not configured" message.');
        $this->newLine();

        return self::SUCCESS;
    }
}
