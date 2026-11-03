<?php

namespace Tests\Feature;

use App\Models\AudioBroadcast;
use App\Models\Plan;
use App\Models\Subscription;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AudioApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_free_broadcast_exposes_transcript_and_stream(): void
    {
        $broadcast = $this->makeBroadcast(['tier' => 'free']);

        $this->getJson('/api/audio/'.$broadcast->id)
            ->assertOk()
            ->assertJsonPath('locked', false)
            ->assertJsonPath('stream_available', true)
            ->assertJsonCount(2, 'transcripts');
    }

    public function test_paid_transcript_is_public_but_stream_is_locked_for_guests(): void
    {
        $broadcast = $this->makeBroadcast(['tier' => 'audio_master']);

        $this->getJson('/api/audio/'.$broadcast->id)
            ->assertOk()
            ->assertJsonPath('locked', true)
            ->assertJsonPath('stream_url', null)
            ->assertJsonCount(2, 'transcripts');

        $this->getJson('/api/audio/'.$broadcast->id.'/stream')->assertForbidden();
    }

    public function test_subscriber_can_stream_and_request_a_private_feed(): void
    {
        $user = $this->makeSubscriber('audio_master');
        Sanctum::actingAs($user);

        $broadcast = $this->makeBroadcast(['tier' => 'audio_master']);

        $this->getJson('/api/audio/'.$broadcast->id)
            ->assertOk()
            ->assertJsonPath('locked', false)
            ->assertJsonPath('stream_available', true);

        $this->get('/api/audio/'.$broadcast->id.'/stream')->assertOk();

        $token = $this->postJson('/api/audio/feed/token')
            ->assertOk()
            ->json('token');

        $this->get('/api/audio/feed/'.$token)
            ->assertOk()
            ->assertHeader('Content-Type', 'application/rss+xml; charset=UTF-8')
            ->assertSee($broadcast->title);
    }

    public function test_feed_token_requires_an_active_subscription(): void
    {
        Sanctum::actingAs(User::factory()->create(['role' => 'reader']));

        $this->postJson('/api/audio/feed/token')->assertForbidden();
    }

    private function makeSubscriber(string $tier): User
    {
        $user = User::factory()->create(['role' => 'reader']);

        $plan = Plan::create([
            'name' => ucfirst(str_replace('_', ' ', $tier)),
            'slug' => $tier.'-plan',
            'price' => 20000,
            'currency' => 'NGN',
            'interval' => 'monthly',
            'tier' => $tier,
        ]);

        Subscription::create([
            'user_id' => $user->id,
            'plan_id' => $plan->id,
            'status' => 'active',
            'starts_at' => now()->subDay(),
            'ends_at' => now()->addMonth(),
        ]);

        return $user;
    }

    private function makeBroadcast(array $attributes = []): AudioBroadcast
    {
        $broadcast = AudioBroadcast::create(array_merge([
            'title' => 'The Geneva Accord',
            'slug' => 'the-geneva-accord',
            'episode_number' => 1,
            'dek' => 'Inside the negotiation.',
            'duration_seconds' => 600,
            'tier' => 'audio_master',
            'published_at' => now(),
        ], $attributes));

        $broadcast->transcripts()->createMany([
            [
                'speaker_name' => 'Amara Okafor',
                'speaker_title' => 'Host',
                'start_second' => 0,
                'end_second' => 30,
                'content' => 'Welcome to Dispatches and Sound.',
                'sequence_order' => 1,
            ],
            [
                'speaker_name' => 'Marcus Sterling',
                'speaker_title' => 'Markets Editor',
                'start_second' => 30,
                'end_second' => 90,
                'content' => 'Credit markets repriced quickly.',
                'sequence_order' => 2,
            ],
        ]);

        return $broadcast;
    }
}
