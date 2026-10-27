<?php

namespace App\Http\Controllers\Api;

use App\Exceptions\OfferAnalysisException;
use App\Http\Controllers\Controller;
use App\Http\Resources\JobApplicationResource;
use App\Models\JobApplication;
use App\Services\GeminiOfferAnalyzer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\ValidationException;

class JobApplicationAnalysisController extends Controller
{
    /**
     * Analyse l'offre d'une candidature avec l'IA et enregistre le résultat.
     */
    public function __invoke(
        Request $request,
        JobApplication $application,
        GeminiOfferAnalyzer $analyzer,
    ): JobApplicationResource|JsonResponse {
        Gate::authorize('update', $application);

        $data = $request->validate([
            'offer_text' => ['required', 'string', 'min:50', 'max:20000'],
        ]);

        $profile = $request->user()->profile;

        if (blank($profile)) {
            throw ValidationException::withMessages([
                'profile' => ['Renseigne d’abord ton profil (compétences, expériences) pour lancer une analyse.'],
            ]);
        }

        try {
            $analysis = $analyzer->analyze(
                $profile,
                $data['offer_text'],
                $request->getPreferredLanguage(['fr', 'en']) ?? 'fr',
            );
        } catch (OfferAnalysisException $exception) {
            report($exception); // le détail technique va dans les logs, pas à l'utilisateur

            return response()->json([
                'message' => 'L’analyse IA est momentanément indisponible. Réessaie dans quelques instants.',
            ], 503);
        }

        $application->forceFill([
            'offer_text' => $data['offer_text'],
            'analysis' => $analysis,
            'analyzed_at' => now(),
        ])->save();

        return JobApplicationResource::make($application);
    }
}
