<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;

class AudioBroadcast extends Model
{
    use HasUuids;

    protected $fillable = [
        'title',
        'slug',
        'episode_number',
        'dek',
        'audio_s3_path',
        'duration_seconds',
        'waveform_peaks',
        'tier',
        'audio_format',
        'is_live_wire',
        'published_at',
    ];

    protected $casts = [
        'waveform_peaks' => 'array',
        'published_at' => 'datetime',
        'is_live_wire' => 'boolean',
        'duration_seconds' => 'integer',
        'episode_number' => 'integer',
    ];

    public function transcripts(): HasMany
    {
        return $this->hasMany(BroadcastTranscript::class)->orderBy('sequence_order');
    }

    /**
     * A temporary signed stream URL for authorized subscribers, or a
     * simulated URL when S3 / real FLAC assets are not yet configured.
     */
    public function getSecureStreamUrlAttribute(): string
    {
        if ($this->audio_s3_path && config('filesystems.disks.s3.bucket') && config('filesystems.disks.s3.key')) {
            return Storage::disk('s3')->temporaryUrl(
                $this->audio_s3_path,
                now()->addHours(2)
            );
        }

        return url('/api/audio/'.$this->id.'/stream');
    }
}
