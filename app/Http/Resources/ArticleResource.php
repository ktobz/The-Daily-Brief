<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ArticleResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $user = $request->user();
        $hasAccess = ! $this->is_premium
            || ($user && ($user->isAdmin() || $user->hasActiveSubscription()));

        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'excerpt' => $this->excerpt,
            'subdeck' => $this->subdeck,
            'body' => $hasAccess ? $this->body : null,
            'is_locked' => ! $hasAccess,
            'image' => $this->imageUrl(),
            'image_caption' => $this->image_caption,
            'key_facts' => $this->key_facts ?? [],
            'data_graphic' => $this->data_graphic,
            'co_authors' => $this->co_authors ?? [],
            'edition' => $this->edition,
            'is_premium' => (bool) $this->is_premium,
            'is_featured' => (bool) $this->is_featured,
            'is_breaking' => (bool) $this->is_breaking,
            'read_time' => $this->estimatedReadTime(),
            'views' => $this->views,
            'published_at' => optional($this->published_at)->toIso8601String(),
            'category' => $this->whenLoaded('category', fn () => [
                'id' => $this->category->id,
                'name' => $this->category->name,
                'slug' => $this->category->slug,
                'color' => $this->category->colorOrDefault(),
            ]),
            'author' => $this->whenLoaded('author', fn () => [
                'name' => $this->author?->name ?? 'The Daily Post',
                'role' => $this->author?->bio ? 'Correspondent' : null,
            ]),
            'tags' => $this->whenLoaded('tags', fn () => $this->tags->map(fn ($t) => $t->name)),
        ];
    }
}
