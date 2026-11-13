<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('vehicles', function (Blueprint $table) {
            $table->string('category')->default('mpv')->after('type'); // city, mpv, suv, minibus
            $table->string('category_label')->nullable()->after('category'); // Contoh: "MPV / Keluarga"
            $table->string('fuel_type')->default('Bensin')->after('transmission');
            $table->string('engine')->nullable()->after('fuel_type'); // Contoh: "1.500 cc Dual VVT-i"
            $table->string('luggage')->nullable()->after('seats'); // Contoh: "3 Koper Sedang"
            $table->string('image_path')->nullable()->after('notes');
            $table->json('features')->nullable()->after('image_path'); // Array fitur: ["AC Double Blower", ...]
            
            // Rincian tarif lengkap untuk halaman /tarif
            $table->unsignedBigInteger('price_12h')->nullable()->after('daily_price');
            $table->unsignedBigInteger('price_30d')->default(0)->after('price_12h');
            $table->unsignedBigInteger('deposit_self_drive')->default(500000)->after('price_30d');
            
            $table->unsignedBigInteger('driver_price_12h')->default(0)->after('deposit_self_drive');
            $table->unsignedBigInteger('driver_price_24h')->default(0)->after('driver_price_12h');
            $table->unsignedBigInteger('driver_overtime_hour')->default(50000)->after('driver_price_24h');
            $table->unsignedBigInteger('deposit_with_driver')->default(300000)->after('driver_overtime_hour');
            
            $table->unsignedBigInteger('airport_cgk')->default(0)->after('deposit_with_driver');
            $table->unsignedBigInteger('airport_hlp')->default(0)->after('airport_cgk');
            $table->unsignedBigInteger('airport_whoosh')->default(0)->after('airport_hlp');
        });
    }

    public function down(): void
    {
        Schema::table('vehicles', function (Blueprint $table) {
            $table->dropColumn([
                'category', 'category_label', 'fuel_type', 'engine', 'luggage',
                'image_path', 'features', 'price_12h', 'price_30d', 'deposit_self_drive',
                'driver_price_12h', 'driver_price_24h', 'driver_overtime_hour', 'deposit_with_driver',
                'airport_cgk', 'airport_hlp', 'airport_whoosh',
            ]);
        });
    }
};