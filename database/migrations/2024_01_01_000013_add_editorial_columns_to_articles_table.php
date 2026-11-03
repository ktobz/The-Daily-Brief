<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('articles', function (Blueprint $table) {
            $table->string('subdeck')->nullable()->after('excerpt');
            $table->json('co_authors')->nullable()->after('user_id');
            $table->json('key_facts')->nullable()->after('image_caption');
            $table->json('data_graphic')->nullable()->after('key_facts');
            $table->string('edition')->nullable()->after('status');
        });
    }

    public function down(): void
    {
        Schema::table('articles', function (Blueprint $table) {
            $table->dropColumn(['subdeck', 'co_authors', 'key_facts', 'data_graphic', 'edition']);
        });
    }
};
