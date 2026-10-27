<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\JobApplicationController;
use Illuminate\Support\Facades\Route;

// Routes publiques (limitées à 10 essais par minute contre les attaques par force brute)
Route::middleware('throttle:10,1')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

// Routes protégées : il faut envoyer un jeton valide
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // CRUD des candidatures : index, store, show, update, destroy
    Route::apiResource('applications', JobApplicationController::class);
});