<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Vehicle;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Carbon\Carbon;

class AdminClaimController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        // 1. Ambil unit yang berstatus servis / maintenance dari PostgreSQL
        $maintenanceVehicles = Vehicle::where('status', 'maintenance')->get();

        $claims = $maintenanceVehicles->map(function ($v, $index) {
            return [
                'id' => (string) $v->id,
                'code' => '#CLM-' . (990 + $index + 1),
                'unit' => $v->full_name,
                'nopol' => $v->plate_number,
                'issue' => $v->notes ?: 'Perawatan Rutin Bengkel / Pemeriksaan Komponen',
                'reporter' => 'Petugas Lapangan',
                'date' => Carbon::parse($v->updated_at)->translatedFormat('d M Y, H:i'),
                'status' => 'Dalam Perbaikan',
            ];
        });

        // Contoh klaim aktif jika belum ada unit maintenance
        if ($claims->isEmpty()) {
            $claims = collect([
                [
                    'id' => 'claim-1',
                    'code' => '#CLM-991',
                    'unit' => 'Mitsubishi Pajero',
                    'nopol' => 'E 5555 LJ',
                    'issue' => 'AC MATI IDUP (Kompresor perlu dicek)',
                    'reporter' => 'Asha (Penyewa)',
                    'date' => '12 Okt 2026, 10:04',
                    'status' => 'Pending',
                ]
            ]);
        }

        return response()->json([
            'claims' => $claims,
            'total' => $claims->count(),
        ]);
    }
}