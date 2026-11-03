<?php

namespace Database\Seeders;

use App\Models\Plan;
use Illuminate\Database\Seeder;

class PlanSeeder extends Seeder
{
    public function run(): void
    {
        $plans = [
            [
                'name' => 'Digital Reader',
                'slug' => 'digital-reader',
                'tier' => 'reader',
                'description' => 'Full access to the broadsheet archive, daily briefings and search.',
                'price' => 20000,
                'currency' => 'NGN',
                'interval' => 'monthly',
                'features' => [
                    'Full archive & daily briefings',
                    'Unlimited premium articles',
                    'Breaking-news push alerts',
                    'Ad-free reading',
                ],
                'order' => 1,
            ],
            [
                'name' => 'Audio & Master',
                'slug' => 'audio-master',
                'tier' => 'audio_master',
                'description' => 'The flagship tier for audio — lossless FLAC and the verbatim transcript reader.',
                'price' => 45000,
                'currency' => 'NGN',
                'interval' => 'monthly',
                'features' => [
                    'Everything in Digital Reader',
                    '24-Bit / 96kHz lossless FLAC',
                    'Private authenticated podcast token',
                    'Court-reporter certified verbatim transcripts',
                ],
                'order' => 2,
            ],
            [
                'name' => 'Sovereign Terminal',
                'slug' => 'sovereign-terminal',
                'tier' => 'terminal',
                'description' => 'The full macro terminal workspace for institutions, billed per seat.',
                'price' => 190000,
                'currency' => 'NGN',
                'interval' => 'monthly',
                'features' => [
                    'Everything in Audio & Master',
                    'Macro terminal workspace',
                    'WebSocket news wire feeds',
                    'Central bank sentiment radar',
                    'Corporate invoicing',
                ],
                'order' => 3,
            ],
        ];

        foreach ($plans as $plan) {
            Plan::updateOrCreate(['slug' => $plan['slug']], $plan);
        }

        // Remove legacy plans no longer offered.
        Plan::whereNotIn('slug', array_column($plans, 'slug'))->delete();
    }
}
