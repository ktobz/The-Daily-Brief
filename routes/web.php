<?php

use App\Http\Controllers\FlutterwaveController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| The public frontend lives in the Next.js app ("The Daily Brief").
| Laravel serves only the JSON API (routes/api.php) and the admin panel.
|
*/

Route::get('/', function () {
    return redirect(env('FRONTEND_URL', 'http://localhost:3000'));
});

Route::get('/img/{w}/{h}', function (int $w, int $h) {
    $w = min(max($w, 200), 1600);
    $h = min(max($h, 150), 1200);

    $text = (string) request('text', 'The Daily Brief');
    $text = mb_substr(htmlspecialchars($text, ENT_QUOTES, 'UTF-8'), 0, 60);

    $fontSize = (int) round($h * 0.075);

    $svg = <<<SVG
<svg xmlns="http://www.w3.org/2000/svg" width="$w" height="$h" viewBox="0 0 $w $h">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#1a1a1a"/>
      <stop offset="1" stop-color="#2a2119"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg)"/>
  <rect width="100%" height="8" fill="#b91c1c"/>
  <text x="50%" y="48%" fill="#f5f3f0" font-family="Georgia, 'Times New Roman', serif" font-size="$fontSize" font-weight="bold" text-anchor="middle" dominant-baseline="middle">$text</text>
  <text x="50%" y="88%" fill="#b91c1c" font-family="Arial, sans-serif" font-size="12" letter-spacing="5" text-anchor="middle">THE DAILY BRIEF</text>
</svg>
SVG;

    return response($svg, 200)
        ->header('Content-Type', 'image/svg+xml')
        ->header('Cache-Control', 'public, max-age=86400');
})->name('placeholder.image');

Route::get('/newsletter/unsubscribe/{token}', function (string $token) {
    $subscriber = \App\Models\Subscriber::where('token', $token)->first();

    if ($subscriber) {
        $subscriber->update(['is_active' => false]);
    }

    return response(
        '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>Unsubscribed</title></head>'
        .'<body style="font-family:Georgia,serif;max-width:40rem;margin:4rem auto;padding:0 1.5rem;color:#1a1a1a;">'
        .'<p style="font-family:Arial,sans-serif;font-size:11px;letter-spacing:4px;color:#b91c1c;">THE DAILY BRIEF</p>'
        .'<h1>You have been unsubscribed.</h1>'
        .'<p>You will no longer receive newsletter emails from The Daily Brief.</p>'
        .'</body></html>',
        200
    )->header('Content-Type', 'text/html');
})->name('newsletter.unsubscribe');

Route::get('/firebase-config.js', function () {
    $config = [
        'apiKey' => config('firebase.api_key'),
        'authDomain' => config('firebase.auth_domain'),
        'projectId' => config('firebase.project_id'),
        'storageBucket' => config('firebase.storage_bucket'),
        'messagingSenderId' => config('firebase.messaging_sender_id'),
        'appId' => config('firebase.app_id'),
        'measurementId' => config('firebase.measurement_id'),
        'vapidKey' => config('firebase.vapid_key'),
    ];

    return response('self.FIREBASE_CONFIG = '.json_encode($config).';', 200)
        ->header('Content-Type', 'application/javascript');
})->name('firebase.config');

Route::post('/flutterwave/webhook', [FlutterwaveController::class, 'webhook'])
    ->withoutMiddleware([\Illuminate\Foundation\Http\Middleware\VerifyCsrfToken::class])
    ->name('flutterwave.webhook');

Route::get('/flutterwave/callback', [FlutterwaveController::class, 'callback'])->name('flutterwave.callback');
