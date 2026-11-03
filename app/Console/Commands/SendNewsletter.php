<?php

namespace App\Console\Commands;

use App\Mail\NewsletterMail;
use App\Models\Subscriber;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class SendNewsletter extends Command
{
    protected $signature = 'newsletter:send
        {subject : The email subject line}
        {body? : Plain HTML body to send}
        {--file= : Read the HTML body from a file instead}
        {--test= : Send only to this email address instead of every active subscriber}';

    protected $description = 'Send a newsletter to all active subscribers';

    public function handle(): int
    {
        $body = $this->option('file')
            ? @file_get_contents($this->option('file'))
            : $this->argument('body');

        if (! is_string($body) || trim($body) === '') {
            $this->error('Provide a newsletter body argument or a readable --file.');

            return self::FAILURE;
        }

        $subscribers = $this->option('test')
            ? Subscriber::where('email', $this->option('test'))->get()
            : Subscriber::where('is_active', true)->get();

        if ($subscribers->isEmpty()) {
            $this->warn('No matching active subscribers.');

            return self::SUCCESS;
        }

        $sent = 0;
        $failed = 0;

        foreach ($subscribers as $subscriber) {
            try {
                Mail::to($subscriber->email)->send(
                    new NewsletterMail($subscriber, $this->argument('subject'), $body)
                );
                $sent++;
            } catch (\Throwable $e) {
                $failed++;
                report($e);
            }
        }

        $this->info("Sent {$sent} newsletter(s); {$failed} failed.");

        return $failed > 0 ? self::FAILURE : self::SUCCESS;
    }
}
