<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PublicContentController;
use App\Http\Controllers\Api\AdminContentController;
use Illuminate\Support\Facades\Route;

Route::get('/ping', fn() => ['ok' => true]);
Route::post('/login', [AuthController::class, 'login']);

// Endpoint Publik untuk Next.js Frontend (Beranda, Katalog, Tarif, dll)
Route::prefix('public')->group(function () {
    Route::get('/pages/{slug}', [PublicContentController::class, 'page']);
    Route::get('/vehicles', [PublicContentController::class, 'vehicles']);
});

// Endpoint Admin Terproteksi Sanctum
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::post('/admin/pages/{slug}/{section}', [AdminContentController::class, 'upsertSection']);
});