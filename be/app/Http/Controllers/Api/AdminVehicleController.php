<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Vehicle;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminVehicleController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $statusMap = [
            'available' => 'Tersedia',
            'rented' => 'Disewa',
            'booked' => 'Dipesan',
            'maintenance' => 'Servis',
        ];

        // 1. Ambil data armada master dari PostgreSQL
        $vehicles = Vehicle::latest()->get()->map(function ($v) use ($statusMap) {
            return [
                'id' => (string) $v->id,
                'name' => $v->full_name,
                'nopol' => $v->plate_number,
                'category' => $v->category ? strtoupper($v->category) : ($v->seats ? "{$v->seats}-Seater" : 'MPV'),
                'transmission' => ucfirst($v->transmission ?? 'Matic'),
                'year' => (int) ($v->year ?? 2023),
                'status' => $statusMap[$v->status] ?? 'Tersedia',
                'odometer' => $v->odometer ?? '0 km',
            ];
        });

        return response()->json([
            'vehicles' => $vehicles,
            'total' => $vehicles->count(),
        ]);
    }
}