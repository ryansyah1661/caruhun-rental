<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Vehicle;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Carbon\Carbon;

class AdminDashboardController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $today = Carbon::today();

        // 1. KPI Counts
        $totalVehicles = Vehicle::count();
        $availableCount = Vehicle::where('status', 'available')->count();
        $bookedCount = Vehicle::where('status', 'booked')->count();
        $rentedCount = Vehicle::where('status', 'rented')->count();
        $maintenanceCount = Vehicle::where('status', 'maintenance')->count();

        // 2. Daftar Armada (Fleet Monitoring)
        $vehicles = Vehicle::latest()->get()->map(function ($v) {
            $statusMap = [
                'available' => 'Tersedia',
                'booked' => 'Dipesan',
                'rented' => 'Disewa',
                'maintenance' => 'Servis',
            ];

            return [
                'id' => (string) $v->id,
                'name' => $v->full_name,
                'nopol' => $v->plate_number,
                'transmission' => ucfirst($v->transmission ?? 'Matic'),
                'year' => (int) ($v->year ?? Carbon::now()->year),
                'category' => $v->category ?? ($v->seats ? "{$v->seats}-Seater" : 'MPV'),
                'status' => $statusMap[$v->status] ?? 'Tersedia',
                'odometer' => $v->odometer ?? '0 km',
                'fuel' => $v->fuel ?? 'BBM 80%',
                'fuelPercentage' => (int) ($v->fuel_percentage ?? 80),
                'actionText' => 'Kelola Unit',
                'actionHref' => "/admin/kendaraan/{$v->id}",
            ];
        });

        // 3. Jadwal Keberangkatan Hari Ini (Departures: start_at hari ini)
        $departures = Booking::with(['vehicle', 'customer'])
            ->whereDate('start_at', $today)
            ->orderBy('start_at', 'asc')
            ->get()
            ->map(function ($b) {
                return [
                    'id' => (string) $b->id,
                    'code' => $b->code,
                    'time' => Carbon::parse($b->start_at)->format('H:i'),
                    'unitName' => $b->vehicle ? $b->vehicle->full_name : 'Unit Tidak Ditemukan',
                    'nopol' => $b->vehicle ? $b->vehicle->plate_number : '-',
                    'renterName' => $b->customer ? $b->customer->name : 'Pelanggan',
                    'type' => $b->with_driver ? 'Paket Driver' : 'Lepas Kunci',
                    'status' => $b->status,
                ];
            });

        // 4. Jadwal Kedatangan/Pengembalian Hari Ini (Arrivals: end_at hari ini)
        $arrivals = Booking::with(['vehicle', 'customer'])
            ->whereDate('end_at', $today)
            ->orderBy('end_at', 'asc')
            ->get()
            ->map(function ($b) {
                $isOverdue = Carbon::now()->gt(Carbon::parse($b->end_at)) && in_array($b->status, ['ongoing', 'confirmed']);
                return [
                    'id' => (string) $b->id,
                    'code' => $b->code,
                    'time' => Carbon::parse($b->end_at)->format('H:i'),
                    'unitName' => $b->vehicle ? $b->vehicle->full_name : 'Unit Tidak Ditemukan',
                    'nopol' => $b->vehicle ? $b->vehicle->plate_number : '-',
                    'renterName' => $b->customer ? $b->customer->name : 'Pelanggan',
                    'isOverdue' => $isOverdue,
                    'status' => $b->status,
                ];
            });

        // 5. Peringatan Keterlambatan (Overdue Bookings)
        $overdueAlerts = Booking::with(['vehicle', 'customer'])
            ->where('end_at', '<', Carbon::now())
            ->whereIn('status', ['ongoing', 'confirmed'])
            ->get()
            ->map(function ($b) {
                $diffHours = Carbon::parse($b->end_at)->diffInHours(Carbon::now());
                return [
                    'id' => (string) $b->id,
                    'code' => $b->code,
                    'unitName' => $b->vehicle ? $b->vehicle->full_name : 'Unit',
                    'nopol' => $b->vehicle ? $b->vehicle->plate_number : '-',
                    'renterName' => $b->customer ? $b->customer->name : 'Penyewa',
                    'renterPhone' => $b->customer ? $b->customer->phone : null,
                    'hoursLate' => max(1, $diffHours),
                ];
            });

        // 6. Rental Sedang Berjalan (Active / Ongoing Rentals)
        $activeRentals = Booking::with(['vehicle', 'customer'])
            ->whereIn('status', ['ongoing', 'confirmed'])
            ->latest()
            ->take(4)
            ->get()
            ->map(function ($b) {
                $isOverdue = Carbon::now()->gt(Carbon::parse($b->end_at));
                $priceFormatted = 'Rp' . number_format($b->price ?? 0, 0, ',', '.');

                return [
                    'id' => (string) $b->id,
                    'unitName' => $b->vehicle ? $b->vehicle->full_name : 'Kendaraan',
                    'nopol' => $b->vehicle ? $b->vehicle->plate_number : '-',
                    'renterName' => $b->customer ? $b->customer->name : 'Pelanggan',
                    'renterPhone' => $b->customer ? ($b->customer->phone ?? '-') : '-',
                    'departureTime' => Carbon::parse($b->start_at)->translatedFormat('d M, H:i'),
                    'returnTime' => Carbon::parse($b->end_at)->translatedFormat('d M, H:i'),
                    'totalFee' => $priceFormatted,
                    'paymentStatus' => 'Sewa Lunas',
                    'remainingFee' => 'Rp0',
                    'extraNote' => null,
                    'adminName' => 'Admin Operasional',
                    'isOverdue' => $isOverdue,
                ];
            });

        return response()->json([
            'kpi' => [
                'total' => $totalVehicles,
                'available' => $availableCount,
                'booked' => $bookedCount,
                'rented' => $rentedCount,
                'maintenance' => $maintenanceCount,
            ],
            'vehicles' => $vehicles,
            'departures' => $departures,
            'arrivals' => $arrivals,
            'overdueAlerts' => $overdueAlerts,
            'activeRentals' => $activeRentals,
        ]);
    }
}
