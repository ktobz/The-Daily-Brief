<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Category extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
        'color',
        'parent_id',
        'order',
    ];

    protected static function booted(): void
    {
        static::creating(function (Category $category) {
            if (empty($category->slug)) {
                $category->slug = Str::slug($category->name);
            }
        });
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(Category::class, 'parent_id')->orderBy('order');
    }

    public function articles(): HasMany
    {
        return $this->hasMany(Article::class);
    }

    public function colorOrDefault(): string
    {
        return $this->color ?: '#A0150F';
    }

    public function path(): string
    {
        return rtrim((string) env('FRONTEND_URL', 'http://localhost:3000'), '/').'/category/'.$this->slug;
    }
}
