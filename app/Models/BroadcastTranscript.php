<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BroadcastTranscript extends Model
{
    use HasUuids;

    protected $fillable = [
        'audio_broadcast_id',
        'speaker_name',
        'speaker_title',
        'start_second',
        'end_second',
        'content',
        'is_key_quote',
        'sequence_order',
    ];

    protected $casts = [
        'start_second' => 'integer',
        'end_second' => 'integer',
        'is_key_quote' => 'boolean',
        'sequence_order' => 'integer',
    ];

    public function broadcast(): BelongsTo
    {
        return $this->belongsTo(AudioBroadcast::class);
    }
}
