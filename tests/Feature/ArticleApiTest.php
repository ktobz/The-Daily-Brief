<?php

namespace Tests\Feature;

use App\Models\Article;
use App\Models\Category;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ArticleApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_article_detail_returns_related_stories(): void
    {
        [$author, $category] = $this->makeAuthorAndCategory();

        $article = $this->makeArticle($author, $category, [
            'title' => 'A reported story',
            'slug' => 'a-reported-story',
        ]);

        $this->makeArticle($author, $category, [
            'title' => 'A related story',
            'slug' => 'a-related-story',
        ]);

        $this->getJson('/api/articles/'.$article->slug)
            ->assertOk()
            ->assertJsonPath('data.slug', 'a-reported-story')
            ->assertJsonPath('data.is_locked', false)
            ->assertJsonCount(1, 'related')
            ->assertJsonCount(1, 'next_in_world');
    }

    public function test_premium_article_body_is_locked_for_guests(): void
    {
        [$author, $category] = $this->makeAuthorAndCategory();

        $article = $this->makeArticle($author, $category, [
            'title' => 'Premium investigation',
            'slug' => 'premium-investigation',
            'is_premium' => true,
        ]);

        $this->getJson('/api/articles/'.$article->slug)
            ->assertOk()
            ->assertJsonPath('data.is_locked', true)
            ->assertJsonPath('data.body', null);
    }

    private function makeAuthorAndCategory(): array
    {
        $author = User::factory()->create(['role' => 'writer']);
        $category = Category::create(['name' => 'Politics', 'slug' => 'politics']);

        return [$author, $category];
    }

    private function makeArticle(User $author, Category $category, array $attributes = []): Article
    {
        return Article::create(array_merge([
            'category_id' => $category->id,
            'user_id' => $author->id,
            'title' => 'Test story',
            'slug' => 'test-story-'.uniqid(),
            'excerpt' => 'Test excerpt',
            'body' => '<p>Body copy.</p>',
            'status' => 'published',
            'edition' => 'Lagos',
            'published_at' => now(),
        ], $attributes));
    }
}
