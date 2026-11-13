<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('page_contents', function (Blueprint $table) {
            $table->id();
            $table->string('page_slug');      // beranda, tentang, katalog, tarif, keunggulan, partner
            $table->string('section_key');    // hero, about_main, cta, dll.
            $table->string('badge')->nullable();
            $table->string('title')->nullable();
            $table->string('title_highlight')->nullable();
            $table->text('description')->nullable();
            $table->string('image_path')->nullable();
            $table->json('extra_items')->nullable(); // Menyimpan array poin/kartu (misal 6 keunggulan / visi misi)
            $table->timestamps();

            $table->unique(['page_slug', 'section_key']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('page_contents');
    }
};