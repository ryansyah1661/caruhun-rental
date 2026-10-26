<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class RentalPackage extends Model
{
    use HasUuids;
    protected $guarded = [];
    protected $casts = ['is_active' => 'boolean'];

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }
}
