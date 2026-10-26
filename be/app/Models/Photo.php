<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Photo extends Model
{
    use HasUuids;
    protected $guarded = [];
    protected $casts = ['taken_at' => 'datetime'];

    public function photoable()
    {
        return $this->morphTo();
    }
}