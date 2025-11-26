<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    /**
     * Trata o login do utilizador e devolve o token.
     */
    public function login(Request $request)
    {
        // 1. Validar se o email e password foram enviados
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // 2. Tentar autenticar com as credenciais
        if (!Auth::attempt($credentials)) {
            // Se falhar (email ou password errados)
            return response()->json(['message' => 'Credenciais inválidas'], 401);
        }

        // 3. Obter o utilizador autenticado
        $user = Auth::user();

        // 4. (Opcional mas recomendado para o projeto)
        // Verificar se o utilizador está "blocked" antes de deixar entrar
        if ($user->blocked) {
            Auth::guard('web')->logout(); // Limpa a sessão interna se existir
            return response()->json(['message' => 'A sua conta está bloqueada. Contacte o administrador.'], 403);
        }

        // 5. Revogar tokens antigos (Opcional: garante que só há 1 sessão ativa)
        // $user->tokens()->delete();

        // 6. Criar um novo token de acesso
        $token = $user->createToken('auth-token')->plainTextToken;

        // 7. Retornar o token e os dados do user (para o Frontend usar)
        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user,
        ]);
    }

    /**
     * Trata o logout (apaga o token).
     */
    public function logout(Request $request)
    {
        // Apaga apenas o token que foi usado neste pedido
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Sessão terminada com sucesso'
        ]);
    }
}
