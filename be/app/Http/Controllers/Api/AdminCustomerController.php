<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminCustomerController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $customers = Customer::withCount('bookings')
            ->latest()
            ->get()
            ->map(function ($c) {
                return [
                    'id' => (string) $c->id,
                    'name' => $c->name,
                    'phone' => $c->phone ?? '-',
                    'nik' => $c->id_number ?? '-',
                    'totalRental' => (int) ($c->bookings_count ?? 0),
                    'status' => 'Aktif',
                ];
            });

        return response()->json([
            'customers' => $customers,
            'total' => $customers->count(),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:30',
            'nik' => 'nullable|string|max:50',
            'address' => 'nullable|string|max:500',
            'notes' => 'nullable|string',
        ]);

        $customer = Customer::create([
            'name' => trim($data['name']),
            'phone' => trim($data['phone']),
            'id_number' => $data['nik'] ?? null,
            'address' => $data['address'] ?? null,
            'notes' => $data['notes'] ?? null,
        ]);

        return response()->json([
            'message' => 'Pelanggan baru berhasil ditambahkan.',
            'customer' => $customer,
        ], 201);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $customer = Customer::findOrFail($id);
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:30',
            'nik' => 'nullable|string|max:50',
        ]);

        $customer->name = $data['name'];
        if (isset($data['phone'])) $customer->phone = $data['phone'];
        if (isset($data['nik'])) $customer->id_number = $data['nik'];
        $customer->save();

        return response()->json([
            'message' => 'Data pelanggan berhasil diperbarui.',
            'customer' => $customer,
        ]);
    }

    public function destroy(string $id): JsonResponse
    {
        $customer = Customer::findOrFail($id);
        $customer->delete(); // Soft delete

        return response()->json([
            'message' => 'Pelanggan berhasil dihapus.',
        ]);
    }
}