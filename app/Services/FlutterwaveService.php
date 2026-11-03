<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class FlutterwaveService
{
    protected string $baseUrl;

    public function __construct()
    {
        $this->baseUrl = rtrim(config('flutterwave.base_url'), '/');
    }

    public function isConfigured(): bool
    {
        return ! empty(config('flutterwave.secret_key'));
    }

    protected function headers(): array
    {
        return [
            'Authorization' => 'Bearer '.config('flutterwave.secret_key'),
            'Content-Type' => 'application/json',
        ];
    }

    /**
     * Create a recurring payment plan on Flutterwave.
     */
    public function createPlan(string $name, float $amount, string $interval, string $currency = 'NGN'): ?string
    {
        if (! $this->isConfigured()) {
            return null;
        }

        $response = Http::withHeaders($this->headers())
            ->post("{$this->baseUrl}/payment-plans", [
                'amount' => $amount,
                'name' => $name,
                'interval' => $interval === 'yearly' ? 'yearly' : 'monthly',
                'currency' => $currency,
            ]);

        return $response->successful()
            ? data_get($response->json(), 'data.id')
            : null;
    }

    /**
     * Initialize a subscription payment (hosted checkout link).
     */
    public function initiateSubscription(array $data): array
    {
        if (! $this->isConfigured()) {
            return ['status' => 'error', 'message' => 'Flutterwave is not configured.'];
        }

        $response = Http::withHeaders($this->headers())
            ->post("{$this->baseUrl}/payments", $data);

        $json = $response->json();

        if ($response->successful() && $json['status'] === 'success') {
            return [
                'status' => 'success',
                'link' => data_get($json, 'data.link'),
                'data' => data_get($json, 'data'),
            ];
        }

        return [
            'status' => 'error',
            'message' => data_get($json, 'message', 'Unable to initialize payment.'),
        ];
    }

    /**
     * Verify a transaction by id or tx_ref.
     */
    public function verifyTransaction(string $id): array
    {
        if (! $this->isConfigured()) {
            return ['status' => 'error', 'message' => 'Flutterwave is not configured.'];
        }

        $response = Http::withHeaders($this->headers())
            ->get("{$this->baseUrl}/transactions/{$id}/verify");

        return $response->json() ?? [];
    }

    /**
     * Cancel a subscription on Flutterwave.
     */
    public function cancelSubscription(string $subscriptionId): bool
    {
        if (! $this->isConfigured()) {
            return false;
        }

        $response = Http::withHeaders($this->headers())
            ->put("{$this->baseUrl}/subscriptions/{$subscriptionId}/cancel");

        return $response->successful();
    }

    /**
     * Verify an incoming webhook signature.
     */
    public function verifyWebhookSignature(?string $signature): bool
    {
        $secret = config('flutterwave.secret_hash');

        if (empty($secret)) {
            return true;
        }

        return hash_equals($secret, (string) $signature);
    }
}
