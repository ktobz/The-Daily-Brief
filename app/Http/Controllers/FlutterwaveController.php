<?php

namespace App\Http\Controllers;

use App\Models\Subscription;
use App\Models\Transaction;
use App\Services\FlutterwaveService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class FlutterwaveController extends Controller
{
    public function __construct(private readonly FlutterwaveService $flutterwave) {}

    /**
     * Flutterwave server-to-server webhook.
     */
    public function webhook(Request $request): JsonResponse
    {
        $signature = $request->header('verif-hash');

        if (! $this->flutterwave->verifyWebhookSignature($signature)) {
            Log::warning('Flutterwave webhook signature mismatch.');

            return response()->json(['status' => 'error'], 401);
        }

        $payload = $request->all();
        $event = data_get($payload, 'event');
        $data = data_get($payload, 'data', []);

        Log::info('Flutterwave webhook received', ['event' => $event, 'tx_ref' => data_get($data, 'tx_ref')]);

        $txRef = data_get($data, 'tx_ref');

        if ($txRef) {
            $this->activateFromWebhook($txRef, $data, $event);
        }

        return response()->json(['status' => 'success']);
    }

    /**
     * Redirect callback after hosted checkout.
     */
    public function callback(Request $request): RedirectResponse
    {
        $status = $request->input('status');
        $txRef = $request->input('tx_ref');
        $transactionId = $request->input('transaction_id');
        $frontend = env('FRONTEND_URL', 'http://localhost:3000');

        if ($status === 'successful' || $status === 'success') {
            if ($transactionId) {
                $verification = $this->flutterwave->verifyTransaction((string) $transactionId);
                $this->activateFromWebhook($txRef, $verification['data'] ?? [], 'charge.completed');
            } else {
                $this->activateFromWebhook($txRef, [], 'charge.completed');
            }

            return redirect("{$frontend}/account");
        }

        return redirect("{$frontend}/plans");
    }

    protected function activateFromWebhook(?string $txRef, array $data, string $event): void
    {
        if (! $txRef) {
            return;
        }

        $transaction = Transaction::where('reference', $txRef)->first();

        if ($transaction) {
            $transaction->update([
                'flutterwave_ref' => data_get($data, 'flw_ref'),
                'status' => data_get($data, 'status', 'successful'),
                'payload' => $data,
            ]);
        }

        $subscription = $transaction?->subscription;

        if ($event === 'charge.completed') {
            $status = data_get($data, 'status', 'successful');

            if ($subscription && $status === 'successful') {
                $subscription->update([
                    'status' => 'active',
                    'flutterwave_subscription_id' => (string) (data_get($data, 'subscription_id') ?: data_get($data, 'id')),
                    'starts_at' => $subscription->starts_at ?? now(),
                    'ends_at' => $this->computeEndDate($subscription),
                    'cancelled_at' => null,
                ]);
            }
        }

        if ($event === 'subscription.cancelled' && $subscription) {
            $subscription->update([
                'status' => 'cancelled',
                'cancelled_at' => now(),
            ]);
        }
    }

    protected function computeEndDate(Subscription $subscription): ?\Carbon\Carbon
    {
        $interval = $subscription->plan?->interval ?? 'monthly';

        return $interval === 'yearly'
            ? now()->addYear()
            : now()->addMonth();
    }
}
