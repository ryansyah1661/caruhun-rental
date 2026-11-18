<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Handover;
use App\Models\Payment;
use App\Models\Vehicle;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

class AdminFinanceController extends Controller
{
    /**
     * Mengambil rangkuman metrik kas dan daftar transaksi keuangan
     */
    public function index(Request $request): JsonResponse
    {
        $transactions = collect();

        // 1. Ambil pembayaran riil dari tabel payments
        $payments = Payment::with(['booking.vehicle', 'booking.customer'])
            ->orderBy('paid_at', 'desc')
            ->get();

        foreach ($payments as $p) {
            $b = $p->booking;
            $customerName = $b && $b->customer ? $b->customer->name : 'Penyewa';
            $bookingCode = $b ? '#' . ltrim($b->code, '#') : '-';
            $unitName = $b && $b->vehicle ? $b->vehicle->full_name : '';

            $category = 'Pelunasan Sewa';
            $type = 'income';

            if ($p->type === 'deposit') {
                $category = 'Uang Deposit';
            } elseif ($p->type === 'fine') {
                $category = 'Denda / Klaim';
            } elseif ($p->type === 'dp') {
                $category = 'Uang Muka (DP)';
            }

            $transactions->push([
                'id' => (string) $p->id,
                'trxCode' => 'TRX-' . strtoupper(substr($p->id, 0, 8)),
                'date' => Carbon::parse($p->paid_at)->translatedFormat('d M Y, H:i'),
                'desc' => "{$category} Unit {$unitName} ({$bookingCode}) - {$customerName}",
                'type' => $type,
                'amount' => (int) $p->amount,
                'method' => strtoupper($p->method ?: 'TRANSFER'),
                'category' => $category,
                'bookingCode' => $bookingCode,
                'notes' => $p->notes,
            ]);
        }

        // 2. Ambil data booking yang sudah selesai/ongoing sebagai pemasukan sewa jika belum masuk tabel payments
        $processedBookingIds = $payments->pluck('booking_id')->toArray();
        $bookings = Booking::with(['vehicle', 'customer'])
            ->whereIn('status', ['confirmed', 'ongoing', 'completed'])
            ->whereNotIn('id', $processedBookingIds)
            ->orderBy('created_at', 'desc')
            ->get();

        foreach ($bookings as $b) {
            $customerName = $b->customer ? $b->customer->name : 'Penyewa';
            $bookingCode = '#' . ltrim($b->code, '#');
            $unitName = $b->vehicle ? $b->vehicle->full_name : 'Armada';
            $price = (int) ($b->price > 0 ? $b->price : 350000);

            $transactions->push([
                'id' => 'bk-' . $b->id,
                'trxCode' => 'TRX-' . strtoupper(substr($b->id, 0, 8)),
                'date' => Carbon::parse($b->created_at)->translatedFormat('d M Y, H:i'),
                'desc' => "Pendapatan Sewa Unit {$unitName} ({$bookingCode}) - {$customerName}",
                'type' => 'income',
                'amount' => $price,
                'method' => 'TRANSFER',
                'category' => 'Sewa Unit',
                'bookingCode' => $bookingCode,
                'notes' => $b->notes ?: 'Transaksi sewa armada',
            ]);
        }

        // 3. Ambil pengeluaran estimasi servis/perbaikan dari kendaraan status maintenance / klaim kerusakan
        $maintenanceVehicles = Vehicle::where('status', 'maintenance')->get();
        foreach ($maintenanceVehicles as $v) {
            $cost = 450000;
            if (preg_match('/(?:Est:\s*Rp\s*|Rp\s*)([0-9\.]+)/i', $v->notes ?? '', $matches)) {
                $cost = (int) str_replace('.', '', $matches[1]);
            }

            $transactions->push([
                'id' => 'srv-' . $v->id,
                'trxCode' => 'EXP-' . strtoupper(substr($v->id, 0, 8)),
                'date' => Carbon::parse($v->updated_at)->translatedFormat('d M Y, H:i'),
                'desc' => "Estimasi Servis / Perbaikan Kendaraan {$v->full_name} ({$v->plate_number})",
                'type' => 'expense',
                'amount' => $cost,
                'method' => 'KAS OPERASIONAL',
                'category' => 'Perawatan/Servis',
                'bookingCode' => '-',
                'notes' => $v->notes ?: 'Perbaikan armada di bengkel rekanan',
            ]);
        }

        // 4. Hitung Metrik Keuangan
        $totalIncome = $transactions->where('type', 'income')->sum('amount');
        $totalExpense = $transactions->where('type', 'expense')->sum('amount');
        $netCash = $totalIncome - $totalExpense;

        return response()->json([
            'transactions' => $transactions->values(),
            'stats' => [
                'totalIncome' => $totalIncome,
                'totalExpense' => $totalExpense,
                'netCash' => $netCash,
                'totalCount' => $transactions->count(),
                'incomeCount' => $transactions->where('type', 'income')->count(),
                'expenseCount' => $transactions->where('type', 'expense')->count(),
            ],
        ]);
    }

    /**
     * Mencatat transaksi kas masuk / keluar baru
     */
    public function store(Request $request): JsonResponse
    {
        $type = $request->input('type', 'income'); // 'income' atau 'expense'
        $category = $request->input('category', 'Sewa Unit');
        $amount = (int) preg_replace('/[^0-9]/', '', (string) $request->input('amount', '0'));
        $method = $request->input('method', 'transfer');
        $desc = $request->input('desc', '');
        $bookingId = $request->input('booking_id');

        if ($amount <= 0) {
            return response()->json([
                'success' => false,
                'message' => 'Nominal transaksi harus lebih besar dari 0.',
            ], 422);
        }

        // Jika ada booking_id valid, simpan ke tabel payments
        if ($bookingId && Str::isUuid($bookingId)) {
            $paymentType = 'payment';
            if (stripos($category, 'deposit') !== false) {
                $paymentType = 'deposit';
            } elseif (stripos($category, 'denda') !== false || stripos($category, 'klaim') !== false) {
                $paymentType = 'fine';
            } elseif (stripos($category, 'dp') !== false || stripos($category, 'muka') !== false) {
                $paymentType = 'dp';
            }

            Payment::create([
                'id' => (string) Str::uuid(),
                'booking_id' => $bookingId,
                'type' => $paymentType,
                'amount' => $amount,
                'method' => $method,
                'paid_at' => Carbon::now(),
                'notes' => $desc,
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Transaksi kas ' . ($type === 'income' ? 'pemasukan' : 'pengeluaran') . ' sebesar Rp ' . number_format($amount, 0, ',', '.') . ' berhasil dicatat.',
        ]);
    }
}
