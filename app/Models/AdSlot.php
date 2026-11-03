<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AdSlot extends Model
{
    protected $fillable = [
        'name',
        'code',
        'image',
        'url',
        'location',
        'is_active',
        'order',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}
