<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Handover;
use App\Models\Vehicle;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AdminArrivalController extends Controller
{
    /**
     * List monitoring kedatangan armada
     */
    public function index(Request $request): JsonResponse
    {
        $today = Carbon::today();
        $now = Carbon::now();

        // Ambil data bookings untuk monitoring kedatangan/pengembalian
        $arrivals = Booking::with(['vehicle', 'customer', 'handovers'])
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

                $destination = $b->notes ?: 'Rute Sewa / Pool Utama';
                $destLower = strtolower($destination);

                // Tentukan Kategori Layanan
                if (str_contains($destLower, 'bandara') || str_contains($destLower, 'drop') || str_contains($destLower, 'airport')) {
                    $serviceType = 'Drop-off Bandara';
                    $driverName = $b->with_driver ? 'Driver Bandara' : 'Petugas Pool';
                } elseif ($b->with_driver) {
                    $serviceType = 'Dengan Driver';
                    $driverName = 'Driver Caruhun';
                } else {
                    $serviceType = 'Lepas Kunci';
                    $driverName = 'Lepas Kunci (Self-Drive)';
                }

                // Cek apakah sudah pernah check-in kedatangan
                $arrivalHandover = $b->handovers->where('type', 'arrival')->first();

                // Status Operasional Kedatangan:
                if ($b->status === 'completed' || $arrivalHandover) {
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
                    'originOrDestination' => $destination,
                    'estimatedArrival' => $estimatedArrival,
                    'driverName' => $driverName,
                    'serviceType' => $serviceType,
                    'status' => $status,
                ];
            });

        // Metrik statistik kedatangan
        $onTheWayCount = 0;
        $needCheckCount = 0;
        $inspectedDoneCount = 0;
        $lepasKunciCount = 0;
        $denganDriverCount = 0;
        $bandaraCount = 0;

        foreach ($arrivals as $arr) {
            if ($arr['status'] === 'Inspeksi Selesai') {
                $inspectedDoneCount++;
            } elseif ($arr['status'] === 'Tiba di Pool' || $arr['status'] === 'Terlambat') {
                $needCheckCount++;
            } else {
                $onTheWayCount++;
            }

            if ($arr['serviceType'] === 'Drop-off Bandara') {
                $bandaraCount++;
            } elseif ($arr['serviceType'] === 'Dengan Driver') {
                $denganDriverCount++;
            } else {
                $lepasKunciCount++;
            }
        }

        return response()->json([
            'arrivals' => $arrivals,
            'stats' => [
                'onTheWay' => $onTheWayCount,
                'needCheck' => $needCheckCount,
                'inspectedDone' => $inspectedDoneCount,
                'lepasKunci' => $lepasKunciCount,
                'denganDriver' => $denganDriverCount,
                'bandara' => $bandaraCount,
            ],
        ]);
    }

    /**
     * Detail check-in kedatangan unit
     */
    public function show(string $id): JsonResponse
    {
        $cleanId = ltrim($id, '#');

        $booking = Booking::with(['vehicle', 'customer', 'handovers'])
            ->where('id', $id)
            ->orWhere('code', $id)
            ->orWhere('code', '#' . $id)
            ->orWhere('code', $cleanId)
            ->firstOrFail();

        $departureHandover = $booking->handovers->where('type', 'departure')->first();
        $arrivalHandover = $booking->handovers->where('type', 'arrival')->first();

        $start = Carbon::parse($booking->start_at);
        $end = Carbon::parse($booking->end_at);
        $now = Carbon::now();

        $isToday = $end->isToday();
        $isYesterday = $end->isYesterday();
        if ($isToday) {
            $arrivalTimeFormatted = 'Hari Ini, ' . $end->format('H:i') . ' WIB';
        } elseif ($isYesterday) {
            $arrivalTimeFormatted = 'Kemarin, ' . $end->format('H:i') . ' WIB';
        } else {
            $arrivalTimeFormatted = $end->translatedFormat('d M Y, H:i') . ' WIB';
        }

        $durationDays = max(1, $start->diffInDays($end));

        // Tentukan Kategori Layanan
        $destination = $booking->notes ?: 'Rute Sewa / Pool Utama';
        $destLower = strtolower($destination);
        if (str_contains($destLower, 'bandara') || str_contains($destLower, 'drop') || str_contains($destLower, 'airport')) {
            $serviceType = 'Drop-off Bandara';
        } elseif ($booking->with_driver) {
            $serviceType = 'Dengan Driver';
        } else {
            $serviceType = 'Lepas Kunci';
        }

        // Tentukan Status Display
        if ($booking->status === 'completed' || $arrivalHandover) {
            $statusLabel = 'Inspeksi Selesai';
        } elseif ($now->gt($end)) {
            $statusLabel = 'Terlambat';
        } elseif ($isToday && $now->diffInHours($end, false) <= 2) {
            $statusLabel = 'Tiba di Pool';
        } else {
            $statusLabel = 'Dalam Perjalanan';
        }

        // Helper URL storage
        $urlHelper = function ($path) {
            if (!$path) return null;
            if (str_starts_with($path, 'http') || str_starts_with($path, 'data:')) return $path;
            $apiBase = rtrim(config('app.url', 'http://localhost:8000'), '/');
            return $apiBase . '/storage/' . ltrim($path, '/');
        };

        // Parse Data Keberangkatan (SOP & Jaminan)
        $departureData = null;
        if ($departureHandover && $departureHandover->condition_notes) {
            $decoded = json_decode($departureHandover->condition_notes, true);
            if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                $departureData = $decoded;
            }
        }

        // Parse Data Kedatangan (Jika sudah pernah check-in)
        $arrivalData = null;
        if ($arrivalHandover && $arrivalHandover->condition_notes) {
            $decodedArr = json_decode($arrivalHandover->condition_notes, true);
            if (json_last_error() === JSON_ERROR_NONE && is_array($decodedArr)) {
                $arrivalData = $decodedArr;
            }
        }

        return response()->json([
            'id' => (string) $booking->id,
            'bookingCode' => str_starts_with($booking->code, '#') ? $booking->code : '#' . $booking->code,
            'status' => $booking->status,
            'statusLabel' => $statusLabel,
            'serviceType' => $serviceType,
            'arrivalTimeFormatted' => $arrivalTimeFormatted,
            'startDate' => $start->translatedFormat('d M Y, H:i') . ' WIB',
            'endDate' => $end->translatedFormat('d M Y, H:i') . ' WIB',
            'duration' => $durationDays . ' Hari',
            'withDriver' => (bool) $booking->with_driver,
            'destination' => $destination,
            'notes' => $booking->notes,

            'customer' => [
                'id' => $booking->customer ? (string) $booking->customer->id : null,
                'name' => $booking->customer ? $booking->customer->name : 'Pelanggan',
                'phone' => $booking->customer ? ($booking->customer->phone ?? '-') : '-',
                'nik' => $booking->customer ? ($booking->customer->id_number ?: $booking->customer->nik ?: '-') : '-',
                'sim' => $booking->customer ? ($booking->customer->license_number ?? '-') : '-',
            ],

            'vehicle' => [
                'id' => $booking->vehicle ? (string) $booking->vehicle->id : null,
                'name' => $booking->vehicle ? $booking->vehicle->full_name : 'Unit Armada',
                'plateNumber' => $booking->vehicle ? $booking->vehicle->plate_number : '-',
                'transmission' => $booking->vehicle ? ($booking->vehicle->transmission ?? 'Matic') : 'Matic',
                'fuelType' => $booking->vehicle ? ($booking->vehicle->fuel_type ?? 'Bensin') : 'Bensin',
                'poolLocation' => 'Pool Pusat Caruhun',
            ],

            // Data Saat Kendaraan Berangkat Keluar Pool
            'departure' => [
                'odometer' => $departureHandover ? $departureHandover->odometer : 12450,
                'fuelLevel' => $departureHandover ? $departureHandover->fuel_level : 100,
                'handedAt' => $departureHandover && $departureHandover->handed_at ? $departureHandover->handed_at->translatedFormat('d M Y, H:i') : null,
                'conditionNotes' => is_array($departureData) ? ($departureData['notes'] ?? '') : ($departureHandover ? $departureHandover->condition_notes : ''),
                'guarantee' => is_array($departureData) && isset($departureData['guarantee']) ? [
                    'type' => $departureData['guarantee']['type'] ?? 'deposit',
                    'motor_info' => $departureData['guarantee']['motor_info'] ?? null,
                    'deposit_amount' => $departureData['guarantee']['deposit_amount'] ?? 1500000,
                    'photo' => $urlHelper($departureData['guarantee']['photo'] ?? null),
                ] : null,
            ],

            // Data Hasil Check-In Tiba (Jika sudah ada)
            'arrival' => $arrivalHandover ? [
                'id' => (string) $arrivalHandover->id,
                'odometer' => $arrivalHandover->odometer,
                'fuelLevel' => $arrivalHandover->fuel_level,
                'handedAt' => $arrivalHandover->handed_at ? $arrivalHandover->handed_at->translatedFormat('d M Y, H:i') : null,
                'conditionStatus' => is_array($arrivalData) ? ($arrivalData['condition_status'] ?? 'ok') : 'ok',
                'damageDescription' => is_array($arrivalData) ? ($arrivalData['damage_description'] ?? '') : '',
                'estimatedCost' => is_array($arrivalData) ? ($arrivalData['estimated_cost'] ?? 0) : 0,
                'checklist' => is_array($arrivalData) ? ($arrivalData['checklist'] ?? []) : [],
                'guaranteeAction' => is_array($arrivalData) && isset($arrivalData['guarantee']) ? ($arrivalData['guarantee']['action'] ?? 'returned') : 'returned',
                'guaranteeNotes' => is_array($arrivalData) && isset($arrivalData['guarantee']) ? ($arrivalData['guarantee']['notes'] ?? '') : '',
                'photos' => is_array($arrivalData) && isset($arrivalData['photos']) ? [
                    'front' => $urlHelper($arrivalData['photos']['front'] ?? null),
                    'rear' => $urlHelper($arrivalData['photos']['rear'] ?? null),
                    'left' => $urlHelper($arrivalData['photos']['left'] ?? null),
                    'right' => $urlHelper($arrivalData['photos']['right'] ?? null),
                    'odometer' => $urlHelper($arrivalData['photos']['odometer'] ?? null),
                    'damage' => $urlHelper($arrivalData['photos']['damage'] ?? null),
                ] : null,
            ] : null,
        ]);
    }

    /**
     * Eksekusi Check-In Pengembalian Unit ke Pool
     */
    public function checkin(Request $request, string $id): JsonResponse
    {
        $cleanId = ltrim($id, '#');

        $booking = Booking::with(['vehicle', 'customer', 'handovers'])
            ->where('id', $id)
            ->orWhere('code', $id)
            ->orWhere('code', '#' . $id)
            ->orWhere('code', $cleanId)
            ->firstOrFail();

        // 1. Validasi / Normalisasi Bahan Bakar
        $fuel = $request->input('fuel_level');
        $fuelPercent = 100;
        if (is_numeric($fuel)) {
            $fuelPercent = (int) $fuel;
        } elseif ($fuel === 'E') {
            $fuelPercent = 10;
        } elseif ($fuel === '1/4') {
            $fuelPercent = 25;
        } elseif ($fuel === '1/2') {
            $fuelPercent = 50;
        } elseif ($fuel === '3/4') {
            $fuelPercent = 75;
        } elseif ($fuel === 'Full') {
            $fuelPercent = 100;
        }

        // 2. Normalisasi Odometer Akhir
        $rawOdometer = $request->input('odometer');
        $odometerInt = $rawOdometer ? (int) preg_replace('/[^0-9]/', '', (string) $rawOdometer) : 12980;

        // 3. Status Kondisi (ok = Mulus, damaged = Ada Baret / Rusak / Klaim)
        $conditionStatus = $request->input('condition_status', 'ok');
        $damageDescription = $request->input('damage_description', '');
        $estimatedCost = $request->input('estimated_cost', 0);
        $conditionNotes = $request->input('condition_notes', '');

        // 4. Status Pengembalian Jaminan (khusus Lepas Kunci)
        // 'returned' (Jaminan Motor / Deposit telah dikembalikan ke penyewa)
        // 'held' (Jaminan ditahan untuk ganti rugi kerusakan)
        // 'none' (Untuk Dengan Driver / Bandara)
        $guaranteeAction = $request->input('guarantee_action', 'returned');
        $guaranteeNotes = $request->input('guarantee_notes', '');

        // 5. Checklist Kelengkapan Fisik
        $checklist = $request->input('checklist', [
            'bodiAman' => $conditionStatus === 'ok',
            'banUtuh' => true,
            'stnkAda' => true,
            'toolkitLengkap' => true,
            'interiorBersih' => true,
        ]);

        // Helper upload file (UploadedFile atau Base64 Data URL)
        $saveFile = function ($fileOrBase64, $folder = 'inspections') {
            if (!$fileOrBase64) return null;
            if ($fileOrBase64 instanceof \Illuminate\Http\UploadedFile) {
                return $fileOrBase64->store($folder, 'public');
            }
            if (is_string($fileOrBase64) && str_starts_with($fileOrBase64, 'data:image')) {
                $parts = explode(',', $fileOrBase64, 2);
                if (count($parts) === 2) {
                    $decoded = base64_decode($parts[1]);
                    if ($decoded !== false) {
                        $filename = $folder . '/' . Str::random(24) . '.jpg';
                        Storage::disk('public')->put($filename, $decoded);
                        return $filename;
                    }
                }
            }
            if (is_string($fileOrBase64) && !str_starts_with($fileOrBase64, 'data:')) {
                return $fileOrBase64;
            }
            return null;
        };

        // Simpan 5 foto dokumentasi masuk + 1 foto kerusakan jika ada
        $photoFront = $saveFile($request->input('photo_front') ?: $request->file('photo_front'), 'inspections');
        $photoRear = $saveFile($request->input('photo_rear') ?: $request->file('photo_rear'), 'inspections');
        $photoLeft = $saveFile($request->input('photo_left') ?: $request->file('photo_left'), 'inspections');
        $photoRight = $saveFile($request->input('photo_right') ?: $request->file('photo_right'), 'inspections');
        $photoOdometer = $saveFile($request->input('photo_odometer') ?: $request->file('photo_odometer'), 'inspections');
        $photoDamage = $saveFile($request->input('photo_damage') ?: $request->file('photo_damage'), 'claims');

        // Susun payload terstruktur condition_notes
        $arrivalPayload = [
            'condition_status' => $conditionStatus,
            'notes' => $conditionNotes,
            'damage_description' => $damageDescription,
            'estimated_cost' => $estimatedCost,
            'checklist' => $checklist,
            'guarantee' => [
                'action' => $guaranteeAction,
                'notes' => $guaranteeNotes,
            ],
            'photos' => [
                'front' => $photoFront,
                'rear' => $photoRear,
                'left' => $photoLeft,
                'right' => $photoRight,
                'odometer' => $photoOdometer,
                'damage' => $photoDamage,
            ],
            'checked_at' => Carbon::now()->toIso8601String(),
        ];

        DB::transaction(function () use ($booking, $fuelPercent, $odometerInt, $arrivalPayload, $conditionStatus, $damageDescription) {
            // 1. Simpan atau update Handover type 'arrival'
            $handover = Handover::where('booking_id', $booking->id)
                ->where('type', 'arrival')
                ->first();

            if (!$handover) {
                $handover = new Handover();
                $handover->id = (string) Str::uuid();
                $handover->booking_id = $booking->id;
                $handover->type = 'arrival';
            }

            $handover->handed_at = Carbon::now();
            $handover->fuel_level = $fuelPercent;
            $handover->odometer = $odometerInt;
            $handover->condition_notes = json_encode($arrivalPayload, JSON_UNESCAPED_SLASHES);
            $handover->save();

            // 2. Update status Booking
            $booking->status = 'completed';
            $booking->save();

            // 3. Update status Armada Kendaraan
            if ($booking->vehicle) {
                if ($conditionStatus === 'damaged') {
                    // Jika ada kerusakan baru, arahkan kendaraan ke status Perawatan / Maintenance
                    $booking->vehicle->status = 'maintenance';
                    $booking->vehicle->notes = 'Klaim pasca sewa ' . $booking->code . ': ' . ($damageDescription ?: 'Pemeriksaan kerusakan fisik bodi/komponen');
                } else {
                    // Jika mulus, armada langsung berstatus Tersedia
                    $booking->vehicle->status = 'available';
                }
                $booking->vehicle->save();
            }
        });

        return response()->json([
            'success' => true,
            'message' => $conditionStatus === 'damaged'
                ? 'Check-in kedatangan dicatat dengan klaim kerusakan. Status unit dialihkan ke Perawatan.'
                : 'Check-in pengembalian unit berhasil diselesaikan. Unit kini berstatus Tersedia.',
            'bookingId' => (string) $booking->id,
            'bookingCode' => $booking->code,
            'conditionStatus' => $conditionStatus,
        ]);
    }
}
