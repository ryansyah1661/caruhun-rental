<?php

use App\Http\Controllers\Api\AdminArrivalController;
use App\Http\Controllers\Api\AdminAttendanceController;
use App\Http\Controllers\Api\AdminBookingController;
use App\Http\Controllers\Api\AdminClaimController;
use App\Http\Controllers\Api\AdminContentController;
use App\Http\Controllers\Api\AdminCustomerController;
use App\Http\Controllers\Api\AdminDashboardController;
use App\Http\Controllers\Api\AdminDepartureController;
use App\Http\Controllers\Api\AdminInspectionController;
use App\Http\Controllers\Api\AdminRentalHistoryController;
use App\Http\Controllers\Api\AdminUserController;
use App\Http\Controllers\Api\AdminVehicleController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PublicContentController;
use Illuminate\Support\Facades\Route;

// Auth Routes
Route::post('/login', [AuthController::class, 'login']);

// Public Landing Page, Katalog & Konten
Route::get('/catalog', [PublicContentController::class, 'vehicles']);
Route::get('/public/vehicles', [PublicContentController::class, 'vehicles']);
Route::get('/public/pages/{slug}', [PublicContentController::class, 'page']);
Route::get('/page-content/{slug}', [PublicContentController::class, 'page']);

// Authenticated Routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);

    // Admin Dashboard Summary
    Route::get('/admin/dashboard', [AdminDashboardController::class, 'index']);

    // Admin Bookings & Kalender
    Route::get('/admin/bookings', [AdminBookingController::class, 'index']);
    Route::post('/admin/bookings', [AdminBookingController::class, 'store']);
    Route::get('/admin/bookings/{id}', [AdminBookingController::class, 'show']);
    Route::put('/admin/bookings/{id}', [AdminBookingController::class, 'update']);

    // Admin Keberangkatan & Kedatangan
    Route::get('/admin/departures', [AdminDepartureController::class, 'index']);
    Route::get('/admin/departures/{id}', [AdminDepartureController::class, 'show']);
    Route::get('/admin/arrivals', [AdminArrivalController::class, 'index']);
    Route::get('/admin/arrivals/{id}', [AdminArrivalController::class, 'show']);

    // Admin Inspeksi Lapangan
    Route::get('/admin/inspections', [AdminInspectionController::class, 'index']);
    Route::post('/admin/inspections/checkout', [AdminInspectionController::class, 'storeCheckout']);
    Route::post('/admin/inspections/checkin', [AdminInspectionController::class, 'storeCheckin']);

    // Admin Kerusakan & Klaim
    Route::get('/admin/claims', [AdminClaimController::class, 'index']);
    Route::post('/admin/claims', [AdminClaimController::class, 'store']);

    // Admin Riwayat Sewa
    Route::get('/admin/rentals', [AdminRentalHistoryController::class, 'index']);
    Route::get('/admin/rentals/{id}', [AdminRentalHistoryController::class, 'show']);

    // Admin Kendaraan (Armada)
    Route::get('/admin/vehicles', [AdminVehicleController::class, 'index']);
    Route::post('/admin/vehicles', [AdminVehicleController::class, 'store']);
    Route::get('/admin/vehicles/{id}', [AdminVehicleController::class, 'show']);
    Route::put('/admin/vehicles/{id}', [AdminVehicleController::class, 'update']);
    Route::delete('/admin/vehicles/{id}', [AdminVehicleController::class, 'destroy']);

    // Admin Pelanggan
    Route::get('/admin/customers', [AdminCustomerController::class, 'index']);
    Route::post('/admin/customers', [AdminCustomerController::class, 'store']);
    Route::get('/admin/customers/{id}', [AdminCustomerController::class, 'show']);
    Route::put('/admin/customers/{id}', [AdminCustomerController::class, 'update']);
    Route::delete('/admin/customers/{id}', [AdminCustomerController::class, 'destroy']);

    // Admin Presensi Kehadiran
    Route::get('/admin/attendance', [AdminAttendanceController::class, 'index']);
    Route::post('/admin/attendance/clock-in', [AdminAttendanceController::class, 'clockIn']);
    Route::post('/admin/attendance/clock-out', [AdminAttendanceController::class, 'clockOut']);

    // Super Admin: Kelola Pengguna (Users)
    Route::get('/admin/users', [AdminUserController::class, 'index']);
    Route::post('/admin/users', [AdminUserController::class, 'store']);
    Route::get('/admin/users/{id}', [AdminUserController::class, 'show']);
    Route::put('/admin/users/{id}', [AdminUserController::class, 'update']);
    Route::delete('/admin/users/{id}', [AdminUserController::class, 'destroy']);

    // Super Admin: Kelola Konten Web
    Route::post('/admin/pages/{slug}/{section}', [AdminContentController::class, 'upsertSection']);
});