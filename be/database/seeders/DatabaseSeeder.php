<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        // 1. Super Admin (Akses Penuh)
        User::updateOrCreate(
            ['email' => 'superadmin@caruhun.com'],
            [
                'name' => 'Super Admin Caruhun',
                'password' => Hash::make('password123'),
                'role' => 'superadmin',
            ]
        );

        // 2. Admin Kantor (Operasional & Master Data)
        User::updateOrCreate(
            ['email' => 'admin@caruhun.com'],
            [
                'name' => 'Admin Operasional',
                'password' => Hash::make('password123'),
                'role' => 'admin',
            ]
        );

        // 3. Petugas Lapangan (Keberangkatan, Kedatangan, Inspeksi, Klaim)
        User::updateOrCreate(
            ['email' => 'petugas@caruhun.com'],
            [
                'name' => 'Petugas Lapangan',
                'password' => Hash::make('password123'),
                'role' => 'petugas',
            ]
        );

        // Akun lama untuk kompatibilitas
        User::updateOrCreate(
            ['email' => 'admin@rental.test'],
            [
                'name' => 'Admin Demo',
                'password' => Hash::make('password123'),
                'role' => 'superadmin',
            ]
        );

        // 4. Data Demo Armada Kendaraan, Pelanggan, Paket Sewa & Booking
        $this->call(DemoDataSeeder::class);
    }
}