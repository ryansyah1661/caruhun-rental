<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Handover;
use App\Models\Vehicle;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AdminClaimController extends Controller
{
    /**
     * List seluruh laporan kerusakan & klaim
     */
    public function index(Request $request): JsonResponse
    {
        $claims = collect();
        $counter = 1;

        $urlHelper = function ($path) {
            if (!$path) return null;
            if (str_starts_with($path, 'http') || str_starts_with($path, 'data:')) return $path;
            $apiBase = rtrim(config('app.url', 'http://localhost:8000'), '/');
            return $apiBase . '/storage/' . ltrim($path, '/');
        };

        // 1. Ambil klaim dari Handover Arrival yang berstatus damaged
        $arrivalHandovers = Handover::with(['booking.vehicle', 'booking.customer'])
            ->where('type', 'arrival')
            ->orderBy('handed_at', 'desc')
            ->get();

        $processedVehicleIds = [];

        foreach ($arrivalHandovers as $handover) {
            if (!$handover->condition_notes) continue;
            $data = json_decode($handover->condition_notes, true);
            if (!is_array($data)) continue;

            if (($data['condition_status'] ?? '') === 'damaged') {
                $b = $handover->booking;
                $v = $b ? $b->vehicle : null;
                $c = $b ? $b->customer : null;

                if ($v) {
                    $processedVehicleIds[] = (string) $v->id;
                }

                $status = ($v && $v->status === 'maintenance') ? 'Dalam Perbaikan' : 'Pending';
                if ($v && $v->status === 'available') {
                    $status = 'Selesai';
                }

                $claimCode = '#CLM-' . str_pad($counter++, 3, '0', STR_PAD_LEFT);
                $damagePhoto = isset($data['photos']['damage']) ? $urlHelper($data['photos']['damage']) : null;

                $claims->push([
                    'id' => (string) $handover->id,
                    'code' => $claimCode,
                    'bookingCode' => $b ? ($b->code ? '#' . ltrim($b->code, '#') : null) : null,
                    'vehicleId' => $v ? (string) $v->id : null,
                    'unit' => $v ? $v->full_name : 'Armada Kendaraan',
                    'nopol' => $v ? $v->plate_number : '-',
                    'issue' => $data['damage_description'] ?: ($data['notes'] ?: 'Ditemukan baret / kerusakan fisik pasca sewa'),
                    'reporter' => $c ? $c->name . ' (Penyewa)' : 'Petugas Lapangan',
                    'reporterPhone' => $c ? $c->phone : '-',
                    'estimatedCost' => (int) ($data['estimated_cost'] ?? 0),
                    'photo' => $damagePhoto,
                    'date' => $handover->handed_at ? $handover->handed_at->translatedFormat('d M Y, H:i') : Carbon::parse($handover->updated_at)->translatedFormat('d M Y, H:i'),
                    'status' => $status,
                    'source' => 'arrival_checkin',
                ]);
            }
        }

        // 2. Ambil kendaraan yang berstatus 'maintenance' yang belum masuk di list di atas
        $maintenanceVehicles = Vehicle::where('status', 'maintenance')
            ->whereNotIn('id', $processedVehicleIds)
            ->get();

        foreach ($maintenanceVehicles as $v) {
            $claimCode = '#CLM-' . str_pad($counter++, 3, '0', STR_PAD_LEFT);
            $claims->push([
                'id' => (string) $v->id,
                'code' => $claimCode,
                'bookingCode' => null,
                'vehicleId' => (string) $v->id,
                'unit' => $v->full_name,
                'nopol' => $v->plate_number,
                'issue' => $v->notes ?: 'Perawatan Rutin Bengkel / Pemeriksaan Komponen',
                'reporter' => 'Petugas Lapangan (Pool)',
                'reporterPhone' => '-',
                'estimatedCost' => 0,
                'photo' => null,
                'date' => Carbon::parse($v->updated_at)->translatedFormat('d M Y, H:i'),
                'status' => 'Dalam Perbaikan',
                'source' => 'manual_maintenance',
            ]);
        }

        // 3. Fallback jika sistem baru pertama kali dibuka tanpa data klaim
        if ($claims->isEmpty()) {
            $claims->push([
                'id' => 'sample-1',
                'code' => '#CLM-001',
                'bookingCode' => '#CRH-2410-085',
                'vehicleId' => null,
                'unit' => 'Honda Brio RS Urbanite',
                'nopol' => 'D 2091 AGH',
                'issue' => 'Baret halus pada bemper depan kiri saat parkir',
                'reporter' => 'Bpak Gibran (Penyewa)',
                'reporterPhone' => '0812-3344-5566',
                'estimatedCost' => 350000,
                'photo' => null,
                'date' => Carbon::now()->subDays(1)->translatedFormat('d M Y, H:i'),
                'status' => 'Dalam Perbaikan',
                'source' => 'sample',
            ]);
        }

        // Hitung statistik
        $total = $claims->count();
        $pending = $claims->where('status', 'Pending')->count();
        $inRepair = $claims->where('status', 'Dalam Perbaikan')->count();
        $resolved = $claims->where('status', 'Selesai')->count();

        return response()->json([
            'claims' => $claims->values(),
            'total' => $total,
            'stats' => [
                'total' => $total,
                'pending' => $pending,
                'inRepair' => $inRepair,
                'resolved' => $resolved,
            ],
        ]);
    }

    /**
     * Buat laporan kerusakan baru secara manual
     */
    public function store(Request $request): JsonResponse
    {
        $vehicleId = $request->input('vehicle_id');
        $issue = $request->input('issue') ?: 'Kerusakan bodi atau kendala teknis unit';
        $reporter = $request->input('reporter') ?: 'Petugas Pool Lapangan';
        $status = $request->input('status') ?: 'Dalam Perbaikan'; // 'Pending', 'Dalam Perbaikan', 'Selesai'
        $estimatedCost = (int) $request->input('estimated_cost', 0);

        // Cari kendaraan
        $vehicle = null;
        if ($vehicleId && Str::isUuid($vehicleId)) {
            $vehicle = Vehicle::find($vehicleId);
        }
        if (!$vehicle) {
            $vehicle = Vehicle::first();
        }

        // Simpan foto jika ada
        $saveFile = function ($fileOrBase64, $folder = 'claims') {
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
            return null;
        };

        $photoPath = $saveFile($request->input('photo') ?: $request->file('photo'));

        // Update status armada di PostgreSQL
        if ($vehicle) {
            if ($status === 'Selesai') {
                $vehicle->status = 'available';
                $vehicle->notes = null;
            } else {
                $vehicle->status = 'maintenance';
                $costStr = $estimatedCost > 0 ? ' (Est: Rp ' . number_format($estimatedCost, 0, ',', '.') . ')' : '';
                $vehicle->notes = 'Laporan Kerusakan: ' . $issue . $costStr . ' - Pelapor: ' . $reporter;
            }
            $vehicle->save();
        }

        return response()->json([
            'success' => true,
            'message' => 'Laporan kerusakan armada berhasil dicatat ke sistem.',
            'vehicle' => $vehicle ? [
                'id' => (string) $vehicle->id,
                'name' => $vehicle->full_name,
                'plateNumber' => $vehicle->plate_number,
                'status' => $vehicle->status,
            ] : null,
        ]);
    }

    /**
     * Update status klaim (Pending -> Dalam Perbaikan -> Selesai)
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $newStatus = $request->input('status', 'Selesai'); // 'Pending', 'Dalam Perbaikan', 'Selesai'

        // 1. Cek apakah ID merujuk ke Handover
        $handover = Handover::with('booking.vehicle')->find($id);
        if ($handover && $handover->condition_notes) {
            $data = json_decode($handover->condition_notes, true);
            if (is_array($data)) {
                $data['condition_status'] = $newStatus === 'Selesai' ? 'ok' : 'damaged';
                $handover->condition_notes = json_encode($data, JSON_UNESCAPED_SLASHES);
                $handover->save();

                if ($handover->booking && $handover->booking->vehicle) {
                    $v = $handover->booking->vehicle;
                    $v->status = $newStatus === 'Selesai' ? 'available' : 'maintenance';
                    if ($newStatus === 'Selesai') {
                        $v->notes = null;
                    }
                    $v->save();
                }

                return response()->json([
                    'success' => true,
                    'message' => 'Status klaim berhasil diperbarui menjadi ' . $newStatus . '.',
                ]);
            }
        }

        // 2. Cek apakah ID merujuk ke Vehicle
        $vehicle = Vehicle::find($id);
        if ($vehicle) {
            $vehicle->status = $newStatus === 'Selesai' ? 'available' : 'maintenance';
            if ($newStatus === 'Selesai') {
                $vehicle->notes = null;
            }
            $vehicle->save();

            return response()->json([
                'success' => true,
                'message' => 'Status kendaraan ' . $vehicle->full_name . ' berhasil diperbarui menjadi ' . ($newStatus === 'Selesai' ? 'Tersedia' : 'Dalam Perbaikan') . '.',
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Status berhasil diselaraskan.',
        ]);
    }

    /**
     * Tandai klaim selesai & kembalikan armada ke pool
     */
    public function resolve(string $id): JsonResponse
    {
        $request = new Request(['status' => 'Selesai']);
        return $this->update($request, $id);
    }
}
