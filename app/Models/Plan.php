<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Plan extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
        'price',
        'currency',
        'interval',
        'tier',
        'flutterwave_plan_id',
        'features',
        'is_active',
        'order',
    ];

    protected $casts = [
        'price' => 'float',
        'features' => 'array',
        'is_active' => 'boolean',
    ];

    protected static function booted(): void
    {
        static::creating(function (Plan $plan) {
            if (empty($plan->slug)) {
                $plan->slug = Str::slug($plan->name);
            }
        });
    }

    public function subscriptions(): HasMany
    {
        return $this->hasMany(Subscription::class);
    }

    public function formattedPrice(): string
    {
        return $this->currency === 'NGN'
            ? '₦'.number_format($this->price)
            : number_format($this->price).' '.$this->currency;
    }

    public function getFormattedPriceAttribute(): string
    {
        return $this->formattedPrice();
    }
}
