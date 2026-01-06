<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PageController;
use App\Http\Controllers\Api\PageApiController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

Route::get('/', [PageController::class, 'home'])->name('home');
Route::get('/faq', [PageController::class, 'faq'])->name('faq');
Route::get('/contact', [PageController::class, 'contact'])->name('contact');
Route::get('/confidentialite', [PageController::class, 'confidentialite'])->name('confidentialite');
Route::get('/mentions-legales', [PageController::class, 'mentionsLegales'])->name('mentions-legales');

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::prefix('api')->group(function () {
    Route::get('/pages', [PageApiController::class, 'index']);
    Route::get('/pages/{slug}', [PageApiController::class, 'show']);
});


