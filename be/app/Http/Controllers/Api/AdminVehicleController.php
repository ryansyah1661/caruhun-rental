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

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'plate_number' => 'required|string|max:20|unique:vehicles,plate_number',
            'brand' => 'required|string|max:100',
            'model' => 'required|string|max:100',
            'category' => 'nullable|string|max:50',
            'transmission' => 'nullable|string|max:50',
            'year' => 'nullable|integer',
            'seats' => 'nullable|integer',
            'daily_price' => 'required|numeric|min:0',
            'status' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $reverseMap = [
            'Tersedia' => 'available',
            'Disewa' => 'rented',
            'Dipesan' => 'booked',
            'Servis' => 'maintenance',
        ];

        $status = $data['status'] ?? 'available';
        $status = $reverseMap[$status] ?? strtolower($status);

        $vehicle = Vehicle::create([
            'plate_number' => strtoupper(trim($data['plate_number'])),
            'brand' => trim($data['brand']),
            'model' => trim($data['model']),
            'category' => strtolower($data['category'] ?? 'mpv'),
            'category_label' => strtoupper($data['category'] ?? 'MPV'),
            'transmission' => strtolower($data['transmission'] ?? 'automatic'),
            'year' => $data['year'] ?? 2023,
            'seats' => $data['seats'] ?? 7,
            'daily_price' => (int) $data['daily_price'],
            'status' => $status,
            'notes' => $data['notes'] ?? null,
            'show_on_web' => true,
        ]);

        return response()->json([
            'message' => 'Armada baru berhasil ditambahkan.',
            'vehicle' => $vehicle,
        ], 201);
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