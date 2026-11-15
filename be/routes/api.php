<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PublicContentController;
use App\Http\Controllers\Api\AdminContentController;
use App\Http\Controllers\Api\AdminDashboardController;
use App\Http\Controllers\Api\AdminBookingController;
use App\Http\Controllers\Api\AdminDepartureController;
use App\Http\Controllers\Api\AdminArrivalController;
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

    Route::post('/admin/pages/{slug}/{section}', [AdminContentController::class, 'upsertSection']);
});
