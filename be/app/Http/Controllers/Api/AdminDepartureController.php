<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Customer;
use App\Models\Handover;
use App\Models\Vehicle;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Str;

class AdminDepartureController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $today = Carbon::today();

        // 1. Ambil data bookings yang relevan untuk keberangkatan armada
        $departures = Booking::with(['vehicle', 'customer', 'handovers'])
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

                $destination = $b->notes ?: 'Dalam Kota / Rute Sewa Standar';
                $destLower = strtolower($destination);
                if (str_contains($destLower, 'bandara') || str_contains($destLower, 'drop') || str_contains($destLower, 'airport')) {
                    $serviceType = 'Drop-off Bandara';
                    $driverName = 'Driver: Antar Jemput Bandara';
                } elseif ($b->with_driver) {
                    $serviceType = 'Dengan Driver';
                    $driverName = 'Driver Ditugaskan';
                } else {
                    $serviceType = 'Lepas Kunci';
                    $driverName = 'Lepas Kunci (Self-Drive)';
                }

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
                    'serviceType' => $serviceType,
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

    public function show($id): JsonResponse
    {
        $booking = Booking::with(['vehicle', 'customer', 'handovers'])
            ->where('id', $id)
            ->orWhere('code', $id)
            ->orWhere('code', '#' . $id)
            ->firstOrFail();

        $departureHandover = $booking->handovers->where('type', 'departure')->first();

        $start = Carbon::parse($booking->start_at);
        $end = Carbon::parse($booking->end_at);

        $departureTime = $start->translatedFormat('d M Y, H:i') . ' WIB';
        if ($start->isToday()) {
            $departureTime = 'Hari Ini, ' . $start->format('H:i') . ' WIB';
        }

        $durationDays = max(1, $start->diffInDays($end));

        // Tentukan status display
        if ($booking->status === 'completed') {
            $statusLabel = 'Selesai';
        } elseif ($booking->status === 'ongoing') {
            $statusLabel = 'Dalam Perjalanan';
        } elseif (Carbon::now()->gt($start)) {
            $statusLabel = 'Tertunda';
        } else {
            $statusLabel = 'Siap Berangkat';
        }

        $sopData = null;
        if ($departureHandover && $departureHandover->condition_notes) {
            $decoded = json_decode($departureHandover->condition_notes, true);
            if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                $sopData = $decoded;
            }
        }

        $urlHelper = function ($path) {
            if (!$path) return null;
            if (str_starts_with($path, 'http') || str_starts_with($path, 'data:')) return $path;
            $apiBase = rtrim(config('app.url', 'http://localhost:8000'), '/');
            return $apiBase . '/storage/' . ltrim($path, '/');
        };

        $destination = $booking->notes ?: 'Dalam Kota / Rute Sewa Standar';
        $destLower = strtolower($destination);
        if (str_contains($destLower, 'bandara') || str_contains($destLower, 'drop') || str_contains($destLower, 'airport')) {
            $serviceType = 'Drop-off Bandara';
        } elseif ($booking->with_driver) {
            $serviceType = 'Dengan Driver';
        } else {
            $serviceType = 'Lepas Kunci';
        }

        return response()->json([
            'id' => (string) $booking->id,
            'bookingCode' => str_starts_with($booking->code, '#') ? $booking->code : '#' . $booking->code,
            'status' => $booking->status,
            'statusLabel' => $statusLabel,
            'serviceType' => $serviceType,
            'departureTime' => $departureTime,
            'startDate' => $start->format('Y-m-d H:i'),
            'endDate' => $end->format('Y-m-d H:i'),
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
                'address' => $booking->customer ? ($booking->customer->address ?? '-') : '-',
            ],
            'vehicle' => [
                'id' => $booking->vehicle ? (string) $booking->vehicle->id : null,
                'name' => $booking->vehicle ? $booking->vehicle->full_name : 'Unit Armada',
                'brand' => $booking->vehicle ? $booking->vehicle->brand : '',
                'model' => $booking->vehicle ? $booking->vehicle->model : '',
                'plateNumber' => $booking->vehicle ? $booking->vehicle->plate_number : '-',
                'transmission' => $booking->vehicle ? ($booking->vehicle->transmission ?? 'Matic') : 'Matic',
                'fuelType' => $booking->vehicle ? ($booking->vehicle->fuel_type ?? 'Bensin') : 'Bensin',
                'poolLocation' => 'Pool Pusat Caruhun',
            ],
            'handover' => $departureHandover ? [
                'id' => (string) $departureHandover->id,
                'fuelLevel' => $departureHandover->fuel_level,
                'odometer' => $departureHandover->odometer,
                'conditionNotes' => is_array($sopData) ? ($sopData['notes'] ?? '') : $departureHandover->condition_notes,
                'sopDocuments' => is_array($sopData) && isset($sopData['documents']) ? [
                    'ktp_number' => $sopData['documents']['ktp_number'] ?? null,
                    'ktp_photo' => $urlHelper($sopData['documents']['ktp_photo'] ?? null),
                    'sim_number' => $sopData['documents']['sim_number'] ?? null,
                    'sim_photo' => $urlHelper($sopData['documents']['sim_photo'] ?? null),
                    'kk_status' => $sopData['documents']['kk_status'] ?? 'tidak_ada',
                    'kk_photo' => $urlHelper($sopData['documents']['kk_photo'] ?? null),
                    'npwp_status' => $sopData['documents']['npwp_status'] ?? 'tidak_ada',
                    'npwp_photo' => $urlHelper($sopData['documents']['npwp_photo'] ?? null),
                    'id_card_status' => $sopData['documents']['id_card_status'] ?? 'tidak_ada',
                    'id_card_photo' => $urlHelper($sopData['documents']['id_card_photo'] ?? null),
                    'social_media' => $sopData['documents']['social_media'] ?? null,
                    'emergency_family_name' => $sopData['documents']['emergency_family_name'] ?? null,
                    'emergency_family_phone' => $sopData['documents']['emergency_family_phone'] ?? null,
                    'emergency_peer_name' => $sopData['documents']['emergency_peer_name'] ?? null,
                    'emergency_peer_phone' => $sopData['documents']['emergency_peer_phone'] ?? null,
                ] : null,
                'sopGuarantee' => is_array($sopData) && isset($sopData['guarantee']) ? [
                    'type' => $sopData['guarantee']['type'] ?? 'deposit',
                    'motor_info' => $sopData['guarantee']['motor_info'] ?? null,
                    'deposit_amount' => $sopData['guarantee']['deposit_amount'] ?? 1500000,
                    'photo' => $urlHelper($sopData['guarantee']['photo'] ?? null),
                ] : null,
                'handedAt' => $departureHandover->handed_at ? $departureHandover->handed_at->translatedFormat('d M Y, H:i') : null,
            ] : null,
        ]);
    }

    public function checkout(Request $request, $id): JsonResponse
    {
        $booking = Booking::with(['vehicle', 'customer'])
            ->where('id', $id)
            ->orWhere('code', $id)
            ->orWhere('code', '#' . $id)
            ->firstOrFail();

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

        $rawOdometer = $request->input('odometer');
        $odometerInt = $rawOdometer ? (int) preg_replace('/[^0-9]/', '', (string) $rawOdometer) : null;

        // Helper fungsi simpan file gambar (mendukung UploadedFile dan Base64 Data URL)
        $saveFile = function ($fileOrBase64, $folder = 'documents') {
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
                        \Illuminate\Support\Facades\Storage::disk('public')->put($filename, $decoded);
                        return $filename;
                    }
                }
            }
            if (is_string($fileOrBase64) && !str_starts_with($fileOrBase64, 'data:')) {
                return $fileOrBase64;
            }
            return null;
        };

        // Simpan dokumen SOP yang diunggah
        $ktpPath = $saveFile($request->input('ktp_photo') ?: $request->file('ktp_photo'), 'documents');
        $simPath = $saveFile($request->input('sim_photo') ?: $request->file('sim_photo'), 'documents');
        $kkPath = $saveFile($request->input('kk_photo') ?: $request->file('kk_photo'), 'documents');
        $npwpPath = $saveFile($request->input('npwp_photo') ?: $request->file('npwp_photo'), 'documents');
        $idCardPath = $saveFile($request->input('id_card_photo') ?: $request->file('id_card_photo'), 'documents');
        $guaranteePath = $saveFile($request->input('guarantee_photo') ?: $request->file('guarantee_photo'), 'documents');

        // Susun data terstruktur SOP Persyaratan & Jaminan Lepas Kunci
        $sopPayload = [
            'notes' => $request->input('condition_notes'),
            'documents' => [
                'ktp_number' => $request->input('ktp_number'),
                'ktp_photo' => $ktpPath,
                'sim_number' => $request->input('sim_number'),
                'sim_photo' => $simPath,
                'kk_status' => $request->input('kk_status', 'tidak_ada'),
                'kk_photo' => $kkPath,
                'npwp_status' => $request->input('npwp_status', 'tidak_ada'),
                'npwp_photo' => $npwpPath,
                'id_card_status' => $request->input('id_card_status', 'tidak_ada'),
                'id_card_photo' => $idCardPath,
                'social_media' => $request->input('social_media'),
                'emergency_family_name' => $request->input('emergency_family_name'),
                'emergency_family_phone' => $request->input('emergency_family_phone'),
                'emergency_peer_name' => $request->input('emergency_peer_name'),
                'emergency_peer_phone' => $request->input('emergency_peer_phone'),
            ],
            'guarantee' => [
                'type' => $request->input('guarantee_type', 'deposit'),
                'motor_info' => $request->input('guarantee_motor_info'),
                'deposit_amount' => $request->input('guarantee_deposit_amount', 1500000),
                'photo' => $guaranteePath,
            ],
        ];

        // 1. Simpan atau perbarui catatan Handover Serah Terima
        $handover = Handover::updateOrCreate(
            [
                'booking_id' => $booking->id,
                'type' => 'departure',
            ],
            [
                'handed_at' => Carbon::now(),
                'fuel_level' => $fuelPercent,
                'odometer' => $odometerInt,
                'condition_notes' => json_encode($sopPayload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE),
                'staff_id' => auth()->id(),
                'synced_at' => Carbon::now(),
            ]
        );

        // 2. Perbarui data master Customer jika ada input KTP / SIM baru
        if ($booking->customer) {
            $customerUpdates = [];
            if ($request->filled('ktp_number')) $customerUpdates['id_number'] = $request->input('ktp_number');
            if ($request->filled('sim_number')) $customerUpdates['license_number'] = $request->input('sim_number');
            if ($ktpPath) $customerUpdates['id_card_path'] = $ktpPath;
            if ($simPath) $customerUpdates['license_path'] = $simPath;
            if (!empty($customerUpdates)) {
                $booking->customer->update($customerUpdates);
            }
        }

        // 3. Update status Booking menjadi 'ongoing'
        $booking->update([
            'status' => 'ongoing',
        ]);

        // 4. Update status Kendaraan menjadi 'rented'
        if ($booking->vehicle) {
            $booking->vehicle->update([
                'status' => 'rented',
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Serah terima keberangkatan berhasil disimpan. Status unit kini resmi Disewa (Dalam Perjalanan).',
            'booking' => $booking->fresh(['vehicle', 'customer']),
            'handover' => $handover,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'booking_id' => 'nullable',
            'vehicle_id' => 'nullable',
            'customer_name' => 'nullable|string',
            'customer_phone' => 'nullable|string',
            'start_at' => 'nullable|date',
            'end_at' => 'nullable|date',
            'notes' => 'nullable|string',
            'with_driver' => 'nullable|boolean',
        ]);

        if (!empty($validated['booking_id'])) {
            $booking = Booking::findOrFail($validated['booking_id']);
            $booking->update([
                'notes' => $request->input('notes', $booking->notes),
                'with_driver' => $request->boolean('with_driver', $booking->with_driver),
            ]);
        } else {
            // Cari / Buat customer jika nama diisi
            $customerId = null;
            if ($request->filled('customer_name')) {
                $customer = Customer::firstOrCreate(
                    ['phone' => $request->input('customer_phone') ?: '0812' . rand(1000000, 9999999)],
                    ['name' => $request->input('customer_name')]
                );
                $customerId = $customer->id;
            }

            // Validasi format UUID untuk vehicle_id dari PostgreSQL
            $vehicleId = $request->input('vehicle_id');
            $vehicle = null;
            if (!empty($vehicleId) && Str::isUuid($vehicleId)) {
                $vehicle = Vehicle::find($vehicleId);
            }
            if (!$vehicle) {
                $vehicle = Vehicle::first();
            }
            $vehicleId = $vehicle ? $vehicle->id : null;

            $serviceType = $request->input('service_type', 'Lepas Kunci');
            $withDriver = ($serviceType !== 'Lepas Kunci') || $request->boolean('with_driver', false);
            $notes = $request->input('notes', '');
            if ($serviceType === 'Drop-off Bandara' && !str_contains(strtolower($notes), 'bandara')) {
                $notes = '[Drop-off Bandara] ' . $notes;
            }

            $booking = Booking::create([
                'code' => 'CRH-' . strtoupper(Str::random(6)),
                'vehicle_id' => $vehicleId,
                'customer_id' => $customerId,
                'start_at' => $request->input('start_at', Carbon::now()),
                'end_at' => $request->input('end_at', Carbon::now()->addDays(1)),
                'status' => 'confirmed',
                'with_driver' => $withDriver,
                'notes' => $notes,
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Jadwal keberangkatan berhasil dibuat.',
            'booking' => $booking,
        ]);
    }
}