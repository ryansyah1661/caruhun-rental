<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Vehicle;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Carbon\Carbon;

class AdminBookingController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $statusMap = [
            'confirmed' => 'Dipesan',
            'pending' => 'Dipesan',
            'ongoing' => 'Disewa',
            'completed' => 'Selesai',
            'maintenance' => 'Servis',
            'cancelled' => 'Selesai',
        ];

        $bookings = Booking::with(['vehicle', 'customer'])
            ->orderBy('start_at', 'desc')
            ->get()
            ->map(function ($b) use ($statusMap) {
                $v = $b->vehicle;
                $c = $b->customer;

                $start = Carbon::parse($b->start_at);
                $end = Carbon::parse($b->end_at);
                $diffDays = max(1, (int) round($start->floatDiffInDays($end)));

                // Hitung inisial unit (e.g. "BRO", "AVZ", "ZNX", "XPD", "FTN", "HAC")
                $modelName = $v ? $v->model : 'Mobil';
                $words = explode(' ', $modelName);
                $unitInitial = strtoupper(substr($words[0], 0, 3));
                if (count($words) > 1 && strlen($unitInitial) < 3) {
                    $unitInitial .= strtoupper(substr($words[1], 0, 1));
                }

                $statusLabel = $statusMap[$b->status] ?? 'Dipesan';
                if ($v && $v->status === 'maintenance') {
                    $statusLabel = 'Servis';
                }

                return [
                    'id' => (string) $b->id,
                    'bookingCode' => str_starts_with($b->code, '#') ? $b->code : '#' . $b->code,
                    'renterName' => $c ? $c->name : 'Pelanggan',
                    'renterPhone' => $c ? ($c->phone ?? '-') : '-',
                    'isKtpVerified' => !empty($c?->id_number),
                    'isSimActive' => true,
                    'unitName' => $v ? $v->full_name : 'Unit Kendaraan',
                    'unitInitial' => $unitInitial,
                    'shortNopol' => $v ? $v->plate_number : '-',
                    'unitSpecs' => $v ? (ucfirst($v->transmission ?? 'Matic') . ' • ' . ($v->seats ?? 7) . ' Kursi') : '-',
                    'date' => (int) $start->day,
                    'month' => (int) ($start->month - 1), // 0-indexed for JavaScript Date
                    'year' => (int) $start->year,
                    'startDateFull' => $start->translatedFormat('d M Y • H:i') . ' WIB',
                    'endDateFull' => $end->translatedFormat('d M Y • H:i') . ' WIB',
                    'duration' => "{$diffDays} Hari",
                    'status' => $statusLabel,
                    'poolLocation' => $v?->notes ?? 'Pool Utama',
                    'adminName' => 'Admin Operasional',
                    'category' => $v?->category ?? 'mpv',
                ];
            });

        // Hitung total unit dan kategori
        $totalVehicles = Vehicle::count();
        $mpvCount = Vehicle::where('category', 'mpv')->orWhere('seats', '>=', 7)->count();

        return response()->json([
            'bookings' => $bookings,
            'counts' => [
                'total' => $totalVehicles,
                'mpv' => $mpvCount,
            ]
        ]);
    }
}
