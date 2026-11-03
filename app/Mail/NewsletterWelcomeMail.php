<?php

namespace App\Mail;

use App\Models\Subscriber;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NewsletterWelcomeMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public readonly Subscriber $subscriber) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Welcome to The Daily Brief',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.newsletter-welcome',
            with: [
                'unsubscribeUrl' => url('/newsletter/unsubscribe/'.$this->subscriber->token),
            ],
        );
    }
}
