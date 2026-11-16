<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PageContent;
use App\Models\Vehicle;
use Illuminate\Http\JsonResponse;

class PublicContentController extends Controller
{
    // GET /api/public/pages/{slug}
    public function page(string $slug): JsonResponse
    {
        $sections = PageContent::where('page_slug', $slug)
            ->get()
            ->keyBy('section_key');

        $vehicleCount = Vehicle::where('show_on_web', true)->count();
        if ($vehicleCount === 0) {
            $vehicleCount = Vehicle::count();
        }

        return response()->json([
            'page_slug' => $slug,
            'sections' => $sections,
            'stats' => [
                'total_vehicles' => $vehicleCount > 0 ? "{$vehicleCount}+" : "65+",
                'support_hours' => '24/7',
                'satisfaction_rate' => '99.8%',
            ],
        ]);
    }

    // GET /api/public/vehicles (Katalog, Jadwal, Filter Cari & Rincian Lengkap Tarif)
    public function vehicles(): JsonResponse
    {
        $vehicles = Vehicle::with(['photos', 'bookings' => function ($q) {
            $q->whereNotIn('status', ['cancelled', 'completed', 'Dibatalkan', 'Selesai']);
        }])
            ->where('show_on_web', true)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($v) {
                $modelLower = strtolower($v->model ?? '');
                $category = strtolower($v->category ?? '');

                if (str_contains($modelLower, 'hiace') || $category === 'minibus' || ($v->seats ?? 0) >= 12) {
                    $category = 'minibus';
                    $categoryLabel = 'Minibus';
                } elseif (str_contains($modelLower, 'brio') || str_contains($modelLower, 'yaris') || str_contains($modelLower, 'agya') || $category === 'city') {
                    $category = 'city';
                    $categoryLabel = 'City Car';
                } elseif (str_contains($modelLower, 'fortuner') || str_contains($modelLower, 'pajero') || $category === 'suv') {
                    $category = 'suv';
                    $categoryLabel = 'SUV Tough';
                } else {
                    $category = 'mpv';
                    $categoryLabel = $v->category_label ?? (str_contains($modelLower, 'zenix') ? 'Premium MPV' : 'MPV / Keluarga');
                }

                $fallbackImage = 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=800&auto=format&fit=crop';
                if ($category === 'city') {
                    $fallbackImage = 'https://images.unsplash.com/photo-1590362891991-f776e747a588?q=80&w=800&auto=format&fit=crop';
                } elseif ($category === 'suv') {
                    $fallbackImage = 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=800&auto=format&fit=crop';
                } elseif ($category === 'minibus') {
                    $fallbackImage = 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=800&auto=format&fit=crop';
                } elseif (str_contains($modelLower, 'zenix')) {
                    $fallbackImage = 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=800&auto=format&fit=crop';
                }

                $image = $v->image_url ?: $fallbackImage;
                $dailyPrice = (int) ($v->daily_price ?? 0);
                $driverPrice = (int) ($v->driver_price_24h > 0 ? $v->driver_price_24h : ($dailyPrice + 200000));

                // Deteksi Transmisi untuk filter
                $transRaw = strtolower($v->transmission ?? 'automatic');
                $isManual = str_contains($transRaw, 'man');
                $transmissionType = $isManual ? 'manual' : 'matic';
                $transmissionLabel = $v->transmission
                    ? ucfirst($v->transmission)
                    : ($isManual ? 'Manual' : (str_contains($modelLower, 'avanza') || str_contains($modelLower, 'brio') ? 'Automatic (CVT)' : 'Automatic'));

                // Deteksi Plat Ganjil / Genap dari angka terakhir di plate_number
                $plateNumber = $v->plate_number ?? '';
                preg_match_all('/\d+/', $plateNumber, $plateMatches);
                $lastDigit = 0;
                if (!empty($plateMatches[0])) {
                    $digits = implode('', $plateMatches[0]);
                    $lastDigit = (int) substr($digits, -1);
                }
                $plateType = ($lastDigit % 2 === 0) ? 'Plat genap' : 'Plat ganjil';

                $bookedDates = $v->bookings ? $v->bookings->map(function ($b) {
                    $start = $b->start_at ? (is_string($b->start_at) ? substr($b->start_at, 0, 10) : $b->start_at->format('Y-m-d')) : null;
                    $end = $b->end_at ? (is_string($b->end_at) ? substr($b->end_at, 0, 10) : $b->end_at->format('Y-m-d')) : null;
                    return [
                        'startDate' => $start,
                        'endDate' => $end,
                    ];
                })->filter(fn($slot) => !empty($slot['startDate']) && !empty($slot['endDate']))->values()->toArray() : [];

                $isAvailable = in_array(strtolower($v->status ?? ''), ['available', 'tersedia']) && count($bookedDates) === 0;

                // Struktur tarif lengkap untuk halaman /tarif
                $luggage = $v->luggage ?: ($v->seats >= 12 ? '10+ Koper Rombongan' : ($v->seats <= 5 ? '2 Koper Kabin' : '3-4 Koper Sedang'));

                $selfDrive = $category === 'minibus' ? null : [
                    'rate12h' => $v->price_12h ? (int) $v->price_12h : (int) round($dailyPrice * 0.7),
                    'rate24h' => $dailyPrice,
                    'rate30d' => $v->price_30d > 0 ? (int) $v->price_30d : (int) ($dailyPrice * 22),
                    'deposit' => $v->deposit_self_drive > 0 ? (int) $v->deposit_self_drive : 500000,
                ];

                $withDriver = [
                    'rate12h' => $v->driver_price_12h > 0 ? (int) $v->driver_price_12h : (int) round(($dailyPrice + 150000) * 0.8),
                    'rate24h' => $driverPrice,
                    'overtimePerHour' => $v->driver_overtime_hour > 0 ? (int) $v->driver_overtime_hour : 50000,
                    'deposit' => $v->deposit_with_driver > 0 ? (int) $v->deposit_with_driver : 300000,
                    'note' => $category === 'minibus' ? 'Wajib Driver Caruhun' : (str_contains($modelLower, 'zenix') || str_contains($modelLower, 'fortuner') || str_contains($modelLower, 'pajero') ? 'Unit + Driver VIP' : 'Unit + Jasa Driver'),
                ];

                $airport = [
                    'cgk' => $v->airport_cgk > 0 ? (int) $v->airport_cgk : ($dailyPrice >= 1000000 ? 950000 : ($dailyPrice >= 700000 ? 700000 : 500000)),
                    'hlp' => $v->airport_hlp > 0 ? (int) $v->airport_hlp : ($dailyPrice >= 1000000 ? 800000 : ($dailyPrice >= 700000 ? 550000 : 400000)),
                    'whoosh' => $v->airport_whoosh > 0 ? (int) $v->airport_whoosh : ($dailyPrice >= 1000000 ? 800000 : ($dailyPrice >= 700000 ? 550000 : 400000)),
                ];

                $defaultFeatures = $category === 'minibus'
                    ? ['Reclining Seat', 'Full AC Microbus', 'Colokan Charger Phone', 'Bagasi Luas']
                    : ['AC Double Blower', 'Audio Bluetooth', 'Sensor Parkir', 'Kamera Mundur'];

                return [
                    'id' => (string) $v->id,
                    'name' => $v->full_name ?: trim("{$v->brand} {$v->model}"),
                    'brand' => $v->brand,
                    'model' => $v->model,
                    'category' => $category,
                    'categoryLabel' => "{$categoryLabel} • " . ($v->seats ?? 5) . " Kursi",
                    'transmission' => ucfirst($v->transmission ?? 'Automatic'),
                    'transmissionType' => $transmissionType,
                    'transmissionLabel' => $transmissionLabel,
                    'color' => $v->color ?: 'Silver',
                    'plateNumber' => $plateNumber,
                    'plateType' => $plateType,
                    'seats' => (int) ($v->seats ?? 5),
                    'fuelType' => $v->fuel_type ?? 'Bensin',
                    'luggage' => $luggage,
                    'pricePerDay' => $dailyPrice,
                    'priceWithDriverPerDay' => $driverPrice,
                    'image' => $image,
                    'isAvailable' => $isAvailable,
                    'bookedDates' => $bookedDates,
                    'selfDrive' => $selfDrive,
                    'withDriver' => $withDriver,
                    'airport' => $airport,
                    'details' => [
                        'year' => (int) ($v->year ?? 2023),
                        'engine' => $v->engine ?: ($v->seats >= 12 ? '2.500 cc Turbo Diesel' : ($v->seats <= 5 ? '1.200 cc i-VTEC' : '1.500 cc Dual VVT-i')),
                        'description' => $v->notes ?: 'Unit armada selalu dalam kondisi prima, wangi, terawat berkala di bengkel resmi, dan siap menemani perjalanan dinas atau wisata.',
                        'features' => !empty($v->features) && is_array($v->features) ? $v->features : $defaultFeatures,
                    ],
                ];
            });

        return response()->json([
            'data' => $vehicles,
        ]);
    }
}