<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('comments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('article_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('parent_id')->nullable()->constrained('comments')->nullOnDelete();
            $table->string('author_name');
            $table->string('author_email')->nullable();
            $table->text('body');
            $table->string('status')->default('approved');
            $table->string('firebase_id')->nullable()->index();
            $table->unsignedInteger('reactions')->default(0);
            $table->timestamps();

            $table->index('article_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('comments');
    }
};
