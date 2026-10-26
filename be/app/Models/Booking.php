<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\SoftDeletes;

class Booking extends Model
{
    use HasUuids, SoftDeletes;
    protected $guarded = [];
    protected $casts = [
        'start_at' => 'datetime',
        'end_at' => 'datetime',
        'with_driver' => 'boolean',
    ];

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class);
    }
    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }
    public function rentalPackage()
    {
        return $this->belongsTo(RentalPackage::class);
    }
    public function handovers()
    {
        return $this->hasMany(Handover::class);
    }
    public function payments()
    {
        return $this->hasMany(Payment::class);
    }
}