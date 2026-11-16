<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminAttendanceController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $today = Carbon::today()->toDateString();
        $date = $request->query('date', $today);

        // Ambil data absensi hari ini dari database
        $recordedAttendances = Attendance::whereDate('date', $date)
            ->latest()
            ->get();

        // Ambil seluruh user/staf dari database
        $users = User::all();
        $recordedUserIds = $recordedAttendances->pluck('user_id')->filter()->toArray();

        $items = $recordedAttendances->map(function ($a) {
            return [
                'id' => (string) $a->id,
                'userId' => $a->user_id ? (string) $a->user_id : null,
                'name' => $a->user_name ?: ($a->user ? $a->user->name : 'Staff'),
                'role' => $a->role ?: ($a->user ? $a->user->role : 'petugas'),
                'clockIn' => $a->clock_in ?: '-',
                'clockOut' => $a->clock_out ?: '-',
                'status' => $a->status ?: 'Hadir',
                'location' => $a->location ?: 'Pool Utama',
                'notes' => $a->notes ?: '-',
            ];
        })->toArray();

        // Staf yang belum absen otomatis ditampilkan sebagai 'Belum Hadir'
        foreach ($users as $u) {
            if (!in_array($u->id, $recordedUserIds, true)) {
                $items[] = [
                    'id' => 'unrecorded-' . $u->id,
                    'userId' => (string) $u->id,
                    'name' => $u->name,
                    'role' => $u->role,
                    'clockIn' => '-',
                    'clockOut' => '-',
                    'status' => 'Belum Hadir',
                    'location' => '-',
                    'notes' => 'Belum absensi hari ini',
                ];
            }
        }

        return response()->json([
            'date' => $date,
            'attendances' => $items,
            'total' => count($items),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'user_id' => ['nullable'],
            'name' => ['required', 'string', 'max:255'],
            'role' => ['nullable', 'string'],
            'status' => ['required', 'string'], // Hadir, Izin, Alpha, Sakit
            'location' => ['nullable', 'string'],
            'notes' => ['nullable', 'string'],
        ]);

        $today = Carbon::today()->toDateString();
        $now = Carbon::now()->format('H:i') . ' WIB';

        $attendance = Attendance::updateOrCreate(
            [
                'user_id' => $data['user_id'] ?? null,
                'date' => $today,
            ],
            [
                'user_name' => $data['name'],
                'role' => $data['role'] ?? 'petugas',
                'clock_in' => $data['status'] === 'Hadir' ? $now : '-',
                'status' => $data['status'],
                'location' => $data['location'] ?? 'Pool Utama',
                'notes' => $data['notes'] ?? null,
            ]
        );

        return response()->json([
            'message' => 'Absensi berhasil dicatat.',
            'attendance' => $attendance,
        ]);
    }

    public function clockOut(string $id): JsonResponse
    {
        $attendance = Attendance::findOrFail($id);
        $attendance->clock_out = Carbon::now()->format('H:i') . ' WIB';
        $attendance->save();

        return response()->json([
            'message' => 'Jam pulang berhasil dicatat.',
            'attendance' => $attendance,
        ]);
    }
}