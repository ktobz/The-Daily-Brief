<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('audio_broadcasts', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('title');
            $table->string('slug')->unique();
            $table->unsignedInteger('episode_number');
            $table->text('dek')->nullable();
            $table->string('audio_s3_path')->nullable();
            $table->unsignedInteger('duration_seconds')->default(0);
            $table->json('waveform_peaks')->nullable();
            $table->string('tier')->default('audio_master');
            $table->string('audio_format')->default('24-Bit 96kHz Lossless FLAC');
            $table->boolean('is_live_wire')->default(false);
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
        });

        Schema::create('broadcast_transcripts', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('audio_broadcast_id')->constrained('audio_broadcasts')->cascadeOnDelete();
            $table->string('speaker_name');
            $table->string('speaker_title')->nullable();
            $table->unsignedInteger('start_second');
            $table->unsignedInteger('end_second');
            $table->text('content');
            $table->boolean('is_key_quote')->default(false);
            $table->unsignedInteger('sequence_order')->default(0);
            $table->timestamps();

            $table->index(['audio_broadcast_id', 'start_second']);
        });

        Schema::create('subscriber_audio_tokens', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('token', 64)->unique();
            $table->timestamp('last_accessed_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('subscriber_audio_tokens');
        Schema::dropIfExists('broadcast_transcripts');
        Schema::dropIfExists('audio_broadcasts');
    }
};
