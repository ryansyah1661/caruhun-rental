<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Carbon\Carbon;

class AdminArrivalController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $today = Carbon::today();
        $now = Carbon::now();

        // 1. Ambil data bookings untuk monitoring kedatangan/pengembalian
        $arrivals = Booking::with(['vehicle', 'customer'])
            ->orderBy('end_at', 'desc')
            ->get()
            ->map(function ($b) use ($today, $now) {
                $end = Carbon::parse($b->end_at);
                $isToday = $end->isToday();
                $isYesterday = $end->isYesterday();

                // Format Waktu Estimasi Kedatangan
                if ($isToday) {
                    $estimatedArrival = 'Hari Ini, ' . $end->format('H:i') . ' WIB';
                } elseif ($isYesterday) {
                    $estimatedArrival = 'Kemarin, ' . $end->format('H:i') . ' WIB';
                } else {
                    $estimatedArrival = $end->translatedFormat('d M Y, H:i') . ' WIB';
                }

                $driverName = $b->with_driver ? 'Driver Caruhun' : 'Lepas Kunci (Self-Drive)';
                $originOrDestination = $b->notes ?: 'Rute Sewa / Pool Utama';

                // Status Operasional Kedatangan:
                // "Dalam Perjalanan" | "Tiba di Pool" | "Inspeksi Selesai" | "Terlambat"
                if ($b->status === 'completed') {
                    $status = 'Inspeksi Selesai';
                } elseif ($b->status === 'ongoing' || $b->status === 'confirmed') {
                    if ($now->gt($end)) {
                        $status = 'Terlambat';
                    } elseif ($isToday && $now->diffInHours($end, false) <= 2) {
                        $status = 'Tiba di Pool';
                    } else {
                        $status = 'Dalam Perjalanan';
                    }
                } else {
                    $status = 'Dalam Perjalanan';
                }

                return [
                    'id' => (string) $b->id,
                    'bookingCode' => str_starts_with($b->code, '#') ? $b->code : '#' . $b->code,
                    'unitName' => $b->vehicle ? $b->vehicle->full_name : 'Unit Kendaraan',
                    'nopol' => $b->vehicle ? $b->vehicle->plate_number : '-',
                    'renterName' => $b->customer ? $b->customer->name : 'Pelanggan',
                    'renterPhone' => $b->customer ? ($b->customer->phone ?? '-') : '-',
                    'originOrDestination' => $originOrDestination,
                    'estimatedArrival' => $estimatedArrival,
                    'driverName' => $driverName,
                    'status' => $status,
                ];
            });

        // 2. Metrik kartu statistik
        // Dalam Perjalanan (masih aktif di jalan)
        $onTheWayCount = Booking::whereIn('status', ['ongoing', 'confirmed'])
            ->where('end_at', '>=', $now)
            ->count();

        // Tiba di Pool / Perlu Cek (jatuh tempo hari ini atau terlambat)
        $needCheckCount = Booking::whereIn('status', ['ongoing', 'confirmed'])
            ->where('end_at', '<', $now)
            ->count();

        // Inspeksi Selesai
        $inspectedDoneCount = Booking::where('status', 'completed')->count();

        return response()->json([
            'arrivals' => $arrivals,
            'stats' => [
                'onTheWay' => $onTheWayCount,
                'needCheck' => $needCheckCount,
                'inspectedDone' => $inspectedDoneCount,
            ],
        ]);
    }
}