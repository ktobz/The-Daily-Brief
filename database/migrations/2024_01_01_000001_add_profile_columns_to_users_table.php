<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('username')->nullable()->unique()->after('name');
            $table->string('role')->default('reader')->after('email');
            $table->string('firebase_uid')->nullable()->unique()->after('role');
            $table->string('avatar')->nullable()->after('firebase_uid');
            $table->text('bio')->nullable()->after('avatar');
            $table->boolean('is_active')->default(true)->after('bio');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['username', 'role', 'firebase_uid', 'avatar', 'bio', 'is_active']);
        });
    }
};
