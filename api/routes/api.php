<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Rota de Teste (já deves ter esta)
Route::get('/metadata', function (Request $request) {
    return [
        'name' => 'DAD 2025/26 Bisca API',
        'version' => '0.0.1',
    ];
});

// --- R1: Login Endpoint (Público) ---

// Qualquer pessoa pode tentar fazer login
Route::post('/login', [AuthController::class, 'login']);


// --- Rotas Protegidas (Requerem Login) ---

// O middleware 'auth:sanctum' verifica se o pedido tem um token válido
Route::middleware('auth:sanctum')->group(function () {

    // Rota de Logout
    Route::post('/logout', [AuthController::class, 'logout']);

    // R1: Endpoint Autenticado (Retorna o utilizador logado)
    Route::get('/users/me', function (Request $request) {
        return $request->user();
    });
});
