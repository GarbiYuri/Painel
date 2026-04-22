<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;
use App\Http\Controllers\ClienteController; 

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [ClienteController::class, 'index'])->name('dashboard');
    Route::resource('clientes', ClienteController::class);
});

require __DIR__.'/settings.php';
