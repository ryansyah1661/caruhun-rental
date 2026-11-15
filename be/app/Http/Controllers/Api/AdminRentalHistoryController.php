<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Carbon\Carbon;

class AdminRentalHistoryController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $now = Carbon::now();

        // 1. Ambil seluruh riwayat sewa kendaraan dari database
        $rentals = Booking::with(['vehicle', 'customer'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($b) {
                $start = Carbon::parse($b->start_at);
                $end = Carbon::parse($b->end_at);
                $diffDays = max(1, (int) round($start->floatDiffInDays($end)));

                // Format keterangan rentang tanggal & durasi
                $duration = "{$diffDays} Hari ({$start->format('d')} - {$end->translatedFormat('d M Y')})";
                $totalCost = 'Rp ' . number_format($b->price ?? 0, 0, ',', '.');

                // Mapping Status: "Selesai" | "Aktif" | "Dibatalkan"
                if ($b->status === 'completed') {
                    $status = 'Selesai';
                } elseif ($b->status === 'cancelled') {
                    $status = 'Dibatalkan';
                } else {
                    $status = 'Aktif';
                }

                return [
                    'id' => (string) $b->id,
                    'bookingCode' => str_starts_with($b->code, '#') ? $b->code : '#' . $b->code,
                    'unitName' => $b->vehicle ? $b->vehicle->full_name : 'Unit Kendaraan',
                    'nopol' => $b->vehicle ? $b->vehicle->plate_number : '-',
                    'renterName' => $b->customer ? $b->customer->name : 'Pelanggan',
                    'duration' => $duration,
                    'totalCost' => $totalCost,
                    'status' => $status,
                ];
            });

        // 2. Metrik kartu statistik
        // Total sesi transaksi
        $totalSessions = Booking::count();

        // Sewa aktif yang sedang berjalan
        $activeCount = Booking::whereIn('status', ['ongoing', 'confirmed', 'pending'])->count();

        // Total pendapatan dari sewa yang telah selesai
        $totalIncome = Booking::where('status', 'completed')->sum('price');
        if ($totalIncome >= 1000000) {
            $formattedIncome = 'Rp ' . number_format($totalIncome / 1000000, 1, ',', '.') . ' Juta';
        } else {
            $formattedIncome = 'Rp ' . number_format($totalIncome, 0, ',', '.');
        }

        return response()->json([
            'rentals' => $rentals,
            'stats' => [
                'totalSessions' => "{$totalSessions} Sesi",
                'activeCount' => "{$activeCount} Unit",
                'completedIncome' => $formattedIncome,
            ],
        ]);
    }
}