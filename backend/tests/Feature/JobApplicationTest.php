<?php

use App\Enums\ApplicationStatus;
use App\Models\JobApplication;
use App\Models\User;
use Laravel\Sanctum\Sanctum;

beforeEach(function () {
    $this->user = User::factory()->create();
    Sanctum::actingAs($this->user);
});

it('liste uniquement les candidatures de l’utilisateur connecté', function () {
    JobApplication::factory()->count(2)->for($this->user)->create();
    JobApplication::factory()->create(); // appartient à un autre utilisateur

    $this->getJson('/api/applications')
        ->assertOk()
        ->assertJsonCount(2, 'data');
});

it('filtre les candidatures par statut', function () {
    JobApplication::factory()->for($this->user)->create(['status' => ApplicationStatus::Interview]);
    JobApplication::factory()->count(2)->for($this->user)->create(['status' => ApplicationStatus::Sent]);

    $this->getJson('/api/applications?status=interview')
        ->assertOk()
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('data.0.status', 'interview');
});

it('crée une candidature', function () {
    $this->postJson('/api/applications', [
        'company' => 'Externatic',
        'position' => 'Développeuse Fullstack PHP React',
        'location' => 'Montreuil',
        'applied_at' => '2026-10-23',
    ])
        ->assertCreated()
        ->assertJsonPath('data.company', 'Externatic')
        ->assertJsonPath('data.status', 'sent');

    $this->assertDatabaseHas('job_applications', [
        'company' => 'Externatic',
        'user_id' => $this->user->id,
    ]);
});

it('exige l’entreprise et le poste à la création', function () {
    $this->postJson('/api/applications', [])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['company', 'position']);
});

it('refuse un statut inconnu', function () {
    $this->postJson('/api/applications', [
        'company' => 'Hays',
        'position' => 'Développeuse Laravel',
        'status' => 'statut-inexistant',
    ])->assertUnprocessable()->assertJsonValidationErrors('status');
});

it('affiche une candidature', function () {
    $application = JobApplication::factory()->for($this->user)->create();

    $this->getJson("/api/applications/{$application->id}")
        ->assertOk()
        ->assertJsonPath('data.id', $application->id);
});

it('interdit de voir la candidature d’un autre utilisateur', function () {
    $other = JobApplication::factory()->create();

    $this->getJson("/api/applications/{$other->id}")->assertForbidden();
});

it('met à jour le statut d’une candidature', function () {
    $application = JobApplication::factory()->for($this->user)->create();

    $this->patchJson("/api/applications/{$application->id}", ['status' => 'interview'])
        ->assertOk()
        ->assertJsonPath('data.status', 'interview');

    expect($application->fresh()->status)->toBe(ApplicationStatus::Interview);
});

it('interdit de modifier la candidature d’un autre utilisateur', function () {
    $other = JobApplication::factory()->create();

    $this->patchJson("/api/applications/{$other->id}", ['status' => 'offer'])->assertForbidden();
});

it('supprime une candidature', function () {
    $application = JobApplication::factory()->for($this->user)->create();

    $this->deleteJson("/api/applications/{$application->id}")->assertNoContent();

    $this->assertDatabaseMissing('job_applications', ['id' => $application->id]);
});

it('signale une relance après 7 jours sans réponse', function () {
    $old = JobApplication::factory()->for($this->user)->create([
        'status' => ApplicationStatus::Sent,
        'applied_at' => now()->subDays(8),
    ]);
    $recent = JobApplication::factory()->for($this->user)->create([
        'status' => ApplicationStatus::Sent,
        'applied_at' => now()->subDays(2),
    ]);

    $this->getJson("/api/applications/{$old->id}")->assertJsonPath('data.needs_follow_up', true);
    $this->getJson("/api/applications/{$recent->id}")->assertJsonPath('data.needs_follow_up', false);
});