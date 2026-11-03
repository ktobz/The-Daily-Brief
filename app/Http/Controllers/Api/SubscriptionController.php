<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PlanResource;
use App\Models\Plan;
use App\Models\Subscription;
use App\Models\Transaction;
use App\Services\FlutterwaveService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SubscriptionController extends Controller
{
    public function __construct(private readonly FlutterwaveService $flutterwave) {}

    public function plans(): JsonResponse
    {
        return response()->json([
            'data' => PlanResource::collection(Plan::where('is_active', true)->orderBy('order')->get()),
        ]);
    }

    public function subscribe(Request $request, Plan $plan): JsonResponse
    {
        $user = $request->user();

        $txRef = 'DP-'.Str::upper(Str::random(20));

        $subscription = Subscription::create([
            'user_id' => $user->id,
            'plan_id' => $plan->id,
            'status' => 'pending',
        ]);

        Transaction::create([
            'user_id' => $user->id,
            'subscription_id' => $subscription->id,
            'reference' => $txRef,
            'amount' => $plan->price,
            'currency' => $plan->currency,
            'status' => 'pending',
        ]);

        $payload = [
            'tx_ref' => $txRef,
            'amount' => (string) $plan->price,
            'currency' => $plan->currency,
            'redirect_url' => $request->input('redirect_url') ?: env('FLW_REDIRECT_URL'),
            'customer' => ['email' => $user->email, 'name' => $user->name],
            'customizations' => [
                'title' => 'The Daily Brief Premium',
                'description' => $plan->name,
            ],
        ];

        if ($plan->flutterwave_plan_id) {
            $payload['payment_plan'] = $plan->flutterwave_plan_id;
        }

        $result = $this->flutterwave->initiateSubscription($payload);

        if ($result['status'] === 'success' && isset($result['link'])) {
            return response()->json(['checkout_url' => $result['link']]);
        }

        $subscription->update(['status' => 'failed']);

        return response()->json(['message' => $result['message'] ?? 'Unable to start payment.'], 422);
    }

    public function cancel(Request $request, Subscription $subscription): JsonResponse
    {
        abort_unless($subscription->user_id === $request->user()->id, 403);

        if ($subscription->flutterwave_subscription_id) {
            $this->flutterwave->cancelSubscription($subscription->flutterwave_subscription_id);
        }

        $subscription->update(['status' => 'cancelled', 'cancelled_at' => now()]);

        return response()->json(['ok' => true]);
    }

    public function account(Request $request): JsonResponse
    {
        $user = $request->user();
        $subscription = $user->activeSubscription();

        return response()->json([
            'user' => $request->user()->only(['id', 'name', 'email', 'role', 'avatar']),
            'subscription' => $subscription ? [
                'plan' => $subscription->plan?->name,
                'status' => $subscription->status,
                'starts_at' => optional($subscription->starts_at)->toIso8601String(),
                'ends_at' => optional($subscription->ends_at)->toIso8601String(),
            ] : null,
            'transactions' => $user->transactions()->latest()->limit(10)->get()->map(fn ($t) => [
                'reference' => $t->reference,
                'amount' => $t->amount,
                'currency' => $t->currency,
                'status' => $t->status,
                'created_at' => $t->created_at->toIso8601String(),
            ]),
        ]);
    }
}
