<?php

use App\Models\User;
use Laravel\Sanctum\Sanctum;

it('inscrit un utilisateur et renvoie un jeton', function () {
    $response = $this->postJson('/api/register', [
        'name' => 'Soumaya',
        'email' => 'soumaya@example.com',
        'password' => 'motdepasse123',
        'password_confirmation' => 'motdepasse123',
    ]);

    $response->assertCreated()
        ->assertJsonStructure(['user' => ['id', 'name', 'email'], 'token']);

    $this->assertDatabaseHas('users', ['email' => 'soumaya@example.com']);
});

it('refuse une inscription avec un email déjà utilisé', function () {
    User::factory()->create(['email' => 'soumaya@example.com']);

    $this->postJson('/api/register', [
        'name' => 'Soumaya',
        'email' => 'soumaya@example.com',
        'password' => 'motdepasse123',
        'password_confirmation' => 'motdepasse123',
    ])->assertUnprocessable()->assertJsonValidationErrors('email');
});

it('connecte un utilisateur avec les bons identifiants', function () {
    User::factory()->create([
        'email' => 'soumaya@example.com',
        'password' => 'motdepasse123',
    ]);

    $this->postJson('/api/login', [
        'email' => 'soumaya@example.com',
        'password' => 'motdepasse123',
    ])->assertOk()->assertJsonStructure(['user', 'token']);
});

it('refuse une connexion avec un mauvais mot de passe', function () {
    User::factory()->create([
        'email' => 'soumaya@example.com',
        'password' => 'motdepasse123',
    ]);

    $this->postJson('/api/login', [
        'email' => 'soumaya@example.com',
        'password' => 'mauvais-mot-de-passe',
    ])->assertUnprocessable()->assertJsonValidationErrors('email');
});

it("renvoie l'utilisateur connecté", function () {
    $user = User::factory()->create();
    Sanctum::actingAs($user);

    $this->getJson('/api/me')
        ->assertOk()
        ->assertJson(['email' => $user->email]);
});

it('bloque les routes protégées sans jeton', function () {
    $this->getJson('/api/me')->assertUnauthorized();
});

it('déconnecte en supprimant le jeton', function () {
    $user = User::factory()->create();
    $token = $user->createToken('auth')->plainTextToken;

    $this->withToken($token)
        ->postJson('/api/logout')
        ->assertOk();

    expect($user->tokens()->count())->toBe(0);
});