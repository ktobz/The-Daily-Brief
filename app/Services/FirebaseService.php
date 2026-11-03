<?php

namespace App\Services;

use Kreait\Firebase\Contract\Auth as FirebaseAuthContract;
use Kreait\Firebase\Factory;
use Kreait\Firebase\Contract\Firestore;
use Kreait\Firebase\Contract\Messaging;

class FirebaseService
{
    protected ?Factory $factory = null;

    protected function factory(): ?Factory
    {
        if ($this->factory) {
            return $this->factory;
        }

        $path = config('firebase.service_account');

        if (empty($path) || ! is_file($path)) {
            return null;
        }

        return $this->factory = (new Factory())->withServiceAccount($path);
    }

    public function isConfigured(): bool
    {
        return $this->factory() !== null;
    }

    public function firestore(): ?Firestore
    {
        return $this->factory()?->createFirestore();
    }

    public function messaging(): ?Messaging
    {
        return $this->factory()?->createMessaging();
    }

    public function auth(): ?FirebaseAuthContract
    {
        return $this->factory()?->createAuth();
    }

    /**
     * Write a comment document to Firestore via the REST API (avoids the
     * native gRPC transport, which can hang on restricted networks).
     */
    public function writeComment(string $articleId, string $commentId, array $data): bool
    {
        return $this->restWrite("articles/{$articleId}/comments/{$commentId}", $data);
    }

    /**
     * Update a comment's reactions count in Firestore via REST.
     */
    public function updateCommentReactions(string $articleId, string $commentId, int $reactions): bool
    {
        return $this->restWrite("articles/{$articleId}/comments/{$commentId}", ['reactions' => $reactions]);
    }

    /**
     * Write (create/merge) a document to Firestore over the REST v1 API.
     */
    protected function restWrite(string $documentPath, array $fields): bool
    {
        $token = $this->accessToken();

        if (! $token || ! config('firebase.project_id')) {
            return false;
        }

        try {
            $project = config('firebase.project_id');
            $url = "https://firestore.googleapis.com/v1/projects/{$project}/databases/(default)/documents/{$documentPath}";

            $response = \Illuminate\Support\Facades\Http::withToken($token)
                ->withHeaders(['Content-Type' => 'application/json'])
                ->patch($url, ['fields' => $this->mapFields($fields)]);

            return $response->successful();
        } catch (\Throwable $e) {
            report($e);

            return false;
        }
    }

    /**
     * Fetch a short-lived OAuth access token from the service account.
     */
    protected function accessToken(): ?string
    {
        try {
            $json = json_decode(file_get_contents(config('firebase.service_account')), true);

            if (! is_array($json)) {
                return null;
            }

            $credentials = new \Google\Auth\Credentials\ServiceAccountCredentials(
                'https://www.googleapis.com/auth/cloud-platform',
                $json
            );

            $token = $credentials->fetchAuthToken(\Google\Auth\HttpHandler\HttpHandlerFactory::build());

            return $token['access_token'] ?? null;
        } catch (\Throwable $e) {
            report($e);

            return null;
        }
    }

    /**
     * Convert plain values into Firestore REST "fields" typed values.
     */
    protected function mapFields(array $fields): array
    {
        $mapped = [];

        foreach ($fields as $key => $value) {
            if (is_int($value)) {
                $mapped[$key] = ['integerValue' => (string) $value];
            } elseif (is_float($value)) {
                $mapped[$key] = ['doubleValue' => $value];
            } elseif (is_bool($value)) {
                $mapped[$key] = ['booleanValue' => $value];
            } elseif (is_null($value)) {
                $mapped[$key] = ['nullValue' => null];
            } else {
                $mapped[$key] = ['stringValue' => (string) $value];
            }
        }

        return $mapped;
    }

    /**
     * Send a data/notification message to an FCM topic.
     */
    public function sendToTopic(string $topic, string $title, string $body, string $url = '/'): bool
    {
        $messaging = $this->messaging();

        if (! $messaging) {
            return false;
        }

        try {
            $message = \Kreait\Firebase\Messaging\CloudMessage::withTarget('topic', $topic)
                ->withNotification([
                    'title' => $title,
                    'body' => $body,
                ])
                ->withData([
                    'click_action' => 'FLUTTER_NOTIFICATION_CLICK',
                    'url' => $url,
                ]);

            $messaging->send($message);

            return true;
        } catch (\Throwable $e) {
            report($e);

            return false;
        }
    }
}
