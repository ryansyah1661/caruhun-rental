<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('attendances', function (Blueprint $table) {
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('user_name')->nullable();
            $table->string('role')->nullable();
            $table->date('date')->nullable();
            $table->string('clock_in')->nullable();
            $table->string('clock_out')->nullable();
            $table->string('status')->default('Hadir'); // Hadir, Izin, Alpha, Sakit
            $table->string('location')->nullable();
            $table->text('notes')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('attendances', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropColumn([
                'user_id',
                'user_name',
                'role',
                'date',
                'clock_in',
                'clock_out',
                'status',
                'location',
                'notes',
            ]);
        });
    }
};