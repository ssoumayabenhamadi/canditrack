<?php

use App\Models\JobApplication;
use App\Models\User;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Sleep;
use Laravel\Sanctum\Sanctum;

/**
 * Fausse réponse de Gemini : le JSON de l'analyse est renvoyé sous forme de texte.
 *
 * @param  array<string, mixed>  $analysis
 * @return array<string, mixed>
 */
function geminiResponse(array $analysis): array
{
    return [
        'candidates' => [[
            'content' => ['parts' => [['text' => json_encode($analysis)]]],
        ]],
    ];
}

beforeEach(function () {
    config(['services.gemini.key' => 'test-key', 'services.gemini.model' => 'gemini-test']);

    $this->user = User::factory()->create([
        'profile' => 'Développeuse Full Stack : PHP, Laravel, Symfony, React, Pest, Cypress, GitLab CI.',
    ]);
    Sanctum::actingAs($this->user);

    $this->application = JobApplication::factory()->for($this->user)->create();
    $this->offer = 'Nous recherchons un développeur Laravel / React avec une expérience de Docker et Kubernetes.';
});

it('analyse une offre et enregistre le résultat', function () {
    Http::fake([
        'generativelanguage.googleapis.com/*' => Http::response(geminiResponse([
            'score' => 82,
            'summary' => 'Très bon profil pour ce poste.',
            'matching_skills' => ['Laravel', 'React'],
            'missing_skills' => ['Kubernetes'],
        ])),
    ]);

    $this->postJson("/api/applications/{$this->application->id}/analyze", ['offer_text' => $this->offer])
        ->assertOk()
        ->assertJsonPath('data.analysis.score', 82)
        ->assertJsonPath('data.analysis.matching_skills', ['Laravel', 'React'])
        ->assertJsonPath('data.analysis.missing_skills', ['Kubernetes'])
        ->assertJsonPath('data.offer_text', $this->offer);

    expect($this->application->fresh()->analyzed_at)->not->toBeNull();

    // On vérifie la requête envoyée à Gemini : bonne URL, clé, profil et offre
    Http::assertSent(fn (Request $request) => str_contains($request->url(), 'models/gemini-test:generateContent')
        && $request->hasHeader('x-goog-api-key', 'test-key')
        && str_contains($request['contents'][0]['parts'][0]['text'], 'Kubernetes')
        && str_contains($request['contents'][0]['parts'][0]['text'], 'Symfony'));
});

it('garde un score entre 0 et 100', function () {
    Http::fake([
        'generativelanguage.googleapis.com/*' => Http::response(geminiResponse([
            'score' => 150,
            'summary' => 'Score hors limites.',
            'matching_skills' => [],
            'missing_skills' => [],
        ])),
    ]);

    $this->postJson("/api/applications/{$this->application->id}/analyze", ['offer_text' => $this->offer])
        ->assertOk()
        ->assertJsonPath('data.analysis.score', 100);
});

it('exige un profil renseigné avant d’analyser', function () {
    Http::fake();
    $this->user->update(['profile' => null]);

    $this->postJson("/api/applications/{$this->application->id}/analyze", ['offer_text' => $this->offer])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('profile');

    Http::assertNothingSent();
});

it('exige le texte de l’offre', function () {
    Http::fake();

    $this->postJson("/api/applications/{$this->application->id}/analyze", ['offer_text' => ''])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('offer_text');

    Http::assertNothingSent();
});

it('réessaie quand Gemini est momentanément surchargé', function () {
    Sleep::fake(); // pas de vraie attente pendant les tests

    Http::fake([
        'generativelanguage.googleapis.com/*' => Http::sequence()
            ->push(['error' => ['message' => 'The model is overloaded.']], 503)
            ->push(geminiResponse([
                'score' => 70,
                'summary' => 'Bon profil.',
                'matching_skills' => ['Laravel'],
                'missing_skills' => [],
            ])),
    ]);

    $this->postJson("/api/applications/{$this->application->id}/analyze", ['offer_text' => $this->offer])
        ->assertOk()
        ->assertJsonPath('data.analysis.score', 70);

    Http::assertSentCount(2);
});

it('renvoie une erreur 503 si Gemini reste indisponible', function () {
    Sleep::fake();

    Http::fake([
        'generativelanguage.googleapis.com/*' => Http::response(['error' => ['message' => 'The model is overloaded.']], 503),
    ]);

    $this->postJson("/api/applications/{$this->application->id}/analyze", ['offer_text' => $this->offer])
        ->assertStatus(503);

    Http::assertSentCount(3); // 1 essai + 2 nouvelles tentatives
    expect($this->application->fresh()->analysis)->toBeNull();
});

it('interdit d’analyser la candidature d’un autre utilisateur', function () {
    Http::fake();
    $other = JobApplication::factory()->create();

    $this->postJson("/api/applications/{$other->id}/analyze", ['offer_text' => $this->offer])
        ->assertForbidden();

    Http::assertNothingSent();
});