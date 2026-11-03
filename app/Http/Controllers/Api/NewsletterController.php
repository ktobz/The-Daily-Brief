<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\NewsletterWelcomeMail;
use App\Models\Subscriber;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class NewsletterController extends Controller
{
    public function subscribe(Request $request): JsonResponse
    {
        $data = $request->validate(['email' => ['required', 'email']]);

        $subscriber = Subscriber::firstOrCreate(
            ['email' => $data['email']],
            ['token' => Str::random(40), 'is_active' => true],
        );

        if ($subscriber->wasRecentlyCreated) {
            try {
                Mail::to($subscriber->email)->send(new NewsletterWelcomeMail($subscriber));
            } catch (\Throwable $e) {
                report($e);
            }
        }

        return response()->json(['ok' => true]);
    }
}
