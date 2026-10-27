<?php

use App\Models\User;
use Laravel\Sanctum\Sanctum;

it('met à jour le profil du candidat', function () {
    $user = User::factory()->create();
    Sanctum::actingAs($user);

    $this->putJson('/api/profile', ['profile' => 'Développeuse PHP Laravel, React, Pest, Cypress'])
        ->assertOk()
        ->assertJsonPath('profile', 'Développeuse PHP Laravel, React, Pest, Cypress');

    expect($user->fresh()->profile)->toBe('Développeuse PHP Laravel, React, Pest, Cypress');
});

it('renvoie le profil avec l’utilisateur connecté', function () {
    $user = User::factory()->create(['profile' => 'Laravel et React']);
    Sanctum::actingAs($user);

    $this->getJson('/api/me')->assertJsonPath('profile', 'Laravel et React');
});
