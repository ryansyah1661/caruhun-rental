<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Handover extends Model
{
    use HasUuids;
    protected $guarded = [];
    protected $casts = ['handed_at' => 'datetime', 'synced_at' => 'datetime'];

    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }
    public function photos()
    {
        return $this->morphMany(Photo::class, 'photoable');
    }
}