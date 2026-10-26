<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\SoftDeletes;

class Vehicle extends Model
{
    use HasUuids, SoftDeletes;
    protected $guarded = [];
    protected $casts = ['show_on_web' => 'boolean'];

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }
    public function photos()
    {
        return $this->morphMany(Photo::class, 'photoable');
    }
}