<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\JobApplicationAnalysisController;
use App\Http\Controllers\Api\JobApplicationController;
use App\Http\Controllers\Api\ProfileController;
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
    Route::put('/profile', [ProfileController::class, 'update']);

    // CRUD des candidatures : index, store, show, update, destroy
    Route::apiResource('applications', JobApplicationController::class);

    // Analyse IA d'une offre (limitée à 10 par minute pour maîtriser le quota de l'API)
    Route::post('/applications/{application}/analyze', JobApplicationAnalysisController::class)
        ->middleware('throttle:10,1');
});
