<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;
use Inertia\Inertia;

use App\Http\Controllers\DashboardController;

use App\Http\Controllers\WalletController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\TransactionController;

use App\Http\Controllers\Auth\GoogleController;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::get('/auth/google', [GoogleController::class, 'redirectToGoogle'])->name('auth.google');
Route::get('/auth/google/callback', [GoogleController::class, 'handleGoogleCallback'])->name('auth.google.callback');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    Route::resource('wallets', WalletController::class)->except(['create', 'show', 'edit']);
    Route::resource('categories', CategoryController::class)->except(['create', 'show', 'edit']);
    Route::resource('transactions', TransactionController::class)->except(['index', 'create', 'show', 'edit']);
});

require __DIR__ . '/settings.php';
