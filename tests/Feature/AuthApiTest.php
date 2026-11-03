<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_a_reader_can_register_and_receive_a_token(): void
    {
        $response = $this->postJson('/api/register', [
            'name' => 'Ada Reader',
            'email' => 'ada@example.com',
            'password' => 'password123',
        ]);

        $response->assertCreated()
            ->assertJsonStructure(['token', 'user' => ['id', 'name', 'email', 'role']]);

        $this->assertDatabaseHas('users', [
            'email' => 'ada@example.com',
            'role' => 'reader',
        ]);
    }

    public function test_a_reader_can_login_and_fetch_their_profile(): void
    {
        User::factory()->create([
            'email' => 'reader@example.com',
            'password' => 'password123',
        ]);

        $token = $this->postJson('/api/login', [
            'email' => 'reader@example.com',
            'password' => 'password123',
        ])->assertOk()->json('token');

        $this->withHeader('Authorization', 'Bearer '.$token)
            ->getJson('/api/user')
            ->assertOk()
            ->assertJsonPath('user.email', 'reader@example.com');
    }

    public function test_invalid_credentials_are_rejected(): void
    {
        User::factory()->create([
            'email' => 'reader@example.com',
            'password' => 'password123',
        ]);

        $this->postJson('/api/login', [
            'email' => 'reader@example.com',
            'password' => 'wrong-password',
        ])->assertUnauthorized();
    }
}
