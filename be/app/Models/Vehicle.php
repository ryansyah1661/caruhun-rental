<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\SoftDeletes;

class Vehicle extends Model
{
    use HasUuids, SoftDeletes;

    protected $guarded = [];

    protected $casts = [
        'show_on_web' => 'boolean',
        'features' => 'array',
    ];

    protected $appends = ['full_name', 'image_url'];

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    public function photos()
    {
        return $this->morphMany(Photo::class, 'photoable');
    }

    public function getFullNameAttribute(): string
    {
        return trim("{$this->brand} {$this->model}");
    }

    public function getImageUrlAttribute(): string
    {
        // 1. Cek dari relasi morphMany photos() dulu
        $firstPhoto = $this->relationLoaded('photos')
            ? $this->photos->first()
            : $this->photos()->first();

        if ($firstPhoto) {
            // Sesuaikan nama kolom di tabel photos jika berbeda (misal: path / url / file_path)
            $path = $firstPhoto->url ?? $firstPhoto->path ?? $firstPhoto->file_path ?? null;
            if ($path) {
                return str_starts_with($path, 'http') ? $path : asset('storage/' . $path);
            }
        }

        // 2. Fallback ke kolom image_path jika ada
        if (!empty($this->image_path)) {
            return str_starts_with($this->image_path, 'http')
                ? $this->image_path
                : asset('storage/' . $this->image_path);
        }

        // 3. Default placeholder jika unit belum punya foto
        return 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=800&auto=format&fit=crop';
    }
}