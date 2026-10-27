<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    /**
     * Met à jour le profil du candidat (compétences, expériences) utilisé par l'analyse IA.
     */
    public function update(Request $request): JsonResponse
    {
        $data = $request->validate([
            'profile' => ['nullable', 'string', 'max:10000'],
        ]);

        $request->user()->update($data);

        return response()->json($request->user());
    }
}
