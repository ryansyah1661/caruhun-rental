<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PageContent;
use App\Models\Vehicle;

class PublicContentController extends Controller
{
    // GET /api/public/pages/{slug}
    public function page(string $slug)
    {
        $sections = PageContent::where('page_slug', $slug)
            ->get()
            ->keyBy('section_key');

        return response()->json([
            'page_slug' => $slug,
            'sections' => $sections,
        ]);
    }

    // GET /api/public/vehicles (Untuk Katalog & Tarif)
    public function vehicles()
    {
        $vehicles = Vehicle::with('photos')
            ->where('show_on_web', true)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($v) {
                return [
                    'id' => $v->id,
                    'name' => $v->full_name,
                    'brand' => $v->brand,
                    'model' => $v->model,
                    'category' => $v->category ?? 'mpv',
                    'categoryLabel' => $v->category_label ?? strtoupper($v->category ?? 'MPV'),
                    'transmission' => $v->transmission ?? 'Automatic',
                    'seats' => $v->seats ?? 5,
                    'fuelType' => $v->fuel_type ?? 'Bensin',
                    'luggage' => $v->luggage ?? '3 Koper',
                    'pricePerDay' => (int) $v->daily_price,
                    'image' => $v->image_url,
                    'isAvailable' => $v->status === 'available',
                    'details' => [
                        'year' => $v->year ?? 2023,
                        'engine' => $v->engine ?? '-',
                        'description' => $v->notes ?? 'Unit terawat siap jalan.',
                        'features' => $v->features ?? [],
                    ],
                    // Data tarif lengkap untuk halaman /tarif
                    'rates' => [
                        'selfDrive' => $v->category === 'minibus' ? null : [
                            'rate12h' => $v->price_12h ? (int) $v->price_12h : null,
                            'rate24h' => (int) $v->daily_price,
                            'rate30d' => (int) $v->price_30d,
                            'deposit' => (int) $v->deposit_self_drive,
                        ],
                        'withDriver' => [
                            'rate12h' => (int) $v->driver_price_12h,
                            'rate24h' => (int) $v->driver_price_24h,
                            'overtimePerHour' => (int) $v->driver_overtime_hour,
                            'deposit' => (int) $v->deposit_with_driver,
                            'note' => $v->category === 'minibus' ? 'Wajib Driver Caruhun' : 'Unit + Jasa Driver',
                        ],
                        'airport' => [
                            'cgk' => (int) $v->airport_cgk,
                            'hlp' => (int) $v->airport_hlp,
                            'whoosh' => (int) $v->airport_whoosh,
                        ],
                    ],
                ];
            });

        return response()->json([
            'data' => $vehicles,
        ]);
    }
}