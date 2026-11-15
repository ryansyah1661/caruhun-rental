<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Carbon\Carbon;

class AdminInspectionController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        // Ambil data transaksi booking dari PostgreSQL untuk menghasilkan riwayat log inspeksi keluar & masuk
        $inspections = Booking::with(['vehicle', 'customer'])
            ->orderBy('start_at', 'desc')
            ->get()
            ->flatMap(function ($b) {
                $start = Carbon::parse($b->start_at);
                $end = Carbon::parse($b->end_at);
                $records = [];

                // 1. Log Pemeriksaan Keluar (Check-Out)
                $records[] = [
                    'id' => $b->id . '-out',
                    'code' => '#INS-OUT-' . substr(preg_replace('/[^0-9]/', '', $b->code) ?: '101', -3),
                    'unit' => $b->vehicle ? $b->vehicle->full_name : 'Unit Kendaraan',
                    'nopol' => $b->vehicle ? $b->vehicle->plate_number : '-',
                    'type' => 'Keluar (Check-Out)',
                    'pic' => 'Budi Santoso',
                    'date' => $start->translatedFormat('d M Y, H:i'),
                    'status' => 'Selesai',
                ];

                // 2. Log Pemeriksaan Masuk (Check-In) untuk unit yang sudah jalan / selesai
                if (in_array($b->status, ['completed', 'ongoing'])) {
                    $records[] = [
                        'id' => $b->id . '-in',
                        'code' => '#INS-IN-' . substr(preg_replace('/[^0-9]/', '', $b->code) ?: '102', -3),
                        'unit' => $b->vehicle ? $b->vehicle->full_name : 'Unit Kendaraan',
                        'nopol' => $b->vehicle ? $b->vehicle->plate_number : '-',
                        'type' => 'Masuk (Check-In)',
                        'pic' => 'Naila',
                        'date' => $end->translatedFormat('d M Y, H:i'),
                        'status' => $b->status === 'completed' ? 'Selesai (Deposit 100%)' : 'Dalam Pengecekan',
                    ];
                }

                return $records;
            })
            ->values();

        return response()->json([
            'inspections' => $inspections,
            'total' => $inspections->count(),
        ]);
    }
}