<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PageContent extends Model
{
    protected $fillable = [
        'page_slug',
        'section_key',
        'badge',
        'title',
        'title_highlight',
        'description',
        'image_path',
        'extra_items',
    ];

    protected $casts = [
        'extra_items' => 'array',
    ];

    protected $appends = ['image_url'];

    public function getImageUrlAttribute(): ?string
    {
        if (!$this->image_path) return null;
        if (str_starts_with($this->image_path, 'http')) return $this->image_path;
        return asset('storage/' . $this->image_path);
    }
}