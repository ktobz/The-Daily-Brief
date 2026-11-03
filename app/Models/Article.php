<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Article extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id',
        'user_id',
        'title',
        'slug',
        'excerpt',
        'subdeck',
        'co_authors',
        'body',
        'image',
        'image_caption',
        'key_facts',
        'data_graphic',
        'status',
        'edition',
        'is_premium',
        'is_featured',
        'is_breaking',
        'read_time',
        'views',
        'published_at',
    ];

    protected $casts = [
        'co_authors' => 'array',
        'key_facts' => 'array',
        'data_graphic' => 'array',
        'is_premium' => 'boolean',
        'is_featured' => 'boolean',
        'is_breaking' => 'boolean',
        'views' => 'integer',
        'published_at' => 'datetime',
    ];

    protected static function booted(): void
    {
        static::creating(function (Article $article) {
            if (empty($article->slug)) {
                $article->slug = Str::slug($article->title);
            }
            if (empty($article->published_at) && $article->status === 'published') {
                $article->published_at = now();
            }
            if (empty($article->read_time)) {
                $article->read_time = max(1, (int) ceil(str_word_count(strip_tags($article->body)) / 200));
            }
        });

        static::saving(function (Article $article) {
            if (empty($article->read_time)) {
                $article->read_time = max(1, (int) ceil(str_word_count(strip_tags($article->body ?? '')) / 200));
            }
        });
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    public function path(): string
    {
        return rtrim((string) env('FRONTEND_URL', 'http://localhost:3000'), '/').'/article/'.$this->slug;
    }

    public function scopePublished($query)
    {
        return $query->where('status', 'published')->whereNotNull('published_at');
    }

    public function scopeBreaking($query)
    {
        return $query->where('is_breaking', true);
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function imageUrl(): string
    {
        // Real uploaded image stored as a relative storage path.
        if ($this->image && ! str_starts_with($this->image, 'http')) {
            return asset('storage/'.$this->image);
        }

        // Real external image (CDN etc.) — keep as-is.
        if ($this->image && str_starts_with($this->image, 'http') && ! str_contains($this->image, 'placehold.co')) {
            return $this->image;
        }

        // No image, or a legacy placeholder — use a deterministic real photograph.
        return 'https://picsum.photos/seed/'.urlencode($this->slug).'/800/450';
    }

    public function estimatedReadTime(): string
    {
        return $this->read_time ?? 1;
    }
}
