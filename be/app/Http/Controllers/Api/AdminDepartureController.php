<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Carbon\Carbon;

class AdminDepartureController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $today = Carbon::today();

        // 1. Ambil data bookings yang relevan untuk keberangkatan armada
        $departures = Booking::with(['vehicle', 'customer'])
            ->orderBy('start_at', 'desc')
            ->get()
            ->map(function ($b) use ($today) {
                $start = Carbon::parse($b->start_at);
                $isToday = $start->isToday();
                $isYesterday = $start->isYesterday();

                // Format keterangan waktu
                if ($isToday) {
                    $departureTime = 'Hari Ini, ' . $start->format('H:i') . ' WIB';
                } elseif ($isYesterday) {
                    $departureTime = 'Kemarin, ' . $start->format('H:i') . ' WIB';
                } else {
                    $departureTime = $start->translatedFormat('d M Y, H:i') . ' WIB';
                }

                $driverName = $b->with_driver ? 'Driver Ditugaskan' : 'Lepas Kunci (Self-Drive)';
                $destination = $b->notes ?: 'Dalam Kota / Rute Sewa Standar';

                // Map status operasional keberangkatan
                if ($b->status === 'completed') {
                    $status = 'Selesai';
                } elseif ($b->status === 'ongoing') {
                    $status = 'Dalam Perjalanan';
                } elseif ($b->status === 'confirmed' || $b->status === 'pending') {
                    $status = Carbon::now()->gt($start) ? 'Tertunda' : 'Siap Berangkat';
                } else {
                    $status = 'Siap Berangkat';
                }

                return [
                    'id' => (string) $b->id,
                    'bookingCode' => str_starts_with($b->code, '#') ? $b->code : '#' . $b->code,
                    'unitName' => $b->vehicle ? $b->vehicle->full_name : 'Unit Kendaraan',
                    'nopol' => $b->vehicle ? $b->vehicle->plate_number : '-',
                    'renterName' => $b->customer ? $b->customer->name : 'Pelanggan',
                    'renterPhone' => $b->customer ? ($b->customer->phone ?? '-') : '-',
                    'destination' => $destination,
                    'departureTime' => $departureTime,
                    'driverName' => $driverName,
                    'status' => $status,
                ];
            });

        // 2. Metrik kartu statistik
        $readyCount = Booking::whereIn('status', ['confirmed', 'pending'])
            ->whereDate('start_at', $today)
            ->count();

        $ongoingCount = Booking::where('status', 'ongoing')->count();
        $completedCount = Booking::where('status', 'completed')->count();

        return response()->json([
            'departures' => $departures,
            'stats' => [
                'ready' => $readyCount,
                'ongoing' => $ongoingCount,
                'completed' => $completedCount,
            ],
        ]);
    }
}