<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class GoogleAuthController extends Controller
{
    public function redirect(): RedirectResponse
    {
        $query = http_build_query([
            'client_id' => config('services.google.client_id'),
            'redirect_uri' => config('services.google.redirect_uri'),
            'response_type' => 'code',
            'scope' => 'openid email profile',
            'access_type' => 'offline',
            'prompt' => 'consent',
        ]);

        return redirect("https://accounts.google.com/o/oauth2/v2/auth?{$query}");
    }

    public function callback(Request $request): RedirectResponse
    {
        $frontend = env('FRONTEND_URL', 'http://localhost:3000');

        if ($request->has('error')) {
            return redirect("{$frontend}/login?error=".urlencode((string) $request->input('error')));
        }

        $code = $request->input('code');

        if (! $code) {
            return redirect("{$frontend}/login?error=".urlencode('No authorization code received'));
        }

        try {
            $response = Http::asForm()->post('https://oauth2.googleapis.com/token', [
                'code' => $code,
                'client_id' => config('services.google.client_id'),
                'client_secret' => config('services.google.client_secret'),
                'redirect_uri' => config('services.google.redirect_uri'),
                'grant_type' => 'authorization_code',
            ]);

            $tokens = $response->json();

            if (! isset($tokens['id_token'])) {
                throw new \Exception($tokens['error_description'] ?? 'Token exchange failed');
            }

            $payload = $this->decodeJwt($tokens['id_token']);

            $email = $payload['email'] ?? null;
            $name = $payload['name'] ?? 'Reader';
            $avatar = $payload['picture'] ?? null;
            $googleId = $payload['sub'] ?? null;

            if (! $email) {
                throw new \Exception('No email present in Google token');
            }

            $user = User::where('email', $email)->first();

            if (! $user) {
                $user = User::create([
                    'name' => $name,
                    'username' => Str::slug($name).'-'.Str::lower(Str::random(4)),
                    'email' => $email,
                    'password' => bcrypt(Str::random(32)),
                    'role' => 'reader',
                    'firebase_uid' => $googleId,
                    'avatar' => $avatar,
                    'email_verified_at' => now(),
                ]);
            } elseif (! $user->firebase_uid) {
                $user->update([
                    'firebase_uid' => $googleId,
                    'avatar' => $avatar ?: $user->avatar,
                ]);
            }

            $token = $user->createToken('web')->plainTextToken;

            return redirect("{$frontend}/auth/callback?token=".urlencode($token));
        } catch (\Throwable $e) {
            return redirect("{$frontend}/login?error=".urlencode('Google auth failed: '.$e->getMessage()));
        }
    }

    /**
     * Decode the id_token JWT locally (no network call), as recommended to
     * avoid TLS/verifyIdToken failures. The token exchange above already
     * validated the code against Google over HTTPS.
     */
    protected function decodeJwt(string $jwt): array
    {
        $parts = explode('.', $jwt);
        $segment = $parts[1] ?? '';
        $segment = strtr($segment, '-_', '+/');
        $segment = str_pad($segment, strlen($segment) % 4, '=', STR_PAD_RIGHT);

        return json_decode(base64_decode($segment), true) ?? [];
    }
}
