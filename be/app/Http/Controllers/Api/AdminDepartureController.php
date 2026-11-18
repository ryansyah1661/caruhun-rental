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

        return response()->json([
            'id' => (string) $booking->id,
            'bookingCode' => str_starts_with($booking->code, '#') ? $booking->code : '#' . $booking->code,
            'status' => $booking->status,
            'statusLabel' => $statusLabel,
            'departureTime' => $departureTime,
            'startDate' => $start->format('Y-m-d H:i'),
            'endDate' => $end->format('Y-m-d H:i'),
            'duration' => $durationDays . ' Hari',
            'withDriver' => (bool) $booking->with_driver,
            'destination' => $booking->notes ?: 'Dalam Kota / Rute Sewa Standar',
            'notes' => $booking->notes,
            'customer' => [
                'id' => $booking->customer ? (string) $booking->customer->id : null,
                'name' => $booking->customer ? $booking->customer->name : 'Pelanggan',
                'phone' => $booking->customer ? ($booking->customer->phone ?? '-') : '-',
                'nik' => $booking->customer ? ($booking->customer->nik ?? '-') : '-',
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
                'conditionNotes' => $departureHandover->condition_notes,
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
                'condition_notes' => $request->input('condition_notes'),
                'staff_id' => auth()->id(),
                'synced_at' => Carbon::now(),
            ]
        );

        // 2. Update status Booking menjadi 'ongoing'
        $booking->update([
            'status' => 'ongoing',
        ]);

        // 3. Update status Kendaraan menjadi 'rented'
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

            $vehicleId = $request->input('vehicle_id');
            $vehicle = null;
            if (!empty($vehicleId) && Str::isUuid($vehicleId)) {
                $vehicle = Vehicle::find($vehicleId);
            }
            if (!$vehicle) {
                $vehicle = Vehicle::first();
            }
            $vehicleId = $vehicle ? $vehicle->id : null;

            $booking = Booking::create([
                'code' => 'CRH-' . strtoupper(Str::random(6)),
                'vehicle_id' => $vehicleId,
                'customer_id' => $customerId,
                'start_at' => $request->input('start_at', Carbon::now()),
                'end_at' => $request->input('end_at', Carbon::now()->addDays(1)),
                'status' => 'confirmed',
                'with_driver' => $request->boolean('with_driver', false),
                'notes' => $request->input('notes'),
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Jadwal keberangkatan berhasil dibuat.',
            'booking' => $booking,
        ]);
    }
}