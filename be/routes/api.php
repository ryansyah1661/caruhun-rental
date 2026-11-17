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

// Public Endpoints
Route::get('/catalog', [PublicContentController::class, 'catalog']);
Route::get('/page-content/{slug}', [PublicContentController::class, 'getPageContent']);

// Authentication
Route::post('/login', [AuthController::class, 'login']);

// Protected Admin Routes (Sanctum)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/admin/dashboard', [AdminDashboardController::class, 'index']);
    Route::get('/admin/bookings', [AdminBookingController::class, 'index']);
    Route::get('/admin/departures', [AdminDepartureController::class, 'index']);
    Route::get('/admin/arrivals', [AdminArrivalController::class, 'index']);
    Route::get('/admin/rentals', [AdminRentalHistoryController::class, 'index']);

    // Kendaraan
    Route::get('/admin/vehicles', [AdminVehicleController::class, 'index']);
    Route::post('/admin/vehicles', [AdminVehicleController::class, 'store']);
    Route::put('/admin/vehicles/{id}', [AdminVehicleController::class, 'update']);
    Route::delete('/admin/vehicles/{id}', [AdminVehicleController::class, 'destroy']);

    // Pelanggan
    Route::get('/admin/customers', [AdminCustomerController::class, 'index']);
    Route::post('/admin/customers', [AdminCustomerController::class, 'store']);
    Route::put('/admin/customers/{id}', [AdminCustomerController::class, 'update']);
    Route::delete('/admin/customers/{id}', [AdminCustomerController::class, 'destroy']);

    // Manajemen Pengguna (User CRUD)
    Route::get('/admin/users', [AdminUserController::class, 'index']);
    Route::post('/admin/users', [AdminUserController::class, 'store']);
    Route::put('/admin/users/{id}', [AdminUserController::class, 'update']);
    Route::delete('/admin/users/{id}', [AdminUserController::class, 'destroy']);

    // Kehadiran (Attendance)
    Route::get('/admin/attendances', [AdminAttendanceController::class, 'index']);
    Route::post('/admin/attendances', [AdminAttendanceController::class, 'store']);
    Route::put('/admin/attendances/{id}/clock-out', [AdminAttendanceController::class, 'clockOut']);

    Route::get('/admin/inspections', [AdminInspectionController::class, 'index']);
    Route::get('/admin/claims', [AdminClaimController::class, 'index']);
});