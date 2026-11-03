<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\FirebaseService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function __construct(private readonly FirebaseService $firebase) {}
    public function register(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8'],
        ]);

        $user = User::create([
            'name' => $data['name'],
            'username' => Str::slug($data['name']).'-'.Str::lower(Str::random(4)),
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'role' => 'reader',
        ]);

        return response()->json([
            'token' => $user->createToken('web')->plainTextToken,
            'user' => $this->userPayload($user),
        ], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $data = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        $user = User::where('email', $data['email'])->first();

        if (! $user || ! Hash::check($data['password'], $user->password)) {
            return response()->json(['message' => 'Invalid credentials.'], 401);
        }

        return response()->json([
            'token' => $user->createToken('web')->plainTextToken,
            'user' => $this->userPayload($user),
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['ok' => true]);
    }

    public function user(Request $request): JsonResponse
    {
        return response()->json(['user' => $this->userPayload($request->user())]);
    }

    public function firebase(Request $request): JsonResponse
    {
        $request->validate(['id_token' => ['required', 'string']]);

        if (! $this->firebase->isConfigured() || ! $this->firebase->auth()) {
            return response()->json(['message' => 'Firebase auth is not configured.'], 503);
        }

        try {
            $verified = $this->firebase->auth()->verifyIdToken($request->input('id_token'));
        } catch (\Throwable $e) {
            return response()->json(['message' => 'Invalid token.'], 401);
        }

        $claims = $verified->claims();
        $firebaseUid = (string) $claims->get('sub');
        $email = (string) $claims->get('email', '');
        $name = (string) $claims->get('name', '');
        $avatar = (string) $claims->get('picture', '');

        $user = User::where('firebase_uid', $firebaseUid)->first();

        if (! $user && $email !== '') {
            $user = User::where('email', $email)->first();
        }

        if (! $user) {
            $user = User::create([
                'name' => $name !== '' ? $name : 'Reader',
                'username' => Str::slug($name !== '' ? $name : 'reader').'-'.Str::lower(Str::random(4)),
                'email' => $email !== '' ? $email : $firebaseUid.'@firebase.local',
                'password' => bcrypt(Str::random(32)),
                'role' => 'reader',
                'firebase_uid' => $firebaseUid,
                'avatar' => $avatar ?: null,
                'email_verified_at' => now(),
            ]);
        }

        if ($user->firebase_uid !== $firebaseUid) {
            $user->update(['firebase_uid' => $firebaseUid, 'avatar' => $avatar ?: $user->avatar]);
        }

        return response()->json([
            'token' => $user->createToken('web')->plainTextToken,
            'user' => $this->userPayload($user),
        ]);
    }

    protected function userPayload(User $user): array
    {
        $subscription = $user->activeSubscription();

        return [
            'id' => $user->id,
            'name' => $user->name,
            'username' => $user->username,
            'email' => $user->email,
            'role' => $user->role,
            'avatar' => $user->avatar,
            'verified' => (bool) $user->email_verified_at,
            'subscription' => $subscription ? [
                'plan' => $subscription->plan?->name,
                'status' => $subscription->status,
                'ends_at' => optional($subscription->ends_at)->toIso8601String(),
            ] : null,
        ];
    }
}
