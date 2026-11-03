<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $structure = [
            'World' => [
                'color' => '#b91c1c',
                'description' => 'Global news, diplomacy and international affairs.',
                'children' => [
                    'Nigeria' => '#8f1414',
                    'Metro' => '#c53030',
                ],
            ],
            'Politics' => [
                'color' => '#0f4c81',
                'description' => 'Government, elections and public policy.',
            ],
            'Business' => [
                'color' => '#1b5e20',
                'description' => 'Markets, industry and the economy.',
            ],
            'Energy' => [
                'color' => '#c66900',
                'description' => 'Oil, gas, power and the energy transition.',
            ],
            'Technology' => [
                'color' => '#283593',
                'description' => 'Startups, telecoms and the digital economy.',
                'children' => [
                    'Telecoms' => '#1a237e',
                    'Tech' => '#3949ab',
                ],
            ],
            'Culture' => [
                'color' => '#c2185b',
                'description' => 'Film, music, art and lifestyle.',
                'children' => [
                    'Film' => '#ad1457',
                    'Music' => '#d81b60',
                ],
            ],
            'Sport' => [
                'color' => '#1f6f3b',
                'description' => 'Football, athletics and more.',
            ],
            'Opinion' => [
                'color' => '#6a4c93',
                'description' => 'Editorials, commentary and analysis.',
                'children' => [
                    'Editorial' => '#5e35b1',
                ],
            ],
            'Education' => [
                'color' => '#00838f',
                'description' => 'Schools, universities and learning.',
            ],
            'Health' => [
                'color' => '#00796b',
                'description' => 'Public health and wellbeing.',
            ],
            'Interview' => [
                'color' => '#37474f',
                'description' => 'In-depth conversations with newsmakers.',
            ],
            'Breaking News' => [
                'color' => '#d32f2f',
                'description' => 'The latest developments as they happen.',
            ],
        ];

        foreach ($structure as $name => $config) {
            $parent = Category::updateOrCreate(
                ['slug' => Str::slug($name)],
                [
                    'name' => $name,
                    'description' => $config['description'],
                    'color' => $config['color'],
                    'order' => 0,
                ]
            );

            foreach ($config['children'] ?? [] as $childName => $childColor) {
                Category::updateOrCreate(
                    ['slug' => Str::slug($childName)],
                    [
                        'name' => $childName,
                        'description' => null,
                        'color' => $childColor,
                        'parent_id' => $parent->id,
                        'order' => 0,
                    ]
                );
            }
        }
    }
}
