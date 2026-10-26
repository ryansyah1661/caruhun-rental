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
        Schema::create('vehicles', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('plate_number')->unique();
            $table->string('brand');
            $table->string('model');
            $table->string('type')->default('car');        // car, motorcycle
            $table->unsignedSmallInteger('year')->nullable();
            $table->string('color')->nullable();
            $table->unsignedTinyInteger('seats')->nullable();
            $table->string('transmission')->nullable();    // manual, automatic
            $table->unsignedBigInteger('daily_price')->default(0); // rupiah
            $table->string('status')->default('available'); // available, maintenance, inactive
            $table->boolean('show_on_web')->default(false);
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vehicles');
    }
};
