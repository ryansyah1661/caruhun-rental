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

        $vehicles = Vehicle::latest()->get()->map(function ($v) use ($statusMap) {
            return [
                'id' => (string) $v->id,
                'name' => $v->full_name,
                'nopol' => $v->plate_number,
                'category' => $v->category ? strtoupper($v->category) : ($v->seats ? "{$v->seats}-Seater" : 'MPV'),
                'transmission' => ucfirst($v->transmission ?? 'Matic'),
                'year' => (int) ($v->year ?? 2023),
                'status' => $statusMap[$v->status] ?? 'Tersedia',
                'daily_price' => (int) ($v->daily_price ?? 0),
                'odometer' => $v->odometer ?? '0 km',
            ];
        });

        return response()->json([
            'vehicles' => $vehicles,
            'total' => $vehicles->count(),
        ]);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $vehicle = Vehicle::findOrFail($id);
        $data = $request->validate([
            'status' => 'nullable|string',
            'daily_price' => 'nullable|numeric',
        ]);

        if (!empty($data['status'])) {
            $reverseMap = [
                'Tersedia' => 'available',
                'Disewa' => 'rented',
                'Dipesan' => 'booked',
                'Servis' => 'maintenance',
            ];
            $vehicle->status = $reverseMap[$data['status']] ?? strtolower($data['status']);
        }

        if (isset($data['daily_price'])) {
            $vehicle->daily_price = (int) $data['daily_price'];
        }

        $vehicle->save();

        return response()->json([
            'message' => 'Data armada berhasil diperbarui.',
            'vehicle' => $vehicle,
        ]);
    }

    public function destroy(string $id): JsonResponse
    {
        $vehicle = Vehicle::findOrFail($id);
        $vehicle->delete(); // Soft delete aman

        return response()->json([
            'message' => 'Armada berhasil dihapus.',
        ]);
    }
}