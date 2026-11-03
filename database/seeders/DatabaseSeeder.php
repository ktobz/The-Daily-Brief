<?php

namespace Database\Seeders;

use App\Models\Article;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $this->call([
            CategorySeeder::class,
            PlanSeeder::class,
            AudioBroadcastSeeder::class,
        ]);

        User::updateOrCreate(
            ['email' => 'admin@dailypost.ng'],
            [
                'name' => 'Site Administrator',
                'username' => 'admin',
                'role' => 'admin',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'is_active' => true,
            ]
        );

        User::updateOrCreate(
            ['email' => 'editor@dailypost.ng'],
            [
                'name' => 'Editor in Chief',
                'username' => 'editor',
                'role' => 'editor',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'is_active' => true,
            ]
        );

        User::updateOrCreate(
            ['email' => 'reader@dailypost.ng'],
            [
                'name' => 'Sample Reader',
                'username' => 'reader',
                'role' => 'reader',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'is_active' => true,
            ]
        );

        User::factory(5)->create(['role' => 'writer']);

        $this->call(StorySeeder::class);

        Article::factory(40)->create();
    }
}
