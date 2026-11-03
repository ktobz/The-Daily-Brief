<?php

namespace Tests\Feature;

use App\Mail\NewsletterMail;
use App\Mail\NewsletterWelcomeMail;
use App\Models\Subscriber;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class NewsletterApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_subscribing_stores_the_email_and_sends_a_welcome_message(): void
    {
        Mail::fake();

        $this->postJson('/api/newsletter', ['email' => 'reader@example.com'])
            ->assertOk()
            ->assertJson(['ok' => true]);

        $this->assertDatabaseHas('subscribers', [
            'email' => 'reader@example.com',
            'is_active' => true,
        ]);

        Mail::assertSent(NewsletterWelcomeMail::class, function (NewsletterWelcomeMail $mail) {
            return $mail->subscriber->email === 'reader@example.com';
        });
    }

    public function test_duplicate_subscriptions_do_not_send_again(): void
    {
        Mail::fake();

        $this->postJson('/api/newsletter', ['email' => 'reader@example.com'])->assertOk();
        $this->postJson('/api/newsletter', ['email' => 'reader@example.com'])->assertOk();

        Mail::assertSent(NewsletterWelcomeMail::class, 1);
    }

    public function test_unsubscribe_link_deactivates_the_subscriber(): void
    {
        $subscriber = Subscriber::create([
            'email' => 'reader@example.com',
            'token' => 'test-unsubscribe-token',
            'is_active' => true,
        ]);

        $this->get('/newsletter/unsubscribe/'.$subscriber->token)
            ->assertOk()
            ->assertSee('You have been unsubscribed');

        $this->assertFalse($subscriber->fresh()->is_active);
    }

    public function test_newsletter_command_sends_to_active_subscribers(): void
    {
        Mail::fake();

        Subscriber::create(['email' => 'active@example.com', 'token' => 'a', 'is_active' => true]);
        Subscriber::create(['email' => 'inactive@example.com', 'token' => 'b', 'is_active' => false]);

        $this->artisan('newsletter:send', [
            'subject' => 'Morning edition',
            'body' => '<p>Top stories today.</p>',
        ])->assertSuccessful();

        Mail::assertSent(NewsletterMail::class, 1);
        Mail::assertSent(NewsletterMail::class, function (NewsletterMail $mail) {
            return $mail->subscriber->email === 'active@example.com'
                && $mail->newsletterSubject === 'Morning edition';
        });
    }
}
