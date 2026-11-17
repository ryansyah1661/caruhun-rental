<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Carbon\Carbon;
use Illuminate\Http\Request;

class AdminBookingController extends Controller
{
    public function index(Request $request)
    {
        $query = Booking::with(['vehicle', 'customer'])->orderBy('start_at', 'asc');

        if ($request->filled('month') && $request->filled('year')) {
            $month = (int) $request->month;
            $year = (int) $request->year;
            $query->whereYear('start_at', $year)->whereMonth('start_at', $month);
        }

        $bookings = $query->get();

        $statusMap = [
            'confirmed' => 'Dipesan',
            'ongoing' => 'Disewa',
            'completed' => 'Selesai',
            'maintenance' => 'Servis',
            'cancelled' => 'Batal',
        ];

        $mapped = $bookings->map(function ($b) use ($statusMap) {
            $start = Carbon::parse($b->start_at);
            $end = Carbon::parse($b->end_at);

            return [
                'id' => $b->id,
                'bookingCode' => $b->booking_code ?? ('#CRH-' . str_pad($b->id, 4, '0', STR_PAD_LEFT)),
                'date' => (int) $start->format('j'),
                'month' => ((int) $start->format('n')) - 1,
                'year' => (int) $start->format('Y'),
                'time' => $start->format('H:i') . ' WIB',
                'category' => $b->vehicle->category ?? 'MPV',
                'unitCode' => strtoupper(substr($b->vehicle->model ?? 'UNIT', 0, 3)),
                'shortNopol' => $b->vehicle->license_plate ?? 'B 0000 XX',
                'unitName' => trim(($b->vehicle->brand ?? '') . ' ' . ($b->vehicle->model ?? 'Armada')),
                'renterName' => $b->customer->name ?? 'Pelanggan Caruhun',
                'renterPhone' => $b->customer->phone ?? '08123456789',
                'status' => $statusMap[$b->status] ?? 'Dipesan',
                'startDateFull' => $start->translatedFormat('d M Y') . ' • ' . $start->format('H:i') . ' WIB',
                'endDateFull' => $end->translatedFormat('d M Y') . ' • ' . $end->format('H:i') . ' WIB',
                'duration' => $start->diffInDays($end) . ' Hari',
                'totalAmount' => (int) ($b->total_price ?? 0),
                'depositAmount' => (int) ($b->down_payment ?? 0),
                'notes' => $b->notes ?? '',
            ];
        });

        return response()->json([
            'bookings' => $mapped,
        ]);
    }

    public function show($id)
    {
        $booking = Booking::with(['vehicle', 'customer'])->findOrFail($id);

        return response()->json([
            'booking' => $booking,
        ]);
    }

    public function update(Request $request, $id)
    {
        $booking = Booking::with('customer')->findOrFail($id);

        $data = $request->validate([
            'start_at' => 'nullable|date',
            'end_at' => 'nullable|date',
            'status' => 'nullable|string',
            'notes' => 'nullable|string',
            'renter_name' => 'nullable|string|max:255',
            'renter_phone' => 'nullable|string|max:50',
        ]);

        $statusReverse = [
            'Dipesan' => 'confirmed',
            'Disewa' => 'ongoing',
            'Selesai' => 'completed',
            'Servis' => 'maintenance',
        ];

        if (!empty($data['start_at'])) {
            $booking->start_at = Carbon::parse($data['start_at']);
        }

        if (!empty($data['end_at'])) {
            $booking->end_at = Carbon::parse($data['end_at']);
        }

        if (!empty($data['status'])) {
            $booking->status = $statusReverse[$data['status']] ?? strtolower($data['status']);
        }

        if (isset($data['notes'])) {
            $booking->notes = $data['notes'];
        }

        $booking->save();

        if ($booking->customer && (!empty($data['renter_name']) || !empty($data['renter_phone']))) {
            if (!empty($data['renter_name'])) {
                $booking->customer->name = $data['renter_name'];
            }
            if (!empty($data['renter_phone'])) {
                $booking->customer->phone = $data['renter_phone'];
            }
            $booking->customer->save();
        }

        return response()->json([
            'message' => 'Data dan jadwal booking berhasil diperbarui.',
            'booking' => $booking->load(['vehicle', 'customer']),
        ]);
    }
}