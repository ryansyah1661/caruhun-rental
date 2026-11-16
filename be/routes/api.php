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

Route::get('/ping', fn() => ['ok' => true]);
Route::post('/login', [AuthController::class, 'login']);

// Route Publik
Route::prefix('public')->group(function () {
    Route::get('/pages/{slug}', [PublicContentController::class, 'page']);
    Route::get('/vehicles', [PublicContentController::class, 'vehicles']);
});

// Route Admin (Terproteksi Sanctum)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/admin/dashboard', [AdminDashboardController::class, 'index']);
    Route::get('/admin/bookings', [AdminBookingController::class, 'index']);
    Route::get('/admin/departures', [AdminDepartureController::class, 'index']);
    Route::get('/admin/arrivals', [AdminArrivalController::class, 'index']);
    Route::get('/admin/rentals', [AdminRentalHistoryController::class, 'index']);

    // Kendaraan (Index, Update, Destroy)
    Route::get('/admin/vehicles', [AdminVehicleController::class, 'index']);
    Route::put('/admin/vehicles/{id}', [AdminVehicleController::class, 'update']);
    Route::delete('/admin/vehicles/{id}', [AdminVehicleController::class, 'destroy']);

    // Pelanggan (Index, Update, Destroy)
    Route::get('/admin/customers', [AdminCustomerController::class, 'index']);
    Route::put('/admin/customers/{id}', [AdminCustomerController::class, 'update']);
    Route::delete('/admin/customers/{id}', [AdminCustomerController::class, 'destroy']);

    Route::get('/admin/inspections', [AdminInspectionController::class, 'index']);
    Route::get('/admin/claims', [AdminClaimController::class, 'index']);
});