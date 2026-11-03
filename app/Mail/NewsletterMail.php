<?php

namespace App\Mail;

use App\Models\Subscriber;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NewsletterMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public readonly Subscriber $subscriber,
        public readonly string $newsletterSubject,
        public readonly string $body,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: $this->newsletterSubject,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.newsletter',
            with: [
                'body' => $this->body,
                'unsubscribeUrl' => url('/newsletter/unsubscribe/'.$this->subscriber->token),
            ],
        );
    }
}
