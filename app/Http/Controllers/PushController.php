<?php

namespace App\Http\Controllers;

use App\Services\FirebaseService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PushController extends Controller
{
    public function __construct(private readonly FirebaseService $firebase) {}

    /**
     * Register a device token to FCM topics.
     */
    public function register(Request $request): JsonResponse
    {
        $data = $request->validate([
            'token' => ['required', 'string'],
            'topics' => ['nullable', 'array'],
        ]);

        $topics = $data['topics'] ?? ['breaking'];

        $ok = false;

        if ($this->firebase->isConfigured()) {
            try {
                $messaging = $this->firebase->messaging();
                foreach ($topics as $topic) {
                    $messaging->subscribeToTopic($topic, $data['token']);
                }
                $ok = true;
            } catch (\Throwable $e) {
                report($e);
            }
        }

        return response()->json(['ok' => $ok]);
    }
}
