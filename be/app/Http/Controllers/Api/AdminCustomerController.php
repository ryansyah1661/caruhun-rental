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
        // 1. Ambil data pelanggan dari PostgreSQL beserta total riwayat booking-nya
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
}