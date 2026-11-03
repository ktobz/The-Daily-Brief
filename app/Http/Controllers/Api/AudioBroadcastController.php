<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AudioBroadcast;
use App\Models\SubscriberAudioToken;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Str;

class AudioBroadcastController extends Controller
{
    public function index(): JsonResponse
    {
        $broadcasts = AudioBroadcast::query()
            ->orderByDesc('published_at')
            ->get()
            ->map(fn ($b) => [
                'id' => $b->id,
                'title' => $b->title,
                'slug' => $b->slug,
                'episode_number' => $b->episode_number,
                'dek' => $b->dek,
                'duration_seconds' => $b->duration_seconds,
                'tier' => $b->tier,
                'audio_format' => $b->audio_format,
                'is_live_wire' => $b->is_live_wire,
                'published_at' => optional($b->published_at)->toIso8601String(),
            ]);

        return response()->json(['data' => $broadcasts]);
    }

    public function show(Request $request, string $id): JsonResponse
    {
        $broadcast = AudioBroadcast::with('transcripts')->findOrFail($id);

        $user = $this->resolveUser($request);
        $hasAccess = $this->canAccess($user, $broadcast);

        return response()->json([
            'id' => $broadcast->id,
            'title' => $broadcast->title,
            'slug' => $broadcast->slug,
            'episode_number' => $broadcast->episode_number,
            'dek' => $broadcast->dek,
            'duration_seconds' => $broadcast->duration_seconds,
            'stream_url' => $hasAccess ? $this->streamUrl($broadcast, $user) : null,
            'stream_available' => $hasAccess,
            'locked' => ! $hasAccess,
            'required_tier' => $broadcast->tier,
            'waveform_peaks' => $broadcast->waveform_peaks ?? [],
            'audio_format' => $broadcast->audio_format,
            'tier' => $broadcast->tier,
            'is_live_wire' => $broadcast->is_live_wire,
            'published_at' => optional($broadcast->published_at)->toIso8601String(),
            'transcripts' => $broadcast->transcripts->map(fn ($t) => [
                'id' => $t->id,
                'speaker_name' => $t->speaker_name,
                'speaker_title' => $t->speaker_title,
                'start_second' => $t->start_second,
                'end_second' => $t->end_second,
                'content' => $t->content,
                'is_key_quote' => $t->is_key_quote,
            ]),
        ]);
    }

    /**
     * Stream the master audio. Free broadcasts are public; paid tiers require
     * either a Sanctum bearer token or a subscriber feed token query parameter.
     */
    public function stream(Request $request, string $id): Response|RedirectResponse
    {
        $broadcast = AudioBroadcast::findOrFail($id);

        $user = $this->resolveUser($request);

        if (! $this->canAccess($user, $broadcast)) {
            abort(403, 'Subscribed membership required for master acoustic access.');
        }

        if ($this->hasS3Asset($broadcast)) {
            return redirect()->away($broadcast->secure_stream_url);
        }

        return response('', 200)
            ->header('Content-Type', 'audio/flac')
            ->header('Cache-Control', 'private, max-age=0, no-store');
    }

    /**
     * Issue (or return) the authenticated podcast feed token for the user.
     */
    public function feedToken(Request $request): JsonResponse
    {
        $user = $request->user();

        abort_unless(
            $user->isAdmin() || $user->hasActiveSubscription(),
            403,
            'An active subscription is required for the private podcast feed.'
        );

        $token = SubscriberAudioToken::firstOrCreate(
            ['user_id' => $user->id],
            ['token' => Str::random(48)],
        );

        return response()->json([
            'token' => $token->token,
            'feed_url' => url('/api/audio/feed/'.$token->token),
        ]);
    }

    /**
     * Authenticated RSS feed for podcast apps. The token is embedded in the URL
     * because podcast clients cannot send an Authorization header.
     */
    public function feed(string $token): Response
    {
        $feedToken = SubscriberAudioToken::where('token', $token)->firstOrFail();
        $user = $feedToken->user;

        abort_unless(
            $user && ($user->isAdmin() || $user->hasActiveSubscription()),
            403,
            'This podcast feed is not active.'
        );

        $feedToken->forceFill(['last_accessed_at' => now()])->save();

        $broadcasts = AudioBroadcast::query()
            ->orderByDesc('published_at')
            ->get()
            ->filter(fn (AudioBroadcast $broadcast) => $this->canAccess($user, $broadcast));

        return response()
            ->view('audio.feed', [
                'token' => $feedToken->token,
                'broadcasts' => $broadcasts,
                'streamUrl' => fn (AudioBroadcast $broadcast) => $this->streamUrl($broadcast, $user),
            ])
            ->header('Content-Type', 'application/rss+xml; charset=UTF-8')
            ->header('Cache-Control', 'private, max-age=0, no-store');
    }

    private function resolveUser(Request $request): ?User
    {
        if ($user = $request->user('sanctum')) {
            return $user;
        }

        $token = $request->query('token');

        if (is_string($token) && $token !== '') {
            return SubscriberAudioToken::where('token', $token)->first()?->user;
        }

        return null;
    }

    private function canAccess(?User $user, AudioBroadcast $broadcast): bool
    {
        if ($broadcast->tier === 'free') {
            return true;
        }

        if (! $user) {
            return false;
        }

        return $user->isAdmin() || $user->hasActiveSubscriptionTier($broadcast->tier);
    }

    private function streamUrl(AudioBroadcast $broadcast, ?User $user): string
    {
        if ($this->hasS3Asset($broadcast)) {
            return $broadcast->secure_stream_url;
        }

        $url = url('/api/audio/'.$broadcast->id.'/stream');

        if ($broadcast->tier !== 'free' && $user) {
            $token = SubscriberAudioToken::firstOrCreate(
                ['user_id' => $user->id],
                ['token' => Str::random(48)],
            );

            $url .= '?token='.$token->token;
        }

        return $url;
    }

    private function hasS3Asset(AudioBroadcast $broadcast): bool
    {
        return $broadcast->audio_s3_path
            && config('filesystems.disks.s3.bucket')
            && config('filesystems.disks.s3.key')
            && class_exists(\League\Flysystem\AwsS3V3\AwsS3V3Adapter::class);
    }
}
