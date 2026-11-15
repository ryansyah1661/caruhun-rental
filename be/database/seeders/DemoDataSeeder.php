<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Vehicle;
use App\Models\Customer;
use App\Models\Booking;
use App\Models\RentalPackage;
use Carbon\Carbon;

class DemoDataSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Seed Paket Rental jika belum ada
        $packageHarian = RentalPackage::firstOrCreate(
            ['name' => '1 Hari'],
            [
                'duration_days' => 1,
                'is_active' => true,
            ]
        );

        $packageTigaHari = RentalPackage::firstOrCreate(
            ['name' => '3 Hari'],
            [
                'duration_days' => 3,
                'is_active' => true,
            ]
        );

        // 2. Seed Armada Mobil di PostgreSQL
        $vehiclesData = [
            [
                'plate_number' => 'B 1482 KFD',
                'brand' => 'Toyota',
                'model' => 'Avanza 1.5 G',
                'type' => 'car',
                'year' => 2023,
                'color' => 'Putih',
                'seats' => 7,
                'transmission' => 'automatic',
                'daily_price' => 450000,
                'status' => 'available',
                'show_on_web' => true,
                'notes' => 'Pool Utama - Bay 1',
            ],
            [
                'plate_number' => 'B 2884 SSR',
                'brand' => 'Toyota',
                'model' => 'Innova Zenix 2.0 V',
                'type' => 'car',
                'year' => 2024,
                'color' => 'Hitam Metalik',
                'seats' => 7,
                'transmission' => 'automatic',
                'daily_price' => 800000,
                'status' => 'booked',
                'show_on_web' => true,
                'notes' => 'Pool Utama - Bay 3',
            ],
            [
                'plate_number' => 'D 2091 AGH',
                'brand' => 'Honda',
                'model' => 'Brio RS Urbanite',
                'type' => 'car',
                'year' => 2022,
                'color' => 'Kuning',
                'seats' => 5,
                'transmission' => 'automatic',
                'daily_price' => 350000,
                'status' => 'rented',
                'show_on_web' => true,
                'notes' => 'Rute Tol Jagorawi',
            ],
            [
                'plate_number' => 'B 2390 POX',
                'brand' => 'Mitsubishi',
                'model' => 'Xpander Ultimate',
                'type' => 'car',
                'year' => 2023,
                'color' => 'Abu-abu',
                'seats' => 7,
                'transmission' => 'automatic',
                'daily_price' => 500000,
                'status' => 'rented',
                'show_on_web' => true,
                'notes' => 'Rute Bandung - Jakarta',
            ],
            [
                'plate_number' => 'B 1019 TRB',
                'brand' => 'Toyota',
                'model' => 'HiAce Commuter 16S',
                'type' => 'car',
                'year' => 2021,
                'color' => 'Silver',
                'seats' => 16,
                'transmission' => 'manual',
                'daily_price' => 1300000,
                'status' => 'maintenance',
                'show_on_web' => true,
                'notes' => 'Bengkel Resmi Auto2000 TB Simatupang - Ganti Oli',
            ],
            [
                'plate_number' => 'B 1966 SBB',
                'brand' => 'Toyota',
                'model' => 'Fortuner 2.8 VRZ',
                'type' => 'car',
                'year' => 2023,
                'color' => 'Hitam',
                'seats' => 7,
                'transmission' => 'automatic',
                'daily_price' => 1100000,
                'status' => 'available',
                'show_on_web' => true,
                'notes' => 'Pool Utama - Siap Jalan',
            ],
        ];

        $createdVehicles = [];
        foreach ($vehiclesData as $v) {
            $createdVehicles[] = Vehicle::firstOrCreate(
                ['plate_number' => $v['plate_number']],
                $v
            );
        }

        // 3. Seed Pelanggan (Customers)
        $customersData = [
            ['name' => 'PT Surya Logistik (Pak Deni)', 'phone' => '081234567801', 'id_number' => '3271010101010001'],
            ['name' => 'Ibu Maya Anggraini', 'phone' => '081234567802', 'id_number' => '3271010101010002'],
            ['name' => 'Bapak Rizky Kurniawan', 'phone' => '081234567803', 'id_number' => '3271010101010003'],
            ['name' => 'Hendro Wicaksono', 'phone' => '081234567804', 'id_number' => '3271010101010004'],
            ['name' => 'Agus Prasetyo', 'phone' => '081234567805', 'id_number' => '3271010101010005'],
        ];

        $createdCustomers = [];
        foreach ($customersData as $c) {
            $createdCustomers[] = Customer::firstOrCreate(
                ['phone' => $c['phone']],
                $c
            );
        }

        // 4. Seed Jadwal Booking (Departures & Arrivals hari ini)
        $today = Carbon::today();

        // Keberangkatan hari ini (Departures)
        Booking::firstOrCreate(
            ['code' => 'CRH-2410-091'],
            [
                'vehicle_id' => $createdVehicles[0]->id,
                'customer_id' => $createdCustomers[0]->id,
                'rental_package_id' => $packageTigaHari->id,
                'start_at' => $today->copy()->setHour(9)->setMinute(0),
                'end_at' => $today->copy()->addDays(3)->setHour(9)->setMinute(0),
                'with_driver' => false,
                'price' => 1350000,
                'status' => 'confirmed',
                'notes' => 'Siap Serah Terima di Pool',
            ]
        );

        Booking::firstOrCreate(
            ['code' => 'CRH-2410-094'],
            [
                'vehicle_id' => $createdVehicles[1]->id,
                'customer_id' => $createdCustomers[1]->id,
                'rental_package_id' => $packageHarian->id,
                'start_at' => $today->copy()->setHour(10)->setMinute(30),
                'end_at' => $today->copy()->addDays(1)->setHour(20)->setMinute(0),
                'with_driver' => true,
                'price' => 1200000,
                'status' => 'pending',
                'notes' => 'Menunggu verifikasi fisik keluar',
            ]
        );

        // Kedatangan hari ini (Arrivals)
        Booking::firstOrCreate(
            ['code' => 'CRH-2410-085'],
            [
                'vehicle_id' => $createdVehicles[2]->id,
                'customer_id' => $createdCustomers[2]->id,
                'rental_package_id' => $packageHarian->id,
                'start_at' => $today->copy()->subDays(2)->setHour(14)->setMinute(30),
                'end_at' => $today->copy()->setHour(14)->setMinute(30),
                'with_driver' => false,
                'price' => 700000,
                'status' => 'ongoing',
                'notes' => 'Status BBM Sesuai (F)',
            ]
        );

        // Kedatangan telat (Overdue)
        Booking::firstOrCreate(
            ['code' => 'CRH-2410-077'],
            [
                'vehicle_id' => $createdVehicles[3]->id,
                'customer_id' => $createdCustomers[4]->id,
                'rental_package_id' => $packageHarian->id,
                'start_at' => $today->copy()->subDays(3)->setHour(10)->setMinute(0),
                'end_at' => $today->copy()->subHours(3),
                'with_driver' => false,
                'price' => 1500000,
                'status' => 'ongoing',
                'notes' => 'Terlambat pengembalian lebih dari 2 jam',
            ]
        );

        // 5. Seed Data Booking Kalender (Oktober 2026 & sekitarnya sesuai UI Mockup)
        Booking::firstOrCreate(
            ['code' => 'CRH-2410-088'],
            [
                'vehicle_id' => $createdVehicles[2]->id,
                'customer_id' => $createdCustomers[2]->id,
                'rental_package_id' => $packageHarian->id,
                'start_at' => Carbon::create(2026, 10, 10, 10, 0, 0),
                'end_at' => Carbon::create(2026, 10, 12, 10, 0, 0),
                'with_driver' => false,
                'price' => 700000,
                'status' => 'ongoing',
                'notes' => 'Disewa - Pool Utama',
            ]
        );

        Booking::firstOrCreate(
            ['code' => 'BK-2024-1024'],
            [
                'vehicle_id' => $createdVehicles[1]->id,
                'customer_id' => $createdCustomers[3]->id,
                'rental_package_id' => $packageTigaHari->id,
                'start_at' => Carbon::create(2026, 10, 24, 9, 0, 0),
                'end_at' => Carbon::create(2026, 10, 28, 9, 0, 0),
                'with_driver' => false,
                'price' => 3200000,
                'status' => 'confirmed',
                'notes' => 'Dipesan - Siap Ready di Pool Cilandak',
            ]
        );

        Booking::firstOrCreate(
            ['code' => 'CRH-2410-095'],
            [
                'vehicle_id' => $createdVehicles[4]->id,
                'customer_id' => $createdCustomers[0]->id,
                'rental_package_id' => $packageHarian->id,
                'start_at' => Carbon::create(2026, 10, 25, 8, 0, 0),
                'end_at' => Carbon::create(2026, 10, 27, 17, 0, 0),
                'with_driver' => false,
                'price' => 0,
                'status' => 'maintenance',
                'notes' => 'Servis Rutin 10.000km di Auto2000',
            ]
        );

        Booking::firstOrCreate(
            ['code' => 'CRH-2409-012'],
            [
                'vehicle_id' => $createdVehicles[5]->id,
                'customer_id' => $createdCustomers[4]->id,
                'rental_package_id' => $packageHarian->id,
                'start_at' => Carbon::create(2026, 9, 15, 8, 0, 0),
                'end_at' => Carbon::create(2026, 9, 17, 8, 0, 0),
                'with_driver' => false,
                'price' => 2200000,
                'status' => 'completed',
                'notes' => 'Selesai tanpa kendala',
            ]
        );

        Booking::firstOrCreate(
            ['code' => 'CRH-2411-002'],
            [
                'vehicle_id' => $createdVehicles[2]->id,
                'customer_id' => $createdCustomers[1]->id,
                'rental_package_id' => $packageHarian->id,
                'start_at' => Carbon::create(2026, 11, 5, 9, 0, 0),
                'end_at' => Carbon::create(2026, 11, 6, 9, 0, 0),
                'with_driver' => false,
                'price' => 350000,
                'status' => 'confirmed',
                'notes' => 'Dipesan untuk wisata keluarga',
            ]
        );

        Booking::firstOrCreate(
            ['code' => 'CRH-2410-070'],
            [
                'vehicle_id' => $createdVehicles[0]->id,
                'customer_id' => $createdCustomers[4]->id,
                'rental_package_id' => $packageHarian->id,
                'start_at' => Carbon::create(2026, 10, 18, 9, 0, 0),
                'end_at' => Carbon::create(2026, 10, 19, 9, 0, 0),
                'with_driver' => false,
                'price' => 450000,
                'status' => 'completed',
                'notes' => 'Paket 1 Hari (24 Jam)',
            ]
        );
    }
}
