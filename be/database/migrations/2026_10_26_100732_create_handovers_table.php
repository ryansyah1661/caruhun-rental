<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('handovers', function (Blueprint $table) {
            $table->uuid('id')->primary();                  // dibuat di HP (offline)
            $table->foreignUuid('booking_id')->constrained()->cascadeOnDelete();
            $table->string('type');                         // departure, arrival
            $table->timestampTz('handed_at');
            $table->unsignedTinyInteger('fuel_level')->nullable();  // persen 0-100
            $table->unsignedInteger('odometer')->nullable();
            $table->text('condition_notes')->nullable();
            $table->foreignId('staff_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestampTz('synced_at')->nullable();
            $table->timestamps();
            $table->unique(['booking_id', 'type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('handovers');
    }
};
