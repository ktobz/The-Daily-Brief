<?php

namespace Tests\Feature;

use App\Models\Article;
use App\Models\Category;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class HomeApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_home_returns_the_lead_and_wire_for_an_edition(): void
    {
        $category = Category::create(['name' => 'World', 'slug' => 'world']);
        $author = User::factory()->create(['role' => 'writer']);

        Article::create([
            'category_id' => $category->id,
            'user_id' => $author->id,
            'title' => 'Lagos leads the morning briefing',
            'slug' => 'lagos-leads-the-morning-briefing',
            'excerpt' => 'A test excerpt',
            'body' => '<p>Body copy.</p>',
            'status' => 'published',
            'edition' => 'Lagos',
            'published_at' => now(),
        ]);

        Article::create([
            'category_id' => $category->id,
            'user_id' => $author->id,
            'title' => 'International edition story',
            'slug' => 'international-edition-story',
            'body' => '<p>Body copy.</p>',
            'status' => 'published',
            'edition' => 'International',
            'published_at' => now(),
        ]);

        $this->getJson('/api/home?edition=Lagos')
            ->assertOk()
            ->assertJsonPath('edition', 'Lagos')
            ->assertJsonPath('lead.slug', 'lagos-leads-the-morning-briefing')
            ->assertJsonPath('wire.0.slug', 'lagos-leads-the-morning-briefing');
    }

    public function test_articles_can_be_filtered_by_category_and_edition(): void
    {
        $category = Category::create(['name' => 'Business', 'slug' => 'business']);
        $author = User::factory()->create(['role' => 'writer']);

        Article::create([
            'category_id' => $category->id,
            'user_id' => $author->id,
            'title' => 'Markets close higher',
            'slug' => 'markets-close-higher',
            'body' => '<p>Body copy.</p>',
            'status' => 'published',
            'edition' => 'Lagos',
            'published_at' => now(),
        ]);

        $this->getJson('/api/articles?category=business&edition=Lagos')
            ->assertOk()
            ->assertJsonPath('meta.total', 1)
            ->assertJsonPath('data.0.slug', 'markets-close-higher');
    }
}
