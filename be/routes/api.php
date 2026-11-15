<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PublicContentController;
use App\Http\Controllers\Api\AdminContentController;
use App\Http\Controllers\Api\AdminDashboardController;
use App\Http\Controllers\Api\AdminBookingController;
use App\Http\Controllers\Api\AdminDepartureController;
use App\Http\Controllers\Api\AdminArrivalController;
use App\Http\Controllers\Api\AdminRentalHistoryController;
use App\Http\Controllers\Api\AdminVehicleController;
use App\Http\Controllers\Api\AdminCustomerController;
use App\Http\Controllers\Api\AdminInspectionController;
use App\Http\Controllers\Api\AdminClaimController;
use Illuminate\Support\Facades\Route;
use App\Models\Booking;

Route::get('/ping', fn() => ['ok' => true]);
Route::post('/login', [AuthController::class, 'login']);

// Endpoint Booking
Route::get('/bookings', function () {
    return response()->json(Booking::with('vehicle', 'customer')->get());
});

// Endpoint Publik untuk Next.js Frontend (Beranda, Katalog, Tarif, dll)
Route::prefix('public')->group(function () {
    Route::get('/pages/{slug}', [PublicContentController::class, 'page']);
    Route::get('/vehicles', [PublicContentController::class, 'vehicles']);
});

// Endpoint Admin Terproteksi Sanctum
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Admin Dashboard Summary
    Route::get('/admin/dashboard', [AdminDashboardController::class, 'index']);

    // Admin Booking Management
    Route::get('/admin/bookings', [AdminBookingController::class, 'index']);

    // Admin Departure Management
    Route::get('/admin/departures', [AdminDepartureController::class, 'index']);

    // Admin Arrival Management
    Route::get('/admin/arrivals', [AdminArrivalController::class, 'index']);

    // Admin Rental History Management
    Route::get('/admin/rentals', [AdminRentalHistoryController::class, 'index']);

    // Admin Vehicle Management
    Route::get('/admin/vehicles', [AdminVehicleController::class, 'index']);

    // Admin Customer Management
    Route::get('/admin/customers', [AdminCustomerController::class, 'index']);

    // Admin Inspection Management
    Route::get('/admin/inspections', [AdminInspectionController::class, 'index']);

    // Admin Claim Management
    Route::get('/admin/claims', [AdminClaimController::class, 'index']);

    Route::post('/admin/pages/{slug}/{section}', [AdminContentController::class, 'upsertSection']);
});
